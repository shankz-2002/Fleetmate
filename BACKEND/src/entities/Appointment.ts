import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Vehicle } from "./Vehicle";
import { MechanicProfile } from "./MechanicProfile";
import { Bill } from "./BIll";
import { User } from "./User";

@Entity()
export class Appointment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "date" })
    appointmentDate: string;

    @Column({ default: 'pending' })
    status: string;

    @Column()
    remarks: string;

    @ManyToOne(() => Vehicle, (vehicle) => vehicle.appointments, {
        onDelete: 'CASCADE'
    })
    vehicle: Vehicle;

    @ManyToOne(
        () => MechanicProfile,
        (mechanic) => mechanic.appointments,
        { onDelete: 'CASCADE', nullable: true }
    )
    @JoinColumn()
    mechanic: MechanicProfile | null;
    

    @OneToOne(() => Bill, (bill) => bill.appointment, {
        cascade: ['remove'], // or use 'true' if you want full cascade
        onDelete: 'CASCADE'
    })
    bill: Bill;

    @ManyToOne(() => User, (user) => user.appointments, {
        onDelete: "CASCADE"

    })
    @JoinColumn()
    customer: User;

    // ✅ NEW FIELD — tracks which manager assigned the mechanic
    @ManyToOne(() => User)
    @JoinColumn({ name: 'assignedBy' }) // optional custom column name
    assignedBy: User;
}
