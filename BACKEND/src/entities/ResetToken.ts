import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class ResetToken extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.resetTokens, {
        onDelete: "CASCADE"

    })
    @JoinColumn()
    user: User;


    @Column()
    token: string

    @Column()
    expiresAt: Date

    @CreateDateColumn()
    created: Date
}