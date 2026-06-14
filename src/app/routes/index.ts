import { Router } from "express";
import { tutorRoutes } from "../modules/tutor/tutor.route";
import { categoryRoutes } from "../modules/category/category.route";
import { userRoutes } from "../modules/user/user.route";
import { bookingRoutes } from "../modules/booking/booking.route";
import authentication from "../middleware/authentication";
import { reviewRoutes } from "../modules/review/review.route";
import { authRoutes } from "../modules/auth/auth.route";
import { tutorSubjectRoutes } from "../modules/subject/subject.route";


const router = Router();


router.use("/auth", authRoutes)

router.use("/tutors", tutorRoutes);

router.use("/categories", categoryRoutes);

router.use("/tutor-subjects", tutorSubjectRoutes);

router.use("/users", userRoutes);

router.use("/bookings", bookingRoutes);

router.use("/reviews", reviewRoutes);





export const IndexRoutes = router;