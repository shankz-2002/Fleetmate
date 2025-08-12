import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Bill } from "./BIll";
import { User } from "./User";

@Entity()
export class PartUsed extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  partName: string;

  @Column()
  quantity: number;

  @Column()
  cost: number;

  @ManyToOne(() => Bill, (bill) => bill.parts, {
    onDelete: 'CASCADE'

  })
  @JoinColumn()
  bill: Bill;

  @ManyToOne(() => User, {
    onDelete: "CASCADE"

  })
  @JoinColumn({ name: 'addedBy' }) // or 'managerId'
  manager: User;

}
