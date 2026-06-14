import express from "express";
import { categoryController } from "./category.controller";
import authentication from "../../middleware/authentication";
import { UserRole } from "../../lib/auth";

const router = express.Router();

router.post('/', authentication(UserRole.ADMIN,UserRole.TUTOR),categoryController.createCategory);
router.get('/', categoryController.getAllCategory);
router.get('/:categoryId', categoryController.getSingleCategory);
router.put('/:categoryId', authentication(UserRole.ADMIN,UserRole.TUTOR),categoryController.updateCategory);
router.delete('/:categoryId', authentication(UserRole.ADMIN,UserRole.TUTOR),categoryController.deleteCategory);


export const categoryRoutes = router;