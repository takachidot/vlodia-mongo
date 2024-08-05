import { Schema, Connection } from "mongoose";
import { Model } from "../types/types";

const CustomSchema = new Schema<Model>({
	key: {
		type: String,
		required: true
	},
	value: {
		type: Schema.Types.Mixed,
		required: true
	}
});

export default (dbConnection: Connection, modelName: string) =>
	dbConnection.model<Model>(modelName, CustomSchema);
