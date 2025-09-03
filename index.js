import app from "./app.js";
import connectDB from "./src/db/connectDB.js";
import chalk from "chalk";
import mongoose from "mongoose";
import {logError} from "./src/utils/log.error.js";

const PORT = process.env.PORT || 5000;


(async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            console.log(chalk.blue.bold(`Server started on port ${PORT}`));
        });

        const shutdown = async (signal) => {
            console.log(chalk.yellow.bold(`${signal} received. Shutting down...`));
            server.close(async () => {
                console.log(chalk.green.bold("Express server closed."));
                await mongoose.connection.close();
                console.log(chalk.green.bold("MongoDB disconnected."));
                process.exit(0);
            });

            setTimeout(() => {
                console.error(chalk.red.bold("Could not close connections. Forcing exit."));
                process.exit(1);
            }, 10000).unref();
        };

        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("SIGTERM", () => shutdown("SIGTERM"));

        process.on("unhandledRejection", async (err) => {
            logError(err);
            await shutdown("Unhandled Rejection");
        });

        process.on("uncaughtException", async (err) => {
            logError(err);
            await shutdown("Uncaught Exception");
        });
    } catch (err) {
        logError(err);
        process.exit(1);
    }
})();
