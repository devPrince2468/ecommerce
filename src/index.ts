import "reflect-metadata"
import express from "express";
import cookieParser from 'cookie-parser';
import { AppDataSource } from "./Utils/Database";
import router from "./Routers";
import "dotenv/config";
import { Scheduler } from "./CronJobs/Scheduler";


const PORT = 8080
const app = express();
app.use(express.json());
app.use(cookieParser());

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

app.use("/api", router);

AppDataSource.initialize().then((success) => {
    console.log("PostgreSQL Database connected!");
    app.listen(PORT, () => {
        console.log(`Server is running on : ${PORT}`);
        Scheduler();
    })

}).catch((err) => {
    console.log("Error connecting PostgreSQL!");
    console.log(err);
});



