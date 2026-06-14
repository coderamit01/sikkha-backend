import express from "express";
import { bookingController } from "./booking.controller";
import authentication from "../../middleware/authentication";
import { UserRole } from "../../lib/auth";

const router = express.Router();

router.get("/", authentication(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN), bookingController.getAllBooking);

router.post("/", authentication(UserRole.STUDENT), bookingController.createBooking);

router.get("/:bookingId", authentication(UserRole.ADMIN, UserRole.STUDENT, UserRole.TUTOR), bookingController.getBookingById);

router.put("/:bookingId", authentication(UserRole.ADMIN, UserRole.TUTOR, UserRole.STUDENT), bookingController.updateBookingStatus);

export const bookingRoutes = router;
