import chalk from "chalk";

export const logError = (err) => {
    if (process.env.NODE_ENV === "development") {
        console.error(chalk.red(`[${new Date().toISOString()}] ERROR:`), err);
    }
};
