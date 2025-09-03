import {ZodError} from "zod";
import ApiError from "../utils/api.error.js";


export const notFoundMiddleware = (req, res, next) => {
    next(new ApiError(`Cannot find ${req.originalUrl} on this server`, 404));
};


export const globalErrorHandler = (err, req, res, next) => {
    const errorResponse = {
        success: false,
        status: "error",
        message: "Something went wrong!",
        data: null,
        code: err.statusCode || 500,
    };


    let statusCode = err.statusCode || 500;


    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        errorResponse.message = err.message;
        errorResponse.status = err.status || errorResponse.status;
        Object.keys(err).forEach((key) => {
            if (!["message", "name", "stack", "isOperational", "statusCode"].includes(key)) {
                errorResponse[key] = err[key];
            }
        });
    }

    else if (err instanceof ZodError) {
        statusCode = 400;
        errorResponse.status = "fail";
        errorResponse.message = "Validation failed";
        errorResponse.errors = err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
            code: issue.code,
        }));
    }

    else if (err?.name === "ValidationError") {
        statusCode = 400;
        errorResponse.status = "fail";
        errorResponse.message = "Validation failed";
        errorResponse.errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
    }
    else if (err?.name === "CastError") {
        statusCode = 400;
        errorResponse.message = `Invalid ${err.path}: ${err.value}`;
        errorResponse.errors = [{ field: err.path, message: "Invalid ID format" }];
    }
    else if (err?.code === 11000) {
        const key = Object.keys(err.keyValue || {})[0];
        statusCode = 409;
        errorResponse.status = "fail";
        errorResponse.message = key ? `Duplicate value: ${key} must be unique` : "Duplicate key error";
        errorResponse.errors = key
            ? [{ field: key, message: `${key} must be unique` }]
            : [{ field: "unknown", message: "Duplicate field value entered" }];
    }
    else if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        statusCode = 400;
        errorResponse.status = "fail";
        errorResponse.message = "Invalid JSON payload";
    }

    else if (err instanceof Error) {
        errorResponse.message = err.message;
    }


    errorResponse.code = statusCode;
    if (!errorResponse.status) {
        errorResponse.status = statusCode >= 500 ? "error" : "fail";
    }

    if (process.env.NODE_ENV === "development" && err.stack) {
        errorResponse.stack = err.stack;
    }


    console.error(`[${new Date().toISOString()}] ${statusCode} - ${req.method} ${req.originalUrl}`, {
        message: errorResponse.message,
        code: statusCode,
        path: req.originalUrl,
        method: req.method,
        errors: errorResponse.errors,
        stack: errorResponse.stack,
    });

    res.status(statusCode).json(errorResponse);
};

