import { Request, Response } from "express";
import { categoryService } from "./category.service";
import { addCategoryPayload, typeCategory } from "../../type/category";
import { AppError } from "../../helpers/appError";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { IRequestUser } from "../../interface/requestUser.interface";

const getAllCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategory();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Retrive all categories successfully",
      data: result
    })
  });

const getMyAllCategory = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const result = await categoryService.getMyAllCategory(user);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Retrive all categories successfully",
      data: result
    })
  });

const addCategoryInProfile = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const payload: addCategoryPayload = req.body;
    const result = await categoryService.addCategoryInProfile(user, payload);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category added successfully",
      data: result
    })
  });

const getSingleCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params as { categoryId: string };
    const result = await categoryService.getSingleCategory(categoryId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Retrive category successfully",
      data: result
    })
  }
)

const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    const payload: typeCategory = req.body;
    const result = await categoryService.createCategory(payload);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Category created Successfully",
      data: result
    })
  }
)

const updateCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params as { categoryId: string };
    const payload = req.body
    const result = await categoryService.updateCategory(categoryId, payload);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Update category successfully",
      data: result
    })

  }
)

const deleteCategory = catchAsync(
  async (req: Request, res: Response) => {

    const { categoryId } = req.params as { categoryId: string };
    const result = await categoryService.deleteCategory(categoryId);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Delete category successfully",
    })

  }
)

const deleteCategoryFromProfile = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const { categoryId } = req.params as { categoryId: string };
    const result = await categoryService.deleteCategoryFromProfile(user, categoryId);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Delete category successfully",
    })

  }
)

export const categoryController = {
  createCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory, getMyAllCategory, addCategoryInProfile, deleteCategoryFromProfile,
}