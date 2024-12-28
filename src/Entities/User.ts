import { IsEmail, IsString, Matches, MinLength } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsString()
    firstName: string

    @Column()
    @IsEmail()
    email: string

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    })
    password: string;


}