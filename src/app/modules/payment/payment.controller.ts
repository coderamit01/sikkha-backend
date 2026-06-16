import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { IRequestUser } from "../../interface/requestUser.interface";
import { paymentService } from "./payment.service";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const { bookingId } = req.body as { bookingId: string };
  const result = await paymentService.createPayment(user, bookingId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment created successfully",
    data: result,
  });
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  const result = await paymentService.handleWebhook(req.body as Buffer, signature);
  res.json(result);
});

const getPayments = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const result = await paymentService.getPayments(user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payments retrieved successfully",
    data: result,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const { paymentId } = req.params as { paymentId: string };
  const result = await paymentService.getPaymentById(user, paymentId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});

export const paymentController = {
  createPayment,
  handleWebhook,
  getPayments,
  getPaymentById,
};
