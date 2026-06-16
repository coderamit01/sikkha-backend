import express from "express";
import { paymentController } from "./payment.controller";
import authentication from "../../middleware/authentication";
import { UserRole } from "../../lib/auth";

const router = express.Router();

router.post(
  "/create",
  authentication(UserRole.STUDENT),
  paymentController.createPayment,
);

router.get(
  "/",
  authentication(UserRole.STUDENT, UserRole.ADMIN),
  paymentController.getPayments,
);

router.get(
  "/:paymentId",
  authentication(UserRole.STUDENT, UserRole.ADMIN),
  paymentController.getPaymentById,
);

export const paymentRoutes = router;
