import { supabase } from "../../../shared/lib/supabase";
import { productRepository } from "../repositories/product.repository";
import { ProductDTO } from "../schemas/product.schema";
import { Express } from "express";

export class ProductService {
  async create(newProduct: ProductDTO, photos: Express.Multer.File[]) {
    const { name, maxPersons, price, about, attributes } = newProduct;

    const product = await productRepository.create({
      name,
      maxPersons,
      price,
      about,
      attributes,
    });

    const uploadedFiles: {
      path: string;
      url: string;
      order: number;
    }[] = [];

    for (let i = 0; i < photos.length; i++) {
      const file = photos[i];

      const ext = file.originalname.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from("images")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) throw error;

      const { data } = supabase.storage.from("images").getPublicUrl(filePath);

      uploadedFiles.push({
        path: filePath, // store in DB
        url: data.publicUrl, // send to frontend
        order: i + 1,
      });
    }

    await productRepository.createMultiplePhotos({
      alt: "Amihan Staycation Unit Photo",
    });
    console.log(uploadedFiles);

    // console.log(newProduct, photos);
  }
}

export const productService = new ProductService();
