import {Entity, Column, PrimaryGeneratedColumn, AfterInsert} from "typeorm";

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

    @AfterInsert()
    logInser() {
        console.log(`User is saved with password ${this.password}`);
    }
}
