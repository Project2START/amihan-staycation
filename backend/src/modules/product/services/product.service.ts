import { supabase } from "../../../shared/lib/supabase";
import { productRepository } from "../repositories/product.repository";
import { ProductDTO, ProductWithPhotosDTO } from "../schemas/product.schema";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";
import { generateFilePath } from "../../../shared/helpers/generators/generateFilePath";
import { getSupabaseImagesPath } from "../../../shared/helpers/getters/getSupabaseImagesPath";
import { agentsService } from "../../agents/services/agents.service";
import { bookingRepository } from "../../booking/repositories/bookings.repository";
import { Prisma } from "@prisma/client";
import { reviewRepository } from "../../review/repositories/review.repository";

interface ProductSearchFilters {
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
}

type BookingCheckPeriod = {
  check_in?: string;
  check_out?: string;
};

type ProductSortMetrics = {
  isAvailable: boolean;
  popularity: number;
  rating: number;
  ratingCount: number;
};

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const hasDateOverlap = (
  searchCheckIn: string,
  searchCheckOut: string,
  bookingPeriod: Prisma.JsonValue,
) => {
  if (!bookingPeriod || typeof bookingPeriod !== "object") {
    return false;
  }

  const { check_in, check_out } = bookingPeriod as BookingCheckPeriod;

  if (!check_in || !check_out) {
    return false;
  }

  // Conflict rule: searchCheckIn < bookingCheckOut AND searchCheckOut > bookingCheckIn
  return searchCheckIn < check_out && searchCheckOut > check_in;
};

const toDateOnlyString = (date: Date) => date.toISOString().slice(0, 10);

const getDefaultAvailabilityWindow = () => {
  const now = new Date();
  const checkIn = toDateOnlyString(now);
  const checkOutDate = new Date(now);
  checkOutDate.setDate(checkOutDate.getDate() + 1);

  return {
    checkIn,
    checkOut: toDateOnlyString(checkOutDate),
  };
};

const weightedRatingScore = (rating: number, ratingCount: number) => {
  // Simple confidence weighting: products with more reviews are favored when ratings are close.
  if (ratingCount === 0) {
    return 0;
  }

  return rating * Math.log10(ratingCount + 1);
};

class ProductService {
  async create(
    newProduct: ProductDTO,
    photos: Express.Multer.File[],
    userId: string,
  ) {
    const { name, maxPersons, price, about, attributes } = newProduct;

    // Validate photos array
    if (!photos || photos.length === 0) {
      throw new BadRequestError("At least one product photo is required");
    }

    const product = await productRepository.create({
      name,
      maxPersons,
      price,
      about,
      attributes,
      user: { connect: { id: userId } },
    });

    const uploadedFiles: {
      url: string;
      order: number;
    }[] = [];

    try {
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];

        const filePath = generateFilePath(file, "products");

        const { error } = await supabase.storage
          .from("images")
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
          });

        if (error) throw new Error(error.message);

        const { data } = supabase.storage.from("images").getPublicUrl(filePath);

        if (!data?.publicUrl) {
          throw new BadRequestError("Failed to generate public URL");
        }

        uploadedFiles.push({
          url: data.publicUrl,
          order: i + 1,
        });
      }
    } catch (error) {
      // Delete the created product if uploads fail
      await productRepository.delete(product.id);
      throw error;
    }

    await productRepository.createMultiplePhotos(
      uploadedFiles.map((uploadedFile) => {
        return {
          alt: `Amihan Staycation ${name} Unit Photo`,
          image_url: uploadedFile.url,
          order_index: uploadedFile.order,
          product: { connect: { id: product.id } },
        };
      }),
    );

    return product;
  }
  async get(id: string) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const { createdAt, updatedAt, ...rest } = product;

    return rest;
  }
  async getAll(role?: string, userId?: string, filters?: ProductSearchFilters) {
    const hasCheckIn = Boolean(filters?.checkIn);
    const hasCheckOut = Boolean(filters?.checkOut);

    if (hasCheckIn !== hasCheckOut) {
      throw new BadRequestError(
        "Both checkIn and checkOut are required for date filtering",
      );
    }

    if (filters?.checkIn && !DATE_ONLY_PATTERN.test(filters.checkIn)) {
      throw new BadRequestError("checkIn must use YYYY-MM-DD format");
    }

    if (filters?.checkOut && !DATE_ONLY_PATTERN.test(filters.checkOut)) {
      throw new BadRequestError("checkOut must use YYYY-MM-DD format");
    }

    if (
      filters?.checkIn &&
      filters?.checkOut &&
      filters.checkIn >= filters.checkOut
    ) {
      throw new BadRequestError("checkOut must be after checkIn");
    }

    const minAdults =
      typeof filters?.adults === "number" && filters.adults > 0
        ? Math.floor(filters.adults)
        : 0;

    const minChildren =
      typeof filters?.children === "number" && filters.children > 0
        ? Math.floor(filters.children)
        : 0;

    const minGuests = minAdults + minChildren;

    const shouldFilterByDate = Boolean(filters?.checkIn && filters?.checkOut);

    let baseProducts;

    if (role === "agent") {
      if (!userId) {
        throw new ForbiddenError("Unauthorized access");
      }

      const agent = await agentsService.getAgentByUserId(userId);

      if (!agent) {
        throw new NotFoundError("User agent not found");
      }

      baseProducts = await productRepository.findAllByOwnerIds([agent.adminId]);
    } else if (role === "admin") {
      if (!userId) {
        throw new ForbiddenError("Unauthorized access");
      }

      baseProducts = await productRepository.findAllById(userId);
    } else {
      baseProducts = await productRepository.findAll();
    }

    let filteredProducts = baseProducts;

    if (minGuests > 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product.maxPersons >= minGuests,
      );
    }

    if (shouldFilterByDate) {
      const productIds = filteredProducts.map((product) => product.id);

      const blockingBookings =
        await bookingRepository.findBlockingByProductIds(productIds);

      const blockingProductIds = new Set(
        blockingBookings
          .filter((booking) => {
            return hasDateOverlap(
              filters!.checkIn!,
              filters!.checkOut!,
              booking.check_period,
            );
          })
          .map((booking) => booking.productId)
          .filter((productId): productId is string => Boolean(productId)),
      );

      filteredProducts = filteredProducts.filter(
        (product) => !blockingProductIds.has(product.id),
      );
    }

    const filteredProductIds = filteredProducts.map((product) => product.id);
    const [popularityByProductId, reviewRows, availabilityRows] =
      await Promise.all([
        productRepository.findSuccessfulBookingCountsByProductIds(
          filteredProductIds,
        ),
        reviewRepository.findRatingRowsByProductIds(filteredProductIds, false),
        productRepository.findAvailabilityBlockingByProductIds(
          filteredProductIds,
        ),
      ]);

    const ratingAggregateByProductId = reviewRows.reduce<
      Record<string, { total: number; count: number }>
    >((acc, row) => {
      const resolvedProductId = row.productId ?? row.booking?.productId;

      if (!resolvedProductId) {
        return acc;
      }

      if (!acc[resolvedProductId]) {
        acc[resolvedProductId] = { total: 0, count: 0 };
      }

      acc[resolvedProductId].total += row.rating;
      acc[resolvedProductId].count += 1;

      return acc;
    }, {});

    const availabilityWindow = shouldFilterByDate
      ? {
          checkIn: filters!.checkIn!,
          checkOut: filters!.checkOut!,
        }
      : getDefaultAvailabilityWindow();

    const unavailableProductIds = new Set(
      availabilityRows
        .filter((booking) => {
          if (!booking.productId) {
            return false;
          }

          return hasDateOverlap(
            availabilityWindow.checkIn,
            availabilityWindow.checkOut,
            booking.check_period as Prisma.JsonValue,
          );
        })
        .map((booking) => booking.productId)
        .filter((productId): productId is string => Boolean(productId)),
    );

    const productsWithMetrics = filteredProducts.map((product) => {
      const { createdAt, updatedAt, ...rest } = product;

      const ratingAggregate = ratingAggregateByProductId[product.id];
      const ratingCount = ratingAggregate?.count ?? 0;
      const rating = ratingCount > 0 ? ratingAggregate.total / ratingCount : 0;
      const popularity = popularityByProductId[product.id] ?? 0;
      const isAvailable = !unavailableProductIds.has(product.id);

      return {
        ...rest,
        isAvailable,
        popularity,
        rating: Number(rating.toFixed(1)),
        ratingCount,
      };
    });

    const hasActiveSearch = Boolean(
      filters?.checkIn || filters?.checkOut || minGuests > 0,
    );

    productsWithMetrics.sort((a, b) => {
      const metricA: ProductSortMetrics = {
        isAvailable: a.isAvailable,
        popularity: a.popularity,
        rating: a.rating,
        ratingCount: a.ratingCount,
      };
      const metricB: ProductSortMetrics = {
        isAvailable: b.isAvailable,
        popularity: b.popularity,
        rating: b.rating,
        ratingCount: b.ratingCount,
      };

      if (hasActiveSearch) {
        if (metricA.isAvailable !== metricB.isAvailable) {
          return metricA.isAvailable ? -1 : 1;
        }

        if (metricA.popularity !== metricB.popularity) {
          return metricB.popularity - metricA.popularity;
        }
      } else {
        if (metricA.popularity !== metricB.popularity) {
          return metricB.popularity - metricA.popularity;
        }
      }

      const weightedA = weightedRatingScore(
        metricA.rating,
        metricA.ratingCount,
      );
      const weightedB = weightedRatingScore(
        metricB.rating,
        metricB.ratingCount,
      );

      if (weightedA !== weightedB) {
        return weightedB - weightedA;
      }

      if (metricA.rating !== metricB.rating) {
        return metricB.rating - metricA.rating;
      }

      if (hasActiveSearch) {
        return a.name.localeCompare(b.name);
      }

      if (metricA.isAvailable !== metricB.isAvailable) {
        return metricA.isAvailable ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });

    return productsWithMetrics;
  }
  async getAllById(id: string) {
    const products = await productRepository.findAllById(id);

    const productIds = products.map((product) => product.id);
    const reviewRows = await reviewRepository.findRatingRowsByProductIds(
      productIds,
      false,
    );

    const ratingAggregateByProductId = reviewRows.reduce<
      Record<string, { total: number; count: number }>
    >((acc, row) => {
      const resolvedProductId = row.productId ?? row.booking?.productId;

      if (!resolvedProductId) {
        return acc;
      }

      if (!acc[resolvedProductId]) {
        acc[resolvedProductId] = { total: 0, count: 0 };
      }

      acc[resolvedProductId].total += row.rating;
      acc[resolvedProductId].count += 1;

      return acc;
    }, {});

    return products.map((product) => {
      const { createdAt, updatedAt, ...rest } = product;

      const ratingAggregate = ratingAggregateByProductId[product.id];
      const ratingCount = ratingAggregate?.count ?? 0;
      const rating = ratingCount > 0 ? ratingAggregate.total / ratingCount : 0;

      return {
        ...rest,
        rating: Number(rating.toFixed(1)),
        ratingCount,
      };
    });
  }
  async update(
    products: ProductWithPhotosDTO,
    photos: Express.Multer.File[],
    userId: string,
  ) {
    const {
      maxPersons,
      name,
      photo_ids,
      photo_slots,
      price,
      product_id,
      about,
      attributes,
    } = products;

    const product = await productRepository.findById(product_id);

    if (!product) throw new NotFoundError("Product not found");

    if (product.userId !== userId)
      throw new ForbiddenError(
        "You do not have permission to update this product",
      );

    let ordered_photos: {
      id: string;
      order_index: number;
      file: Express.Multer.File | null;
    }[] = [];
    let photo_index = 0;

    photo_slots.map((photo_slot, index) => {
      if (photo_slot === "file") {
        ordered_photos.push({
          id: photo_ids[index],
          file: photos[photo_index],
          order_index: index + 1,
        });
        photo_index++;
      } else {
        ordered_photos.push({
          id: photo_ids[index],
          file: null,
          order_index: index + 1,
        });
      }
    });

    ordered_photos.forEach(async (ordered_photo) => {
      if (ordered_photo.file) {
        const file = ordered_photo.file;
        const filePath = generateFilePath(file, "products");

        const { error } = await supabase.storage
          .from("images")
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
          });

        if (error) throw new Error(error.message);

        const { data } = supabase.storage.from("images").getPublicUrl(filePath);

        if (!data?.publicUrl) {
          throw new BadRequestError("Failed to generate public URL");
        }

        try {
          await productRepository.createPhoto({
            alt: `Amihan Staycation ${name} Unit Photo`,
            image_url: data.publicUrl,
            order_index: ordered_photo.order_index,
            product: { connect: { id: product_id } },
          });
        } catch (error) {
          const path = getSupabaseImagesPath(data.publicUrl);
          await supabase.storage.from("images").remove([path]);

          throw error;
        }
      }

      const photo = await productRepository.findPhoto(ordered_photo.id);

      if (!photo) return;

      if (photo.order_index === ordered_photo.order_index) return;

      await productRepository.updatePhoto(photo.id, {
        order_index: ordered_photo.order_index,
      });
    });

    if (products.deleted_photos.length !== 0) {
      products.deleted_photos.forEach(async (deleted_photo_id) => {
        const photoExists = await productRepository.findPhoto(deleted_photo_id);

        if (photoExists) {
          const photo = await productRepository.deletePhoto(deleted_photo_id);

          const deleted_photo_url = photo.image_url;

          const filePath = getSupabaseImagesPath(deleted_photo_url);

          await supabase.storage.from("images").remove([filePath]);
        }
      });
    }

    await productRepository.update(product_id, {
      about,
      attributes,
      maxPersons,
      name,
      price,
    });

    return;
  }
  async delete(id: string, userId: string) {
    const product = await productRepository.findById(id);

    if (!product) throw new NotFoundError("Product not found");

    if (product.userId !== userId)
      throw new ForbiddenError(
        "You do not have permission to delete this product",
      );
    await productRepository.delete(id);
  }
}

export const productService = new ProductService();
