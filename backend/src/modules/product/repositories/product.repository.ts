import { Prisma, PrismaClient, Product, Photo, Booking } from "@prisma/client";
import {
  AppError,
  ConflictError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";
import { supabase } from "../../../shared/lib/supabase";
import { getSupabaseImagesPath } from "../../../shared/helpers/getters/getSupabaseImagesPath";

type ProductWithPhotos = Prisma.ProductGetPayload<{
  include: {
    photos: true;
  };
}>;

const prisma = new PrismaClient();

class ProductRepository {
  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    try {
      return await prisma.product.create({ data });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError("Product already exists");
      }
      throw new AppError("Could not create product. Please try again");
    }
  }

  async findById(id: string): Promise<ProductWithPhotos | null> {
    try {
      return await prisma.product.findUnique({
        where: { id },
        include: { photos: { orderBy: { order_index: "asc" } } },
      });
    } catch (error) {
      throw new AppError("Could not fetch product. Please try again");
    }
  }

  async findAll(): Promise<ProductWithPhotos[]> {
    try {
      return await prisma.product.findMany({
        include: { photos: { orderBy: { order_index: "asc" } } },
      });
    } catch (error) {
      throw new AppError("Could not fetch products. Please try again");
    }
  }
  async findAllById(id: string): Promise<ProductWithPhotos[]> {
    try {
      return await prisma.product.findMany({
        where: { userId: id },
        orderBy: { createdAt: "desc" },
        include: { photos: { orderBy: { order_index: "asc" } } },
      });
    } catch (error) {
      throw new AppError("Could not fetch products. Please try again");
    }
  }

  async findAllByOwnerIds(ownerIds: string[]): Promise<ProductWithPhotos[]> {
    if (ownerIds.length === 0) {
      return [];
    }

    try {
      return await prisma.product.findMany({
        where: { userId: { in: ownerIds } },
        include: { photos: { orderBy: { order_index: "asc" } } },
      });
    } catch (error) {
      throw new AppError("Could not fetch products. Please try again");
    }
  }

  async findSuccessfulBookingCountsByProductIds(
    productIds: string[],
  ): Promise<Record<string, number>> {
    if (productIds.length === 0) {
      return {};
    }

    try {
      const grouped = await prisma.booking.groupBy({
        by: ["productId"],
        where: {
          productId: { in: productIds },
          status: "checked_out",
        },
        _count: {
          _all: true,
        },
      });

      return grouped.reduce<Record<string, number>>((acc, row) => {
        if (!row.productId) {
          return acc;
        }

        acc[row.productId] = row._count._all;
        return acc;
      }, {});
    } catch (error) {
      throw new AppError(
        "Could not fetch product popularity. Please try again",
      );
    }
  }

  async findAvailabilityBlockingByProductIds(
    productIds: string[],
  ): Promise<Pick<Booking, "productId" | "check_period">[]> {
    if (productIds.length === 0) {
      return [];
    }

    try {
      return await prisma.booking.findMany({
        where: {
          productId: { in: productIds },
          status: {
            in: ["pending", "action_required", "confirmed", "checked_in"],
          },
        },
        select: {
          productId: true,
          check_period: true,
        },
      });
    } catch (error) {
      throw new AppError(
        "Could not fetch product availability. Please try again",
      );
    }
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    try {
      return await prisma.product.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("Product not found");
      }
      throw new AppError("Could not update product. Please try again");
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const photos = await prisma.photo.findMany({ where: { productId: id } });

      for (const photo of photos) {
        const path = getSupabaseImagesPath(photo.image_url);

        await supabase.storage.from("images").remove([path]);
      }

      return await prisma.product.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("Product not found");
      }
      throw new AppError("Could not delete product. Please try again");
    }
  }

  // Photo methods
  async createPhoto(data: Prisma.PhotoCreateInput): Promise<Photo> {
    try {
      return await prisma.photo.create({ data });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("Product not found");
      }
      throw new AppError("Could not create photo. Please try again");
    }
  }

  async findPhoto(id: string): Promise<Photo | null> {
    try {
      return await prisma.photo.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new AppError("Could not fetch photo. Please try again");
    }
  }
  async updatePhoto(id: string, data: Prisma.PhotoUpdateInput): Promise<Photo> {
    try {
      return await prisma.photo.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("Photo not found");
      }
      throw new AppError("Could not update photo. Please try again");
    }
  }
  async createMultiplePhotos(
    data: Prisma.PhotoCreateInput[],
  ): Promise<Photo[]> {
    try {
      const photos: Photo[] = [];
      for (const photoData of data) {
        const photo = await prisma.photo.create({ data: photoData });
        photos.push(photo);
      }
      return photos;
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("Product not found");
      }
      throw new AppError("Could not create photos. Please try again");
    }
  }

  async deletePhoto(id: string): Promise<Photo> {
    try {
      return await prisma.photo.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("Photo not found");
      }
      throw new AppError("Could not delete photo. Please try again");
    }
  }
}

export const productRepository = new ProductRepository();
