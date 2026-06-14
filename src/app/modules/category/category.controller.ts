import { Request, Response } from "express";
import { categoryService } from "./category.service";
import { typeCategory } from "../../type/category";
import { AppError } from "../../helpers/appError";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const getAllCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategory();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Retrive categories successfully",
      data: result
    })
}
)

const getSingleCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params as { categoryId: string };
    const result = await categoryService.getSingleCategory(categoryId);
    sendResponse(res,{
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
    sendResponse(res,{
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
    sendResponse(res,{
      statusCode: 201,
      success: true,
      message: "Delete category successfully",
    })
 
}
)

export const categoryController = {
  createCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory,
}