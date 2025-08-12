import express from 'express'
import { userDelete, userLogin, userRegister, userUpdate, userView } from '../controller/authController';
import { isAuthenticated } from '../middleware/authMiddleware';
import { customerProfile, mechanicProfile } from '../controller/profileController';
import { forgotPassword, resetPassword } from '../controller/passwordsController';
const authRouter = express.Router();

authRouter.post('/register', userRegister);
authRouter.post('/login', userLogin);

authRouter.put('/update', isAuthenticated, userUpdate);
authRouter.delete('/delete', isAuthenticated, userDelete);

authRouter.get('/view', isAuthenticated, userView);


authRouter.post('/api/auth/forgot-password', forgotPassword);
authRouter.post('/api/auth/reset-password', resetPassword);



authRouter.post('/customerprofile', isAuthenticated, customerProfile);
authRouter.post('/mechanicprofile', isAuthenticated, mechanicProfile);

export default authRouter;