import express from 'express'
import { isAuthenticated } from '../middleware/authMiddleware';
import { addMechanic, cancelAppointment, personalAppointment, viewAppointment, viewMechanic } from '../controller/managerController';
const managerRouter=express.Router();


managerRouter.post('/addmechanic/:id',isAuthenticated,addMechanic);

managerRouter.get('/viewmechanic',isAuthenticated,viewMechanic);

managerRouter.get('/viewAppointment/',isAuthenticated,viewAppointment);

managerRouter.post('/cancelAppointment/:id',isAuthenticated,cancelAppointment);


managerRouter.get('/viewPersonalAppointment',isAuthenticated,personalAppointment);



export default managerRouter;