import express from 'express'
import { userController } from './user.controller';
import authentication from '../../middleware/authentication';
import { UserRole } from '../../lib/auth';

const router = express.Router();

router.post('/create-tutor', userController.createTutor)
router.get('/', authentication(UserRole.ADMIN), userController.getAllUser);
router.patch('/:user_id', authentication(UserRole.ADMIN), userController.updateUserStatus);
router.put('/:userId', authentication(UserRole.ADMIN, UserRole.STUDENT, UserRole.TUTOR), userController.updateUser);


export const userRoutes = router;