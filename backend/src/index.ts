import ProductRoutes from "./routes/productsRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import express, { Application } from "express";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    }),
);

app.use(express.json());

app.use("/api/products", ProductRoutes);

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
