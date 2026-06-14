import { Request, Response } from "express";
import { AppError } from "../../helpers/appError";
import { bookingService } from "./booking.service";
import { BookingStatus, User } from "../../../generated/prisma/client";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { IRequestUser } from "../../interface/requestUser.interface";
import { IBooking } from "../../type/booking";

const getAllBooking = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const result = await bookingService.getAllBooking(user);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Retrive all bookings successfully",
      data: result,
    });

  })

const getBookingById = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const { bookingId } = req?.params as { bookingId: string };
    const result = await bookingService.getBookingById(user, bookingId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Retrive booking successfully",
      data: result,
    });

  }
)

const createBooking = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const payload: IBooking = req.body;
    const result = await bookingService.createBooking(user, payload);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Booked successfully",
      data: result,
    });
  }
)

const updateBookingStatus = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const { bookingId } = req?.params as { bookingId: string };
    const { status } = req.body as { status: BookingStatus };
    const result = await bookingService.updateBookingStatus(
      user,
      bookingId,
      status,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Update booking status successfully",
      data: result,
    });
  }
)

export const bookingController = {
  createBooking,
  getAllBooking,
  getBookingById,
  updateBookingStatus,
};
