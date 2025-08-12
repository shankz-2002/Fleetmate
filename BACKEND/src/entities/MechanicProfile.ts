import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Appointment } from "./Appointment";

@Entity()
export class MechanicProfile extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column({ nullable: true })
    profileImage: string;

    @Column("text", { array: true })
    skills: string[];

    @Column()
    yearsOfExperience: number;

    @Column({ default: false })
    isEngaged: boolean;

    @OneToOne(() => User, (user) => user.mechanicProfile, {
        onDelete: "CASCADE"

    })
    @JoinColumn()
    user: User;

    @OneToMany(() => Appointment, (appointment) => appointment.mechanic, {
        onDelete: "CASCADE"

    })
    appointments: Appointment[];
}
