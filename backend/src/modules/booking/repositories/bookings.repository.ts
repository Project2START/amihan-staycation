import { Prisma, PrismaClient, Booking, BookingHistory } from "@prisma/client";
import { AppError, ConflictError } from "../../../shared/helpers/appErrors";

const prisma = new PrismaClient();

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: {
    user: true;
    product: true;
    admin: true;
    paymentMethod: true;
    history: true;
  };
}>;

class BookingsRepository {
  async create(data: Prisma.BookingCreateInput): Promise<Booking> {
    try {
      return await prisma.booking.create({ data });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError("Booking already exists");
      }
      throw new AppError("Could not create booking. Please try again");
    }
  }

  async createBookingHistory(
    data: Prisma.BookingHistoryCreateInput,
  ): Promise<BookingHistory> {
    try {
      return await prisma.bookingHistory.create({ data });
    } catch (error) {
      throw new AppError("Could not create booking history. Please try again");
    }
  }

  async findById(id: string): Promise<BookingWithRelations | null> {
    try {
      return await prisma.booking.findUnique({
        where: { id },
        include: {
          user: true,
          admin: true,
          product: true,
          paymentMethod: true,
          history: { orderBy: { createdAt: "asc" } },
        },
      });
    } catch (error) {
      throw new AppError("Could not fetch booking. Please try again");
    }
  }

  async findAll(): Promise<Booking[]> {
    try {
      return await prisma.booking.findMany();
    } catch (error) {
      throw new AppError("Could not fetch bookings. Please try again");
    }
  }

  async findAllByUserId(userId: string): Promise<BookingWithRelations[]> {
    try {
      return await prisma.booking.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          product: true,
          admin: true,
          paymentMethod: true,
          history: true,
        },
      });
    } catch (error) {
      throw new AppError("Could not fetch bookings. Please try again");
    }
  }
  async findAllByAdminId(adminId: string): Promise<BookingWithRelations[]> {
    try {
      return await prisma.booking.findMany({
        where: { adminId },
        include: {
          user: true,
          product: true,
          admin: true,
          paymentMethod: true,
          history: true,
        },
      });
    } catch (error) {
      throw new AppError("Could not fetch bookings. Please try again");
    }
  }

  async update(id: string, data: Prisma.BookingUpdateInput): Promise<Booking> {
    try {
      return await prisma.booking.update({ where: { id }, data });
    } catch (error) {
      throw new AppError("Could not update booking. Please try again");
    }
  }

  async delete(id: string): Promise<Booking> {
    try {
      return await prisma.booking.delete({ where: { id } });
    } catch (error) {
      throw new AppError("Could not delete booking. Please try again");
    }
  }

  async deleteBookingHistory(id: string): Promise<BookingHistory> {
    try {
      return await prisma.bookingHistory.delete({ where: { id } });
    } catch (error) {
      throw new AppError("Could not delete booking history. Please try again");
    }
  }

  async findHistoryByBookingId(bookingId: string): Promise<BookingHistory[]> {
    try {
      return await prisma.bookingHistory.findMany({
        where: { bookingId },
        orderBy: { createdAt: "asc" },
      });
    } catch (error) {
      throw new AppError("Could not fetch booking history. Please try again");
    }
  }

  async findHistoryById(id: string): Promise<BookingHistory | null> {
    try {
      return await prisma.bookingHistory.findUnique({ where: { id } });
    } catch (error) {
      throw new AppError("Could not fetch booking history. Please try again");
    }
  }

  async updateBookingHistory(
    id: string,
    data: Prisma.BookingHistoryUpdateInput,
  ): Promise<BookingHistory> {
    try {
      return await prisma.bookingHistory.update({ where: { id }, data });
    } catch (error) {
      throw new AppError("Could not update booking history. Please try again");
    }
  }
}

export const bookingRepository = new BookingsRepository();
