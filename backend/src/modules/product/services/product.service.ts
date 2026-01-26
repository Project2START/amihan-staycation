import { ProductDTO } from "../schemas/product.schema";
import { Express } from "express";

export class ProductService {
  async create(newProduct: ProductDTO, photos: Express.Multer.File[]) {}
}
