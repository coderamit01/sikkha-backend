import { Request, Response } from "express";
import { AppError } from "../../helpers/appError";
import { reviewService } from "./review.service";
import { User } from "../../../generated/prisma/client";
import { Review } from "../../type/review";
import { IRequestUser } from "../../interface/requestUser.interface";
import { sendResponse } from "../../shared/sendResponse";

const getAllReviews = async (req: Request, res: Response) => {
    const result = await reviewService.getAllReviews();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Fetch all review successfully",
      data: result,
    });
};

const createReview = async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const payload: Review = req.body;
    const result = await reviewService.createReview(user, payload);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Review Create successfully",
      data: result,
    });
};

export const reviewController = {
  createReview,getAllReviews,
};
