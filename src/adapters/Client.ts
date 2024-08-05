"use strict";

import { parseObject } from "../Base/Index";
import { set, get, unset, cloneDeep } from "../Base/Lodash";
import { DataError } from "../Base/Error";
import { Manager } from "./BaseManager";
import modelSchema from "./Schema";
import { Model, Options } from "../types/types";
import { Connection } from "mongoose";

export class Client extends Manager {
	private model: any;

	constructor(
		connectionString: string,
		modelName = "defaultModel",
		options: Options = {}
	) {
		super(connectionString, options);
		this.model = modelSchema(this.dbConnection, modelName);
	}

	public async retrieve(key: string): Promise<any> {
		if (!key) throw new DataError("Invalid key provided!");
		const keyParts = key.split(".");
		const document = await this.model.findOne({ Key: keyParts[0] });
		if (!document) return null;
		if (keyParts.length > 1) {
			if (document.Value && typeof document.Value === "object")
				return get(document.Value, keyParts.slice(1).join("."));
			return null;
		}
		return document.Value;
	}

	public async exists(key: string): Promise<boolean> {
		if (!key) throw new DataError("Invalid key provided!");
		const document = await this.retrieve(key);
		return document !== null;
	}

	public async store(key: string, value: any): Promise<Model> {
		if (!key) throw new DataError("Invalid key provided!");
		if (value === undefined) throw new DataError("Invalid value provided!");
		const parsed = parseObject(set({}, key, value));
		return this.model.findOneAndUpdate(
			{ Key: parsed.key },
			{ $set: { Value: parsed.value } },
			{ upsert: true, new: true }
		);
	}

	public async remove(key: string): Promise<boolean> {
		if (!key) throw new DataError("Invalid key provided!");
		const keyParts = key.split(".");
		const document = await this.model.findOne({ Key: keyParts[0] });
		if (!document) return false;
		if (document.Value && typeof document.Value === "object") {
			const updatedValue = unset(cloneDeep(document.Value), keyParts.slice(1).join("."));
			await this.model.findOneAndUpdate(
				{ Key: keyParts[0] },
				{ $set: { Value: updatedValue } }
			);
			return true;
		}
		await this.model.deleteOne({ Key: keyParts[0] });
		return true;
	}

	public async increment(key: string, amount: number): Promise<Model> {
		if (!key) throw new DataError("Invalid key provided!");
		if (typeof amount !== 'number') throw new DataError("Invalid amount provided!");
		const currentValue = (await this.retrieve(key)) || 0;
		if (isNaN(currentValue)) throw new DataError("Stored value is not a number!");
		return this.store(key, currentValue + amount);
	}

	public async decrement(key: string, amount: number): Promise<Model> {
		if (!key) throw new DataError("Invalid key provided!");
		if (typeof amount !== 'number') throw new DataError("Invalid amount provided!");
		const currentValue = (await this.retrieve(key)) || 0;
		if (isNaN(currentValue)) throw new DataError("Stored value is not a number!");
		return this.store(key, currentValue - amount);
	}

	public async append(key: string, element: any): Promise<Model> {
		if (!key) throw new DataError("Invalid key provided!");
		if (element === undefined) throw new DataError("Invalid element provided!");
		const array = (await this.retrieve(key)) || [];
		if (!Array.isArray(array)) throw new DataError("Stored value is not an array!");
		array.push(element);
		return this.store(key, array);
	}

	public async removeElement(key: string, element: any): Promise<Model> {
		if (!key) throw new DataError("Invalid key provided!");
		if (element === undefined) throw new DataError("Invalid element provided!");
		const array = (await this.retrieve(key)) || [];
		if (!Array.isArray(array)) throw new DataError("Stored value is not an array!");
		const filteredArray = array.filter((item) => item !== element);
		return this.store(key, filteredArray);
	}

	public async listAll(): Promise<Model[]> {
		return this.model.find({});
	}

	public async clearAll(): Promise<Model> {
		return this.model.deleteMany({});
	}

	public getUptime(): number {
		return this.connectionTime ? Date.now() - this.connectionTime.getTime() : 0;
	}

	public async connect(url: string): Promise<Connection> {
		try {
			this.dbConnection = await this.initializeConnection(url);
			return this.dbConnection;
		} catch (error) {
			this.emit("connectionError", error);
			throw error;
		}
	}

	public async disconnect(): Promise<void> {
		try {
			await this.terminateConnection();
		} catch (error) {
			this.emit("disconnectionError", error);
			throw error;
		}
	}

	public async updateSchema(name: string): Promise<typeof modelSchema> {
		this.model = modelSchema(this.dbConnection, name);
		return this.model;
	}

	public createNewModel(name: string): Client {
		if (!name) throw new DataError("Invalid model name provided!");
		return new Client(this.connectionString, name, this.config);
	}

	public createNewSchema(name: string): Client {
		return this.createNewModel(name);
	}

	public async switchDatabase(dbName: string): Promise<Client> {
		if (!dbName) throw new DataError("Invalid database name provided!");
		const newConnectionURL = this.connectionString.replace((await this.dbConnection).name, dbName);
		return new Client(newConnectionURL, this.model.modelName, this.config);
	}

	public async switchCollection(collectionName: string): Promise<Client> {
		if (!collectionName) throw new DataError("Invalid collection name provided!");
		this.model = modelSchema(await this.dbConnection, collectionName);
		return this;
	}

	public async deleteDatabase(): Promise<void> {
		return (await this.dbConnection).dropDatabase();
	}

	public async deleteCollection(): Promise<void> {
		return this.model.collection.drop();
	}
}