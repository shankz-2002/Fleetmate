import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CustomerProfile } from "./CustomerProfile";
import { MechanicProfile } from "./MechanicProfile";
import { Bill } from "./BIll";
import { ResetToken } from "./ResetToken";
import { Vehicle } from "./Vehicle";
import { Appointment } from "./Appointment";
import { PartUsed } from "./PartUsed";

export enum Role {
    USER = "customer",
    ADMIN = "admin",
    MANAGER = "manager",
    MECHANIC = "mechanic"
}

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: "enum", enum: Role, default: Role.USER })
    role: Role;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => CustomerProfile, (profile) => profile.user,{})
    customerProfile: CustomerProfile;

    @OneToOne(() => MechanicProfile, (profile) => profile.user)
    mechanicProfile: MechanicProfile;

    @OneToMany(() => Bill, (bill) => bill.user)
    bills: Bill[];

    @OneToMany(() => ResetToken, (reset) => reset.user)
    resetTokens: ResetToken[];

    @OneToMany(() => Bill, (bill) => bill.manager)
    issuedBills: Bill[];

    @OneToMany(() => Vehicle, (vehicle) => vehicle.customer)
    vehicles: Vehicle[];

    @OneToMany(() => Appointment, (appointment) => appointment.customer)
    appointments: Appointment[];


    @OneToMany(() => PartUsed, (part) => part.manager)
    addedParts: PartUsed[];


}
