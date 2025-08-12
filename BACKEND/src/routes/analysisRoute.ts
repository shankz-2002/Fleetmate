import express from 'express'
import { isAuthenticated } from '../middleware/authMiddleware';
import { getSystemAnalytics } from '../controller/analysisController';

const analysisRouter = express.Router();

analysisRouter.get('/view', isAuthenticated, getSystemAnalytics);


export default analysisRouter;