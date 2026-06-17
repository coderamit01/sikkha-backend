import { BookingStatus, User } from "../../../generated/prisma/client";
import { AppError } from "../../helpers/appError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { UserRole } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { IBooking } from "../../type/booking";

const getAllBooking = async (user: IRequestUser) => {

  let whereClause = {};

  if (user.role === UserRole.STUDENT) {
    whereClause = { studentId: user.userId };
  }
  else if (user.role === UserRole.TUTOR) {

    const tutor = await prisma.tutor.findUnique({
      where: { userId: user.userId }
    })

    if (!tutor) {
      throw new AppError("Tutor profile not found", 404);
    }
    whereClause = { tutorId: tutor.id }
  }
  else if (user.role === UserRole.ADMIN) {
    whereClause = {}
  }
  else {
    throw new AppError("Unauthorized", 403);
  }


  const result = await prisma.booking.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      tutor: {
        select: {
          gender: true,
          category: true,
          user: true
        }
      },
      student: {
        select: {
          name: true,
          email: true,
          image: true
        }
      },
      availability: {
        select: {
          day: true,
          startTime: true,
          endTime: true
        }
      },
      review: {
        select: {
          bookingId: true,
          studentId: true,
          tutorId: true,
          rating: true,
          comment: true,
          student: true
        }
      },
    }
  })
  return result;

};

const getBookingById = async (user: IRequestUser, bookingId: string) => {

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tutor: {
        select: {
          gender: true,
          user: true
        }
      },
      student: {
        select: {
          name: true,
          email: true,
          image: true
        }
      },
      availability: {
        select: {
          startTime: true,
          endTime: true
        }
      },
      review: {
        select: {
          bookingId: true,
          studentId: true,
          tutorId: true,
          rating: true,
          comment: true
        }
      }
    }
  })

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (user.role === UserRole.ADMIN) {
    return booking;
  }

  if (user.role === UserRole.STUDENT) {
    if (booking.studentId !== user.userId) {
      throw new AppError("You are not authorized to view this booking", 403);
    }
    return booking;
  }

  if (user.role === UserRole.TUTOR) {
    const tutor = await prisma.tutor.findUnique({
      where: { userId: user.userId }
    })

    if (!tutor) {
      throw new AppError("Tutor profile not found", 404);
    }

    if (booking.tutorId !== tutor?.id) {
      throw new AppError("You are not authorized to view this booking", 403);
    }
    return booking;
  }
  throw new AppError("Unauthorized", 403);

};

const createBooking = async (user: IRequestUser, payload: IBooking) => {

  if (user.role !== UserRole.STUDENT) {
    throw new AppError("Only students can book", 403);
  }

  const tutor = await prisma.tutor.findUnique({
    where: {
      id: payload.tutorId,
    }
  });
  if (!tutor) {
    throw new AppError("Tutor not found", 404);
  }

  if (tutor.userId === user.userId) {
    throw new AppError("You cannot book your own session", 400);
  }

  const availability = await prisma.availability.findFirst({
    where: {
      id: payload.availabilityId
    }
  })

  if (!availability) {
    throw new AppError("Tutor not available at this time", 400);
  }

  if (availability.isBooked) {
    throw new AppError("This slot is already booked", 400);
  }

  if (availability.tutorId !== payload.tutorId) {
    throw new AppError("This slot does not belong to the selected tutor", 400);
  }

  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h! * 60 + m!;
  }


  const diffHours = (toMinutes(availability.endTime) - toMinutes(availability.startTime)) / 60;
  const totalPrice = Number(tutor.hourlyRate) * diffHours;

  const result = await prisma.booking.create({
    data: {
      studentId: user.userId,
      tutorId: payload.tutorId,
      availabilityId: payload.availabilityId,
      scheduledAt: new Date(),
      totalPrice,
    },
  });

  await prisma.availability.update({
    where: { id: payload.availabilityId },
    data: { isBooked: true }
  })

  return result;

};

const updateBookingStatus = async (user: IRequestUser, bookId: string, status: BookingStatus) => {

  const booking = await prisma.booking.findUnique({
    where: { id: bookId },
  });

  if (!booking) throw new AppError("Booking not found", 404);


  if (user.role === UserRole.STUDENT) {
    if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.COMPLETED) {
      throw new AppError("This booking is already closed and cannot be changed", 400);
    }
    if (booking.studentId !== user.userId) {
      throw new AppError("You are not authorized to update this booking", 403);
    }

    if (status !== BookingStatus.CANCELLED) {
      throw new AppError("Students can only cancel the booking", 403);
    }
  }
  else if (user.role === UserRole.TUTOR) {
    if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.COMPLETED) {
      throw new AppError("This booking is already closed and cannot be changed", 400);
    }

    const tutor = await prisma.tutor.findUnique({
      where: { userId: user.userId }
    })
    if (!tutor) {
      throw new AppError("Tutor profile not found", 404);
    }

    if (booking.tutorId !== tutor.id) {
      throw new AppError("You are not authorized to update this booking", 403);
    }
    if (status !== BookingStatus.COMPLETED) {
      throw new AppError("Tutors can only confirm or complete the booking", 403);
    }
  }
  else if (user.role === UserRole.ADMIN) {
    if (![BookingStatus.CONFIRMED, BookingStatus.CANCELLED, BookingStatus.COMPLETED, BookingStatus.PENDING].includes(status)) {
      throw new AppError("Invalid status update", 400);
    }
  }
  else {
    throw new AppError("Unauthorized", 403);
  }
  const result = await prisma.booking.update({
    where: { id: bookId },
    data: { status }
  });

  if (status === BookingStatus.CANCELLED) {
    await prisma.availability.update({
      where: { id: booking.availabilityId },
      data: { isBooked: false }
    })
  }

  if (status === BookingStatus.COMPLETED) {
    await prisma.availability.update({
      where: { id: booking.availabilityId },
      data: { isBooked: false }
    })
  }

  return result;
};

export const bookingService = {
  createBooking,
  getAllBooking,
  getBookingById,
  updateBookingStatus,
};
