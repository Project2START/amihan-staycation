import { Request, Response } from "express";
import { reviewService } from "../services/review.service";

class ReviewController {
  async getReviewsByProduct(req: Request, res: Response) {
    const user = (req as any).user;
    const productId = req.params.productId;

    const result = await reviewService.getReviewsByProduct(
      productId,
      user?.user_role,
    );

    res.status(200).json({
      message: "Product reviews fetched",
      ...result,
    });
  }

  async getInAppEligibility(req: Request, res: Response) {
    const user = (req as any).user;
    const productId = req.params.productId;

    const eligibility = await reviewService.getInAppEligibility(
      productId,
      user.user_id,
    );

    res.status(200).json({
      message: "Review eligibility fetched",
      eligibility,
    });
  }

  async createInAppReview(req: Request, res: Response) {
    const user = (req as any).user;

    await reviewService.createInAppReview(req.body, user.user_id);

    res.status(201).json({
      message: "Review submitted successfully",
    });
  }

  async createImportedReview(req: Request, res: Response) {
    const user = (req as any).user;

    await reviewService.createImportedReview(req.body, user.user_id);

    res.status(201).json({
      message: "Imported review submitted successfully",
    });
  }

  async updateReviewVisibility(req: Request, res: Response) {
    const user = (req as any).user;
    const reviewId = req.params.reviewId;

    const review = await reviewService.updateReviewVisibility(
      reviewId,
      req.body,
      user.user_role,
    );

    res.status(200).json({
      message: "Review visibility updated",
      review,
    });
  }
}

export const reviewController = new ReviewController();
