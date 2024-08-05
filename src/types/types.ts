import { Schema, Document } from "mongoose";

export interface Options {
	useCreateIndex?: boolean;
	useNewUrlParser?: boolean;
	useUnifiedTopology?: boolean;
	useFindAndModify?: boolean;
}

export interface Model extends Document {
	key: string;
	value: Schema.Types.Mixed;
}

export interface ParsedObject {
	key: string | undefined;
	value: string | undefined;
}