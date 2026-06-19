import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { auth } from "./app/lib/auth";
import { toNodeHandler } from "better-auth/node";
import { IndexRoutes } from "./app/routes";
import { envVars } from "./app/config/env";
import { paymentController } from "./app/modules/payment/payment.controller";
const app = express();

const corsOptions = {
  origin: envVars.APP_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
}
app.use(cors(corsOptions));

app.post("/api/v1/payments/webhook", express.raw({ type: "application/json" }), paymentController.handleWebhook);

app.use(express.json());
app.use(cookieParser())


app.all("/api/auth", toNodeHandler(auth));
app.use("/api/v1", IndexRoutes)

app.use("/", (req, res) => {
  res.json({ message: "Shikkha API is running!" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
});

export default app;

