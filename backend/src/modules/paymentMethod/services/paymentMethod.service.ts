import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";
import { supabase } from "../../../shared/lib/supabase";
import { generateFilePath } from "../../../shared/helpers/generators/generateFilePath";
import { getSupabaseImagesPath } from "../../../shared/helpers/getters/getSupabaseImagesPath";
import { productService } from "../../product/services/product.service";
import { paymentMethodRepository } from "../repositories/paymentMethod.repository";
import { PaymentMethodDTO } from "../schemas/paymentMethod.schema";

class PaymentMethodService {
  async create(
    newPaymentMethod: PaymentMethodDTO,
    qr_code: Express.Multer.File,
    userId: string,
  ) {
    const { account_name, account_number, payment_method } = newPaymentMethod;

    if (!qr_code) {
      throw new BadRequestError(
        "At least one payment method qr code photo is required",
      );
    }

    const filePath = generateFilePath(qr_code, "paymentMethods");

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, qr_code.buffer, {
        contentType: qr_code.mimetype,
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new BadRequestError("Failed to generate public URL");
    }

    try {
      await paymentMethodRepository.create({
        account_name,
        account_number,
        payment_method,
        image_url: data.publicUrl,
        user: { connect: { id: userId } },
      });

      return;
    } catch (error) {
      await supabase.storage.from("images").remove([filePath]);

      throw error;
    }
  }

  async get(paymentMethodId: string, id: string) {
    const payment_method =
      await paymentMethodRepository.findById(paymentMethodId);

    if (!payment_method) {
      throw new NotFoundError("Payment method not found");
    }

    if (payment_method.userId !== id) {
      throw new ForbiddenError(
        "You do not have permission to get this payment method",
      );
    }
    const { userId, ...rest } = payment_method;
    return rest;
  }
  async getAllById(userId: string) {
    const payment_methods =
      await paymentMethodRepository.findAllByUserId(userId);

    return payment_methods.map((payment_method) => {
      const { userId, ...rest } = payment_method;
      return rest;
    });
  }
  async getAllByProductId(productId: string) {
    const product = await productService.get(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (!product.userId) {
      throw new NotFoundError("User not found");
    }

    const payment_methods = await this.getAllById(product.userId);

    return payment_methods;
  }
  async update(
    paymentMethodId: string,
    newPaymentMethod: PaymentMethodDTO,
    qr_code: Express.Multer.File | undefined,
    userId: string,
  ) {
    const { account_name, account_number, payment_method } = newPaymentMethod;
    const pm = await paymentMethodRepository.findById(paymentMethodId);

    if (!pm) {
      throw new NotFoundError("Payment method not found");
    }

    if (pm.userId !== userId) {
      throw new ForbiddenError(
        "You do not have permission to update this payment method",
      );
    }

    if (qr_code) {
      const newFilePath = generateFilePath(qr_code, "paymentMethods");
      const oldFilePath = getSupabaseImagesPath(pm.image_url);

      const { error } = await supabase.storage
        .from("images")
        .upload(newFilePath, qr_code.buffer, {
          contentType: qr_code.mimetype,
        });

      if (error) {
        throw new Error(error.message);
      }

      const { data } = supabase.storage
        .from("images")
        .getPublicUrl(newFilePath);

      if (!data?.publicUrl) {
        throw new BadRequestError("Failed to generate public URL");
      }

      try {
        await paymentMethodRepository.update(pm.id, {
          account_name,
          account_number,
          image_url: data.publicUrl,
          payment_method,
        });

        if (oldFilePath) {
          await supabase.storage.from("images").remove([oldFilePath]);
        }
      } catch (error) {
        if (newFilePath) {
          await supabase.storage.from("images").remove([newFilePath]);
        }

        throw error;
      }
    } else {
      await paymentMethodRepository.update(pm.id, {
        account_name,
        account_number,
        payment_method,
      });
    }
  }
  async delete(paymentMethodId: string, userId: string) {
    const payment_method =
      await paymentMethodRepository.findById(paymentMethodId);

    if (!payment_method) {
      throw new NotFoundError("Payment method not found");
    }

    if (payment_method.userId !== userId) {
      throw new ForbiddenError(
        "You do not have permission to delete this payment method",
      );
    }

    await paymentMethodRepository.delete(
      paymentMethodId,
      payment_method.image_url,
    );
  }
}

export const paymentMethodService = new PaymentMethodService();
