import express from "express";
import { tutorController } from "./tutor.controller";
import authentication from "../../middleware/authentication";
import { UserRole } from "../../lib/auth";

const router = express.Router();

router.get("/", tutorController.getAllTutors);

router.get('/availability', authentication(UserRole.TUTOR), tutorController.getAllAvailability);

router.post("/availability", authentication(UserRole.TUTOR), tutorController.createAvailability)

router.get("/:tutorId", tutorController.getTutorById);

router.put("/profile", authentication(UserRole.TUTOR), tutorController.updateProfile);

router.put("/availability/:availableId", authentication(UserRole.TUTOR), tutorController.updateAvialability);

router.delete("/availability/:availableId", authentication(UserRole.TUTOR), tutorController.deleteAvialability);

export const tutorRoutes = router;
