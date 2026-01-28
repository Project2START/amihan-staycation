import { supabase } from "../../../shared/lib/supabase";
import { productRepository } from "../repositories/product.repository";
import { ProductDTO } from "../schemas/product.schema";
import {
  BadRequestError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";

export class ProductService {
  async create(newProduct: ProductDTO, photos: Express.Multer.File[]) {
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
    });

    const uploadedFiles: {
      url: string;
      order: number;
    }[] = [];

    try {
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];

        if (!file.buffer) {
          throw new BadRequestError("Invalid file buffer");
        }

        const ext = file.originalname.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const filePath = `products/${fileName}`;

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
          alt: `Amihan Staycation ${name} Unit Photo `,
          image_url: uploadedFile.url,
          order_index: uploadedFile.order,
          product: { connect: { id: product.id } },
        };
      }),
    );

    return product;
  }
  async getAll() {
    const products = await productRepository.findAll();

    return await Promise.all(
      products.map(async (product) => {
        const thumbnail = await productRepository.findPhotoThumbnail(
          product.id,
          1,
        );

        const { createdAt, updatedAt, ...rest } = product;

        return { thumbnail, ...rest };
      }),
    );
  }
}

export const productService = new ProductService();
