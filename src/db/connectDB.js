import mongoose from "mongoose";
import chalk from "chalk";
import {logError} from "../utils/log.error.js";

const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        throw new Error("MONGO_URI is not defined in environment variables.");
    }

    const options = {
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
        w: "majority",
    };

    if (mongoose.connection.readyState === 2) {
        console.log(chalk.yellow.bold("MongoDB is already connected."));
        return;
    }

    try {
        await mongoose.connect(MONGO_URI, options);
        console.log(chalk.green.bold(`MongoDB Connected: ${mongoose.connection.host}`));

        mongoose.connection.on("error", logError);

        mongoose.connection.on("disconnected", () => {
            console.warn(chalk.yellow.bold("MongoDB disconnected. Reconnecting..."));
            setTimeout(connectDB, 5000);
        });
    } catch (error) {
        logError(error);
        throw error;
    }
};

export default connectDB;
