import { EventEmitter } from 'events';
import { Connection } from 'mongoose';

export interface Options {
    useNewUrlParser?: boolean;
    useUnifiedTopology?: boolean;
    useCreateIndex?: boolean;
    useFindAndModify?: boolean;
    [key: string]: any;
}

export interface Model {
    Key: string;
    Value: any;
}

export class DataError extends Error {
    constructor(message: string);
}

declare module "@vlodia/mongo" {
    export abstract class Manager extends EventEmitter {
        protected dbConnection: Connection;
        protected connectionTime: Date | null;
    
        constructor(connectionString: string, options?: Options);
    
        protected initializeConnection(connectionString: string): Promise<Connection>;
    
        protected terminateConnection(): Promise<void>;
    
        public connect(url: string): Promise<Connection>;
    
        public disconnect(): Promise<void>;
    
        public getUptime(): number;
    }
    
    export class Client extends Manager {
        private model: any;
    
        constructor(connectionString: string, modelName?: string, options?: Options);
    
        public retrieve(key: string): Promise<any>;
    
        public exists(key: string): Promise<boolean>;
    
        public store(key: string, value: any): Promise<Model>;
    
        public remove(key: string): Promise<boolean>;
    
        public increment(key: string, amount: number): Promise<Model>;
    
        public decrement(key: string, amount: number): Promise<Model>;
    
        public append(key: string, element: any): Promise<Model>;
    
        public removeElement(key: string, element: any): Promise<Model>;
    
        public listAll(): Promise<Model[]>;
    
        public clearAll(): Promise<void>;
    
        public connect(url: string): Promise<Connection>;
    
        public disconnect(): Promise<void>;
    
        public updateSchema(name: string): Promise<typeof import("../dist/adapters/Schema.js").default>;
    
        public createNewModel(name: string): Client;
    
        public createNewSchema(name: string): Client;
    
        public switchDatabase(dbName: string): Promise<Client>;
    
        public switchCollection(collectionName: string): Promise<Client>;
    
        public deleteDatabase(): Promise<void>;
    
        public deleteCollection(): Promise<void>;
    }    
}