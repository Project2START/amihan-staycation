import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";
import { supabase } from "../../../shared/lib/supabase";
import { generateFilePath } from "../../product/helpers/generateFilePath";
import { paymentMethodRepository } from "../repositories/paymentMethod.repository";
import { PaymentMethodDTO } from "../schemas/paymentMethod.schema";

export class PaymentMethodService {
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

    if (error) throw new Error(error.message);

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
  async delete(paymentMethodId: string, userId: string) {
    const payment_method =
      await paymentMethodRepository.findById(paymentMethodId);

    if (!payment_method) throw new NotFoundError("Payment method not found");

    if (payment_method.userId !== userId)
      throw new ForbiddenError(
        "You do not have permission to delete this payment method",
      );

    await paymentMethodRepository.delete(
      paymentMethodId,
      payment_method.image_url,
    );
  }
  async getAllById(userId: string) {
    const payment_methods =
      await paymentMethodRepository.findAllByUserId(userId);

    return payment_methods.map((payment_method) => {
      const { userId, ...rest } = payment_method;
      return rest;
    });
  }
}

export const paymentMethodService = new PaymentMethodService();
