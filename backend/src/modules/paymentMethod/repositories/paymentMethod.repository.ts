import { Prisma, PrismaClient, PaymentMethod } from "@prisma/client";
import {
  AppError,
  ConflictError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";
import { getSupabaseImagesPath } from "../../../shared/helpers/getters/getSupabaseImagesPath";
import { supabase } from "../../../shared/lib/supabase";

const prisma = new PrismaClient();

class PaymentMethodRepository {
  async create(data: Prisma.PaymentMethodCreateInput): Promise<PaymentMethod> {
    try {
      return await prisma.paymentMethod.create({ data });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError("Payment method already exists");
      }
      throw new AppError("Could not create payment method. Please try again");
    }
  }

  async findById(id: string): Promise<PaymentMethod | null> {
    try {
      return await prisma.paymentMethod.findUnique({ where: { id } });
    } catch (error) {
      throw new AppError("Could not fetch payment method. Please try again");
    }
  }

  async findAllByUserId(userId: string): Promise<PaymentMethod[]> {
    try {
      return await prisma.paymentMethod.findMany({ where: { userId } });
    } catch (error) {
      throw new AppError("Could not fetch payment methods. Please try again");
    }
  }

  async update(
    id: string,
    data: Prisma.PaymentMethodUpdateInput,
  ): Promise<PaymentMethod> {
    try {
      return await prisma.paymentMethod.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("Payment method not found");
      }
      throw new AppError("Could not update payment method. Please try again");
    }
  }

  async delete(id: string, image_url: string): Promise<PaymentMethod> {
    try {
      const path = getSupabaseImagesPath(image_url);

      const deleted = await prisma.paymentMethod.delete({ where: { id } });

      await supabase.storage.from("images").remove([path]);

      return deleted;
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("Payment method not found");
      }
      throw new AppError("Could not delete payment method. Please try again");
    }
  }
}

export const paymentMethodRepository = new PaymentMethodRepository();
