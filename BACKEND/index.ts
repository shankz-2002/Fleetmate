import express from "express"
import { Connection } from "./src/database/connectDB";
import authRouter from "./src/routes/authRoute";
import vehicleRouter from "./src/routes/vehicleRoute";
import appointmentRouter from "./src/routes/appointmentRotue";
import billRouter from "./src/routes/billRoute";
import partRouter from "./src/routes/partRoute";
import managerRouter from "./src/routes/managerRoute";
import mechanicRouter from "./src/routes/mechanicRoute";
import cors from 'cors';
import adminRouter from "./src/routes/adminRoute";
import analysisRouter from "./src/routes/analysisRoute";
const app = express();
const PORT = 5000;
app.use(cors());

Connection()

app.use(express.json());
app.use('/user', authRouter);
app.use('/vehicle', vehicleRouter);
app.use('/appointment', appointmentRouter);
app.use('/bill', billRouter);
app.use('/part', partRouter);
app.use('/manager', managerRouter);
app.use('/mechanic', mechanicRouter);
app.use('/admin', adminRouter);
app.use('/analysis', analysisRouter);




app.listen(PORT, () => {
    console.log(`server running `);

})