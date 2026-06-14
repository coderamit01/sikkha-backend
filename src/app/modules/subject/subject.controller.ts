import { Request, Response } from "express";
import { subjectService } from "./subject.service";
import { ISubjectPayload } from "./subject.interface";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { IRequestUser } from "../../interface/requestUser.interface";

const getAllSubject = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const result = await subjectService.getAllSubject(user);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Retrieved subjects successfully",
      data: result,
    });
  })



const createSubject = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const payload: ISubjectPayload = req.body;
    const result = await subjectService.createSubject(user, payload);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Subject created successfully",
      data: result,
    });
  }
)

const updateSubject = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const { subjectId } = req.params as { subjectId: string };
    const payload: ISubjectPayload = req.body;
    const result = await subjectService.updateSubject(user, subjectId, payload);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Subject updated successfully",
      data: result,
    });
  })

const deleteSubject = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const { subjectId } = req.params as { subjectId: string };
    await subjectService.deleteSubject(user, subjectId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Subject deleted successfully",
    });
  }
)

export const subjectController = {
  getAllSubject,
  createSubject,
  updateSubject,
  deleteSubject,
};
