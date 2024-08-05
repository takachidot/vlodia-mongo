import chalk from "chalk";

export class DataError extends Error {
    constructor(message: string) {
        super(
            chalk.red(message)
        );
        this.name = "DataError"
    }
}