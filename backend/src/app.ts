import express from "express";
import cors from "cors";
import userRoutes from "./modules/user/user.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Mount feature routes
app.use("/api/users", userRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);

// Global error handling
// app.use(errorHandler);

export default app;
