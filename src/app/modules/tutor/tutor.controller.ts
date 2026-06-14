import { Request, Response } from "express";
import { tutorService } from "./tutor.service";
import { TutorFilters, TutorUpdateProfile } from "../../type/tutor";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { IRequestUser, ITutorAvailability } from "../../interface/requestUser.interface";

const getAllTutors = catchAsync(async (req: Request, res: Response) => {
  const filters: TutorFilters = {
    search:    req.query.search    as string,
    category:  req.query.category  as string | string[],
    minPrice:  req.query.minPrice  as string,
    maxPrice:  req.query.maxPrice  as string,
    minRating: req.query.minRating as string,
  }

  const page  = Number(req.query.page)  || 1
  const limit = Number(req.query.limit) || 12

  const result = await tutorService.getAllTutors(filters, page, limit)

  sendResponse(res, {
    statusCode: 200,
    success:    true,
    message:    "Retrieved all tutors successfully",
    data:       result,
  })
})

const getTutorById = catchAsync(
  async (req: Request, res: Response) => {
    const { tutorId } = req.params as { tutorId: string };
    const result = await tutorService.getTutorById(tutorId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Retrive Tutor successfully",
      data: result,
    });

  }
)

const getAllAvailability = catchAsync(
  async (req: Request, res: Response) => {
    const user = req?.user as IRequestUser;
    const result = await tutorService.getAllAvailability(user);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Retrive Tutors Availability succussfully",
      data: result,
    });
  }
)



const updateProfile = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const payload: TutorUpdateProfile = req.body;
    const result = await tutorService.updateProfile(user, payload);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Profile update succussfully",
      data: result,
    });

  })

const createAvailability = catchAsync(
  async (req: Request, res: Response) => {
    const user = req?.user as IRequestUser;
    const payload: ITutorAvailability = req.body;
    const result = await tutorService.createAvailability(user, payload);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Availability create succussfully",
      data: result,
    });
  })

const updateAvialability = catchAsync(
  async (req: Request, res: Response) => {
    const user = req?.user as IRequestUser;
    const { availableId } = req.params as { availableId: string };
    const payload: ITutorAvailability = req.body;
    const result = await tutorService.updateAvialability(user, availableId, payload);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Availability updated succussfully",
      data: result,
    });
  }
)

const deleteAvialability = catchAsync(
  async (req: Request, res: Response) => {
    const user = req?.user as IRequestUser;
    const { availableId } = req.params as { availableId: string };
    const result = await tutorService.deleteAvialability(user, availableId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Availability deleted succussfully",
      data: result,
    });
  }
)

export const tutorController = {
  getAllTutors,
  updateProfile,
  getAllAvailability,
  createAvailability,
  updateAvialability,
  getTutorById,
  deleteAvialability,
};
