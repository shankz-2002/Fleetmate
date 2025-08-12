import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { CustomerProfile } from "./CustomerProfile";
import { Appointment } from "./Appointment";
import { User } from "./User";

@Entity()
export class Vehicle extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    make: string;

    @Column()
    model: string;

    @Column()
    year: number;

    @Column()
    regNumber: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (customer) => customer.vehicles, {
        onDelete: "CASCADE"

    })
    @JoinColumn()
    customer: User;

    @OneToMany(() => Appointment, (appointment) => appointment.vehicle, {
        cascade: ['remove'], // or use 'true' if you want full cascade
        onDelete: 'CASCADE'
    })
    appointments: Appointment[];

}
