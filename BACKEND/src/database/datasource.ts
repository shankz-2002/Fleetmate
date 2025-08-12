import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Vehicle } from '../entities/Vehicle';
import { ResetToken } from '../entities/ResetToken';
import { PartUsed } from '../entities/PartUsed';
import { MechanicProfile } from '../entities/MechanicProfile';
import { CustomerProfile } from '../entities/CustomerProfile';
import { Bill } from '../entities/BIll';
import { Appointment } from '../entities/Appointment';
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Root@123',
    database: 'FleetMate',
    synchronize: true,
    entities: [User,Vehicle,ResetToken,PartUsed,MechanicProfile,CustomerProfile,Bill,Appointment,]
})