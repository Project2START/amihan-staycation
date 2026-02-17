import { Request, Response } from "express";
import { paymentMethodService } from "../services/paymentMethod.service";

interface RequestWithFiles extends Request {
  file?: any;
}

export class PaymentMethodController {
  async createPaymentMethod(req: RequestWithFiles, res: Response) {
    console.log(req.body, req.file);

    const user = (req as any).user;

    await paymentMethodService.create(req.body, req.file, user.user_id);

    res.status(201).json({
      message: "Payment method successfully created",
    });
  }
  async getAllPaymentMethods(req: Request, res: Response) {
    const user = (req as any).user;

    const payment_methods = await paymentMethodService.getAllById(user.user_id);

    res.status(200).json({
      message: "Payment methods successfully fetched",
      payment_methods,
    });
  }
  async deletePaymentMethod(req: Request, res: Response) {
    const user = (req as any).user;

    const { id } = req.params;

    await paymentMethodService.delete(id, user.user_id);

    res
      .status(200)
      .json({ message: "Payment method product successfully deleted" });
  }
}

export const paymentMethodController = new PaymentMethodController();
