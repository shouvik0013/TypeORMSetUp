import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import {User} from "../user/user.entity";
import {appDataSource} from '../../../db/data-source';

@Entity()
export class Expense {
    @PrimaryGeneratedColumn() id: number;

    @Column({
        nullable: false,
    }) title: string;

    @Column({
        nullable: false
    }) amount: number;

    @Column({type: "date", nullable: false}) expense_date: Date;

    @ManyToOne(() => User, user => user.expenses)
    user: User;

    @CreateDateColumn() created_at: Date;

    @UpdateDateColumn() updated_at: Date;

    @DeleteDateColumn() deleted_at: Date;
}

