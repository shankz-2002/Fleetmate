import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware';
import { appointmentCreate, appointmentView } from '../controller/appointmentController';

const appointmentRouter=express.Router();

appointmentRouter.post('/create/:id',isAuthenticated,appointmentCreate);

appointmentRouter.get('/viewCustomer',isAuthenticated,appointmentView);



export default appointmentRouter;