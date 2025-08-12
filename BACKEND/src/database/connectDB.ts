import { AppDataSource } from "./datasource"

export const Connection=async()=>{
    try {
        await AppDataSource.initialize();
        console.log("connected to database");
        
    } catch (error) {
        
    }
}