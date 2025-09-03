import chalk from "chalk";

export const logConsole = (val) => {
    if (process.env.NODE_ENV === "development") {
        console.log(chalk.green(`[${new Date().toISOString()}] CONSOLE:`), val);
    }
};
