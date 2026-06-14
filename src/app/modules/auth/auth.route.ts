
import express from 'express'
import authentication from '../../middleware/authentication';
import { UserRole } from '../../lib/auth';
import { authController } from './auth.controller';
const router = express.Router();

router.post('/register', authController.createUser)
router.post('/login', authController.loginUser)
router.get('/me', authentication(UserRole.ADMIN,UserRole.STUDENT,UserRole.TUTOR), authController.getMe);
router.post('/logout', authController.logOut);


export const authRoutes = router;