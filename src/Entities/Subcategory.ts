import { IsString, IsBoolean, IsUrl, IsOptional, validateOrReject } from 'class-validator';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Category } from './Category';

@Entity('subcategories')
export class Subcategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
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

    @ManyToOne(() => Category, category => category.subcategories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    async validateSubcategory() {
        await validateOrReject(this);
    }
}

