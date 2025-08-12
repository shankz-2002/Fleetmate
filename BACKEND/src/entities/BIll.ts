import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Appointment } from "./Appointment";
import { PartUsed } from "./PartUsed";
import { User } from "./User";

@Entity()
export class Bill extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    laborCharge: number;

    @Column()
    taxes: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    totalAmount: number;

    @OneToOne(() => Appointment, (appointment) => appointment.bill, {
        onDelete: 'CASCADE'

    })
    @JoinColumn()
    appointment: Appointment;

    @OneToMany(() => PartUsed, (part) => part.bill, {
        cascade: ['remove'],
        onDelete: 'CASCADE'
    })
    parts: PartUsed[];


    @ManyToOne(() => User, (user) => user.bills, {
        onDelete: "CASCADE"

    })
    @JoinColumn()
    user: User;

    @ManyToOne(() => User, (user) => user.issuedBills, {
        onDelete: "CASCADE"

    })
    @JoinColumn({ name: "issuedBy" })
    manager: User;
}
