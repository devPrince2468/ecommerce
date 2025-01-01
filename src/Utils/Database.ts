import { DataSource } from "typeorm";
import "dotenv/config";

// export const AppDataSource = new DataSource({
//     type: "postgres",
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT || "5432"),
//     username: process.env.DB_USER || process.env.DATABASE_USERNAME,
//     password: process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD,
//     database: process.env.DB_NAME || process.env.DATABASE,
//     entities: ["/Entities/*{.ts,.js}"],
//     synchronize: true,
//     // logging: true
// });

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "ecommerce",
    entities: ["src/Entities/*{.ts,.js}"],
    synchronize: true,
    // logging: true
});



