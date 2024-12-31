import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm"
import { Category } from "./Category"


@Entity()
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "varchar", unique: true, })
    name: string

    @Column("text")
    description: string

    @Column("decimal", { precision: 10, scale: 2 })
    price: number

    @Column("int")
    stockQuantity: number

    @Column()
    sku: string

    @Column({ default: true })
    isActive: boolean

    @ManyToOne(() => Category, category => category.products)
    category: Category


    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}