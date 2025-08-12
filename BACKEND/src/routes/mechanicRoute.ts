import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware';
import { updateStatus, viewMechanicAppointment, viewTask } from '../controller/mechanicController';
import { viewAppointment, viewMechanic } from '../controller/managerController';
const mechanicRouter=express.Router();

mechanicRouter.post('/status/:id',isAuthenticated,updateStatus);

mechanicRouter.get('/viewTask',isAuthenticated,viewTask);

mechanicRouter.get('/viewAppointment',isAuthenticated,viewMechanicAppointment);


export default mechanicRouter;