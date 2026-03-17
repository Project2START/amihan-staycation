import { bookingRepository } from "../../booking/repositories/bookings.repository";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";
import { reviewRepository } from "../repositories/review.repository";
import {
  CreateImportedReviewDTO,
  CreateInAppReviewDTO,
  UpdateReviewVisibilityDTO,
} from "../schemas/review.schema";
import { productService } from "../../product/services/product.service";

const REVIEW_WINDOW_DAYS = 14;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

class ReviewService {
  async getReviewsByProduct(productId: string, role?: string) {
    const product = await productService.get(productId);

    if (!product) {
      throw new NotFoundError("Unit not found.");
    }

    const includeHidden = role === "admin";
    const reviews: any[] = await reviewRepository.findByProductId(
      productId,
      includeHidden,
    );

    const unit = {
      id: product.id,
      name: product.name,
      thumbnailUrl: product.photos?.[0]?.image_url ?? null,
      thumbnailAlt: product.photos?.[0]?.alt ?? product.name,
    };

    return {
      unit,
      reviews: reviews.map((review) => {
        const firstName = review.user?.first_name?.trim() ?? "";
        const lastName = review.user?.last_name?.trim() ?? "";
        const fullName = [firstName, lastName].filter(Boolean).join(" ");

        return {
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          isImported: review.isImported,
          isHidden: review.isHidden,
          source: review.source,
          createdAt: review.createdAt,
          reviewerName: review.reviewerName ?? (fullName || "Anonymous"),
          reviewerAvatarUrl: review.user?.avatar_url ?? null,
        };
      }),
    };
  }

  async getInAppEligibility(productId: string, userId: string) {
    const product = await productService.get(productId);

    if (!product) {
      throw new NotFoundError("Unit not found.");
    }

    const booking: any =
      await bookingRepository.findLatestCheckedOutByUserAndProduct(
        userId,
        productId,
      );

    const unit = {
      id: product.id,
      name: product.name,
      thumbnailUrl: product.photos?.[0]?.image_url ?? null,
      thumbnailAlt: product.photos?.[0]?.alt ?? product.name,
    };

    if (!booking || !booking.checkedOutAt) {
      return {
        canSubmit: false,
        reason: "You can only submit a review after checkout.",
        bookingId: null,
        reviewWindowEndsAt: null,
        unit,
      };
    }

    const existingReview = await reviewRepository.findInAppByBookingAndUser(
      booking.id,
      userId,
    );

    if (existingReview) {
      return {
        canSubmit: false,
        reason: "You have already submitted a review for this stay.",
        bookingId: booking.id,
        reviewWindowEndsAt: new Date(
          booking.checkedOutAt.getTime() + REVIEW_WINDOW_DAYS * ONE_DAY_MS,
        ),
        unit,
      };
    }

    const reviewWindowEndsAt = new Date(
      booking.checkedOutAt.getTime() + REVIEW_WINDOW_DAYS * ONE_DAY_MS,
    );

    const now = new Date();
    if (now > reviewWindowEndsAt) {
      return {
        canSubmit: false,
        reason:
          "Review period has expired. Reviews can only be submitted within 14 days after checkout.",
        bookingId: booking.id,
        reviewWindowEndsAt,
        unit,
      };
    }

    return {
      canSubmit: true,
      reason: "",
      bookingId: booking.id,
      reviewWindowEndsAt,
      unit,
    };
  }

  async createInAppReview(payload: CreateInAppReviewDTO, userId: string) {
    const { productId, rating, comment } = payload;

    const eligibility = await this.getInAppEligibility(productId, userId);

    if (!eligibility.unit) {
      throw new NotFoundError("Unit not found.");
    }

    if (!eligibility.canSubmit || !eligibility.bookingId) {
      throw new BadRequestError(
        eligibility.reason || "You are not eligible to submit a review.",
      );
    }

    await reviewRepository.create({
      rating,
      comment,
      isImported: false,
      booking: { connect: { id: eligibility.bookingId } },
      product: { connect: { id: productId } },
      user: { connect: { id: userId } },
    } as any);
  }

  async createImportedReview(
    payload: CreateImportedReviewDTO,
    adminId: string,
  ) {
    const { productId, reviewerName, source, originalDate, rating, comment } =
      payload;

    const product = await productService.get(productId);

    if (!product) {
      throw new NotFoundError("Unit not found.");
    }

    await reviewRepository.create({
      rating,
      comment,
      isImported: true,
      reviewerName,
      source,
      originalDate: new Date(originalDate),
      importedByUser: { connect: { id: adminId } },
      product: { connect: { id: productId } },
    } as any);
  }

  async updateReviewVisibility(
    reviewId: string,
    payload: UpdateReviewVisibilityDTO,
    role: string,
  ) {
    if (role !== "admin") {
      throw new ForbiddenError("Only admins can update review visibility.");
    }

    const review = await reviewRepository.findById(reviewId);

    if (!review) {
      throw new NotFoundError("Review not found.");
    }

    return reviewRepository.updateVisibility(reviewId, payload.isHidden);
  }
}

export const reviewService = new ReviewService();
