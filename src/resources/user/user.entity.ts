import {Entity, Column, PrimaryGeneratedColumn, AfterInsert, OneToMany} from "typeorm";
import {Expense} from "../expenses/expense.entity";
import {appDataSource} from '../../../db/data-source'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true,
    })
    firstName: string;

    @Column({
        nullable: true,
    })
    lastName: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Expense, expense => expense.user)
    expenses: Expense[];

    @AfterInsert()
    logInser() {
        console.log(`User is saved with password ${this.password}`);
    }
}


