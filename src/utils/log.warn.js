import chalk from "chalk";

export const logWarn = (msg) => {
    if (process.env.NODE_ENV === "development") {
        console.warn(
            chalk.yellow(`[${new Date().toISOString()}] WARNING:`),
            msg
        );
    }
};
