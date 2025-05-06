import express from "express";
import cors from "cors";
import UserRouter from "./API/user.api.js";
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/user", UserRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: true,
    message: err.message || "Internal Server Error",
  });
});

app.get("/auth-service/health", (req, res) => {
  return res.status(200).json({
    message: "ok",
  });
});

export default app;
