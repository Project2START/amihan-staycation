import { supabase } from "../../../shared/lib/supabase";
import { productRepository } from "../repositories/product.repository";
import { ProductDTO, ProductWithPhotosDTO } from "../schemas/product.schema";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";
import { generateFilePath } from "../helpers/generateFilePath";
import { getSupabaseImagesPath } from "../helpers/getSupabaseImagesPath";

export class ProductService {
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

    if (!product) return product;

    const { createdAt, updatedAt, ...rest } = product;

    return rest;
  }
  async getAll() {
    const products = await productRepository.findAll();

    return products.map((product) => {
      const { createdAt, updatedAt, ...rest } = product;
      return rest;
    });
  }
  async getAllById(id: string) {
    const products = await productRepository.findAllById(id);

    return products.map((product) => {
      const { createdAt, updatedAt, ...rest } = product;
      return rest;
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
