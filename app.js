import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import hpp from "hpp";
import helmet from "helmet";
import { xss } from "express-xss-sanitizer";
import cookieParser from "cookie-parser";


import { globalLimiter } from "./src/middlewares/limiter.middleware.js";
import { globalErrorHandler, notFoundMiddleware } from "./src/middlewares/error.middleware.js";
import { mountRoutes } from "./src/routes/index.js";

dotenv.config({ quiet: true });
const app = express();


const isProduction = process.env.NODE_ENV === "production";


const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://wroomit-dashboard.netlify.app",
    "https://cmexchange-dashboard.netlify.app",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        optionsSuccessStatus: 204,
    })
);

// Security middleware
app.use(hpp());
app.use(
    helmet({
        contentSecurityPolicy: isProduction ? undefined : false,
        crossOriginEmbedderPolicy: isProduction ? undefined : false,
        hsts: isProduction
            ? { maxAge: 31536000, includeSubDomains: true, preload: true }
            : false,
        frameguard: { action: "sameorigin" },
        hidePoweredBy: true,
    })
);
app.use(xss());
app.use(globalLimiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/health", (req, res) => {
    res.status(200).json({ code: 200, success: true, message: "Server is running" });
});


app.get("/", (req, res) => {
    res.status(200).json({ code: 200, success: true, message: "Welcome to Tommy's Girl Server" });
});


mountRoutes(app);


app.use(notFoundMiddleware);
app.use(globalErrorHandler);

export default app;
