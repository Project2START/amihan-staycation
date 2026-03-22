import { Request, Response } from "express";
import { paymentMethodService } from "../services/paymentMethod.service";

interface RequestWithFiles extends Request {
  file?: any;
}

class PaymentMethodController {
  async createPaymentMethod(req: RequestWithFiles, res: Response) {
    const user = (req as any).user;

    await paymentMethodService.create(req.body, req.file, user.user_id);

    res.status(201).json({
      message: "Payment method successfully created",
    });
  }
  async getPaymentMethod(req: Request, res: Response) {
    const user = (req as any).user;

    const { id } = req.params;

    const payment_method = await paymentMethodService.get(id, user.user_id);

    res.status(200).json({
      message: "Payment method product successfully fetched",
      payment_method,
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
  async getAllByProductId(req: Request, res: Response) {
    const query = req.query;

    if (query.productId && typeof query.productId === "string") {
      const payment_methods = await paymentMethodService.getAllByProductId(
        query.productId,
      );
      res.status(200).json({
        message: "Payment methods successfully fetched",
        payment_methods,
      });
    }
  }
  async updatePaymentMethod(req: Request, res: Response) {
    const user = (req as any).user;

    const { id } = req.params;

    await paymentMethodService.update(id, req.body, req.file, user.user_id);

    res.status(200).json({
      message: "Payment method successfully updated",
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
