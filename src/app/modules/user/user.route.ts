import express from 'express'
import { userController } from './user.controller';
import authentication from '../../middleware/authentication';
import { UserRole } from '../../lib/auth';
import { upload } from '../../config/multer';

const router = express.Router();

router.post('/create-tutor', userController.createTutor)
router.get('/', authentication(UserRole.ADMIN), userController.getAllUser);
router.put('/profile', upload.single("image"), authentication(UserRole.ADMIN, UserRole.STUDENT, UserRole.TUTOR), userController.updateUser);
router.patch('/:user_id', authentication(UserRole.ADMIN), userController.updateUserStatus);


export const userRoutes = router;