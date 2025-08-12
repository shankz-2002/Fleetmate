import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Appointment } from "./Appointment";

@Entity()
export class CustomerProfile extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column({ nullable: true })
    profileImage: string;

    @OneToOne(() => User, (user) => user.customerProfile, {
        onDelete: "CASCADE"

    })
    @JoinColumn()
    user: User;


    @OneToMany(() => Appointment, (appointment) => appointment.customer, {
        onDelete: "CASCADE"

    })
    appointments: Appointment[];



}
