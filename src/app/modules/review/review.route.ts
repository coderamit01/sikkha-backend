import express from "express";
import authentication from "../../middleware/authentication";
import { reviewController } from "./review.controller";
import { UserRole } from "../../lib/auth";

const router = express.Router();

router.get(
  "/",
  reviewController.getAllReviews,
);
router.post(
  "/",
  authentication(UserRole.STUDENT),
  reviewController.createReview,
);

export const reviewRoutes = router;
