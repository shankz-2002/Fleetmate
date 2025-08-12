import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware';
import { deleteUser, updateUser, viewAllBill, viewAllVehicles, viewUser } from '../controller/adminController';
const adminRouter = express.Router();

adminRouter.get('/viewuser', isAuthenticated, viewUser);

adminRouter.delete('/delete/:id', isAuthenticated, deleteUser);


adminRouter.put('/update/:id', isAuthenticated, updateUser);

adminRouter.get('/viewallvehicle', isAuthenticated, viewAllVehicles);


adminRouter.get('/viewBill',isAuthenticated,viewAllBill)




export default adminRouter;