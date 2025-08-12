import express from 'express'
import { isAuthenticated } from '../middleware/authMiddleware';
import { vehicleCreate, vehicleDelete, vehicleUpdate, vehicleView } from '../controller/vehicleController';
const vehicleRouter=express.Router();

vehicleRouter.post('/create',isAuthenticated,vehicleCreate);

vehicleRouter.put('/update/:id',isAuthenticated,vehicleUpdate);

vehicleRouter.delete('/delete/:id',isAuthenticated,vehicleDelete);

vehicleRouter.get('/view',isAuthenticated,vehicleView);


export default vehicleRouter;