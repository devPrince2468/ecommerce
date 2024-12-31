import { IsString, IsBoolean, IsUrl, IsOptional, validateOrReject } from 'class-validator';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Subcategory } from './Subcategory';
import { Product } from './Product';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    @IsString()
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    @IsString()
    slug: string;

    @Column({ type: 'text', nullable: true })
    @IsString()
    @IsOptional()
    description: string;

    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    isActive: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsUrl()
    @IsOptional()
    imageUrl: string;

    @OneToMany(() => Subcategory, subcategory => subcategory.category)
    subcategories: Subcategory[];

    @OneToMany(() => Product, product => product.category)
    products: Product[]

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    async validateCategory() {
        await validateOrReject(this);
    }
}

