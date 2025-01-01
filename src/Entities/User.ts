import { IsEmail, IsString, Matches, MinLength, validateOrReject } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number | string

    @Column()
    @IsString()
    firstName: string

    @Column({ unique: true })
    @IsEmail()
    email: string

    @Column()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    })
    password: string;

    @Column({ unique: true, nullable: true })
    verificationCode: string

    @Column()
    verificationCodeExpires: Date;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ default: "" })
    refreshToken: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    async validate() {
        await validateOrReject(this);
    }


}