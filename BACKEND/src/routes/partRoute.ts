import express from 'express'
import { isAuthenticated } from '../middleware/authMiddleware';
import { partCreate, partDelete } from '../controller/partController';
const partRouter=express.Router();

partRouter.post('/create/:id',isAuthenticated,partCreate);

partRouter.delete('/delete/:id',isAuthenticated,partDelete)



export default partRouter;