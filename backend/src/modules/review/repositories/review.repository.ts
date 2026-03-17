import { Prisma, PrismaClient, Review } from "@prisma/client";
import { AppError } from "../../../shared/helpers/appErrors";

const prisma = new PrismaClient();

class ReviewRepository {
  async create(data: Prisma.ReviewCreateInput): Promise<Review> {
    try {
      return await prisma.review.create({ data });
    } catch (error) {
      throw new AppError("Could not create review. Please try again");
    }
  }

  async findInAppByBookingAndUser(bookingId: string, userId: string) {
    try {
      return await prisma.review.findFirst({
        where: {
          bookingId,
          userId,
          isImported: false,
        },
      });
    } catch (error) {
      throw new AppError("Could not fetch review. Please try again");
    }
  }

  async findByProductId(productId: string, includeHidden: boolean) {
    try {
      return await prisma.review.findMany({
        where: {
          OR: [
            {
              booking: {
                productId,
              },
            },
            {
              productId,
            },
          ],
          ...(includeHidden ? {} : { isHidden: false }),
        },
        include: {
          user: {
            select: {
              first_name: true,
              last_name: true,
              avatar_url: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      } as any);
    } catch (error) {
      throw new AppError("Could not fetch reviews. Please try again");
    }
  }

  async findById(id: string) {
    try {
      return await prisma.review.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new AppError("Could not fetch review. Please try again");
    }
  }

  async updateVisibility(id: string, isHidden: boolean) {
    try {
      return await prisma.review.update({
        where: { id },
        data: { isHidden },
      });
    } catch (error) {
      throw new AppError(
        "Could not update review visibility. Please try again",
      );
    }
  }
}

export const reviewRepository = new ReviewRepository();
