import "reflect-metadata"
import express, { Request, Response } from "express";
import { User } from "./Entities/User";
import { AppDataSource } from "./Utils/Database";
import router from "./Routers";


const PORT = 8080
const app = express();
app.use(express.json());

// const AppDataSource = new DataSource({
//     type: "postgres",
//     host: "localhost",
//     port: 5432,
//     username: "postgres",
//     password: "root",
//     database: "ecommerce",
//     entities: ["src/entities/*{.ts,.js}"],
//     synchronize: true,
//     logging: true
// });

app.use("/api", router)

AppDataSource.initialize().then((success) => {
    console.log("PostgreSQL Database connected!");
    app.listen(PORT, () => {
        console.log(`Server is running on : ${PORT}`);
    })

}).catch((err) => {
    console.log("Error connecting PostgreSQL!");
    console.log(err);
});



