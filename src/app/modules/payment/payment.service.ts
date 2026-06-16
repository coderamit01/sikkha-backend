import Stripe from "stripe";
import { AppError } from "../../helpers/appError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { UserRole } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { envVars } from "../../config/env";
import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums";

const stripe = new Stripe(envVars.STRIPE_SECRET_KEY);

const createPayment = async (user: IRequestUser, bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true },
  });

  if (!booking) throw new AppError("Booking not found", 404);
  if (booking.studentId !== user.userId) throw new AppError("Unauthorized", 403);
  if (booking.payment) throw new AppError("Payment already initiated for this booking", 400);

  const amount = Math.round(Number(booking.totalPrice) * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "bdt",
    metadata: { bookingId: booking.id, studentId: user.userId },
  });

  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      studentId: user.userId,
      stripePaymentIntentId: paymentIntent.id,
      amount: booking.totalPrice,
      currency: "bdt",
      status: PaymentStatus.PENDING,
    },
  });

  return { clientSecret: paymentIntent.client_secret, paymentId: payment.id };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, envVars.STRIPE_WEBHOOK_SECRET);
  } catch {
    throw new AppError("Webhook signature verification failed", 400);
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  if (event.type === "payment_intent.succeeded") {
    const payment = await prisma.payment.update({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status:  PaymentStatus.SUCCEEDED },
    });

    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: BookingStatus.CONFIRMED },
    });
  }

  if (event.type === "payment_intent.payment_failed") {
    const payment = await prisma.payment.update({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: PaymentStatus.FAILED },
    });

    const booking = await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: BookingStatus.CANCELLED },
    });

    await prisma.availability.update({
      where: { id: booking.availabilityId },
      data: { isBooked: false },
    });
  }

  return { received: true };
};

const getPayments = async (user: IRequestUser) => {
  const whereClause = user.role === UserRole.ADMIN ? {} : { studentId: user.userId };

  return prisma.payment.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      booking: {
        select: {
          scheduledAt: true,
          status: true,
          totalPrice: true,
          availability: {
            select: { day: true, startTime: true, endTime: true },
          },
        },
      },
    },
  });
};

const getPaymentById = async (user: IRequestUser, paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: {
        include: {
          availability: { select: { day: true, startTime: true, endTime: true } },
        },
      },
    },
  });

  if (!payment) throw new AppError("Payment not found", 404);

  if (user.role !== UserRole.ADMIN && payment.studentId !== user.userId) {
    throw new AppError("Unauthorized", 403);
  }

  return payment;
};

export const paymentService = {
  createPayment,
  handleWebhook,
  getPayments,
  getPaymentById,
};
