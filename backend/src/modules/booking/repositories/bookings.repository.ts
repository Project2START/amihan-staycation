import { Prisma, PrismaClient, Booking } from "@prisma/client";
import { AppError, ConflictError } from "../../../shared/helpers/appErrors";

const prisma = new PrismaClient();

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: { user: true; product: true };
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

  async findById(id: string): Promise<Booking | null> {
    try {
      return await prisma.booking.findUnique({ where: { id } });
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

  async findAllByAdminId(adminId: string): Promise<BookingWithRelations[]> {
    try {
      return await prisma.booking.findMany({
        where: { adminId },
        include: { user: true, product: true },
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
}

export const bookingRepository = new BookingsRepository();
