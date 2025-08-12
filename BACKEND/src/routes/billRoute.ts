import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware';
import { billCreate, billDelete, billUpdate, billView } from '../controller/billController';
const billRouter=express.Router();

billRouter.post('/create/:id',isAuthenticated,billCreate);

billRouter.delete('/delete/:id',isAuthenticated,billDelete);


billRouter.put('/update/:id',isAuthenticated,billUpdate);


billRouter.get('/view',isAuthenticated,billView);

export default billRouter;