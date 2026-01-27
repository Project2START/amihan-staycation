import { Prisma, PrismaClient, Product, Photo } from "@prisma/client";
import {
  AppError,
  ConflictError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";

const prisma = new PrismaClient();

export class ProductRepository {
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

  async findById(id: string): Promise<Product | null> {
    try {
      return await prisma.product.findUnique({ where: { id } });
    } catch (error) {
      throw new AppError("Could not fetch product. Please try again");
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return await prisma.product.findMany();
    } catch (error) {
      throw new AppError("Could not fetch products. Please try again");
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

  async findPhotosByProductId(productId: string): Promise<Photo[]> {
    try {
      return await prisma.photo.findMany({ where: { productId } });
    } catch (error) {
      throw new AppError("Could not fetch photos. Please try again");
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
