import express from "express";
import { subjectController } from "./subject.controller";
import authentication from "../../middleware/authentication";
import { UserRole } from "../../lib/auth";

const router = express.Router();

router.post("/", authentication(UserRole.TUTOR),  subjectController.createSubject);
router.get("/", authentication(UserRole.ADMIN, UserRole.TUTOR), subjectController.getAllSubject);
router.put(
  "/:subjectId",
  authentication(UserRole.TUTOR),
  subjectController.updateSubject
);
router.delete(
  "/:subjectId",
  authentication(UserRole.TUTOR),
  subjectController.deleteSubject
);

export const tutorSubjectRoutes = router;
