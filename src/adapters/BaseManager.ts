import { DataError } from "../Base/Error";
import { EventEmitter } from "events";
import mongoose, { Connection } from "mongoose";
import { Options } from "../types/types";

export abstract class Manager extends EventEmitter {
	protected connectionString: string;
	protected config: Options;
	protected dbConnection: Connection;
	protected connectionTime: Date | null;

	constructor(connectionString: string, config: Options = {}) {
		super();
		if (!connectionString || !connectionString.startsWith("mongodb")) {
			throw new DataError("Invalid MongoDB connection string provided!");
		}
		if (config && typeof config !== "object") {
			throw new DataError("Provided options must be an object!");
		}
		this.connectionString = connectionString;
		this.config = config;
		this.dbConnection = this.initializeConnection(this.connectionString);
		this.connectionTime = null;

		this.dbConnection.on("error", (error) => this.emit("connectionError", error));
		this.dbConnection.on("open", () => {
			this.connectionTime = new Date();
			this.emit("connectedSuccessfully");
		});
	}

	protected initializeConnection(connectionString: string): Connection {
		if (!connectionString || !connectionString.startsWith("mongodb")) {
			throw new DataError("Invalid MongoDB connection string provided!");
		}
		this.connectionString = connectionString;

		const { useCreateIndex, useNewUrlParser, useUnifiedTopology, useFindAndModify, ...restOptions } = this.config;

		return mongoose.createConnection(this.connectionString, {
			...restOptions,

		});
	}

	protected async terminateConnection(): Promise<void> {
		this.connectionTime = null;
		this.connectionString = "";
		await this.dbConnection.close(true);
	}
}