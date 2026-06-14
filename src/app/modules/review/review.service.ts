import { BookingStatus, User } from "../../../generated/prisma/client";
import { AppError } from "../../helpers/appError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { UserRole } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { Review } from "../../type/review";


const getAllReviews = async () => {
  return await prisma.review.findMany({
    include: {
      student: true
    }
  })
}


const createReview = async (user: IRequestUser, payload: Review) => {

  if (user.role !== UserRole.STUDENT) {
    throw new AppError("Only students can leave reviews", 403);
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: payload.bookingId,
    }
  });
  if (!booking) {
    throw new AppError("Booking not found", 404);
  }
  if (booking.studentId !== user.userId) {
    throw new AppError("You cannot review this session", 403);
  }

  if (booking.status !== BookingStatus.COMPLETED) {
    throw new AppError(
      "You can review only after the session is completed",
      403,
    );
  }

  const alreadyReview = await prisma.review.findFirst({
    where: {
      bookingId: payload.bookingId,
    },
  });
  if (alreadyReview) {
    throw new AppError("Review already submitted", 400);
  }

  const review = await prisma.review.create({
    data: {
      bookingId: payload.bookingId,
      studentId: user.userId,
      tutorId: booking.tutorId,
      rating: payload.rating,
      comment: payload.comment
    },
  });

  const stats = await prisma.review.aggregate({
    where: { tutorId: booking.tutorId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.tutor.update({
    where: { id: booking.tutorId },
    data: {
      averageRating: stats._avg.rating ?? 0,
    },
  });

  return review;
};

export const reviewService = {
  createReview, getAllReviews
};
