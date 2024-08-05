# @vlodia-mongo
a comprehensive MongoDB interaction module built on top of Mongoose. It provides a rich set of tools and utilities for seamless database management, including connection handling, CRUD operations, schema management, and more. Designed for flexibility and ease of use, this module aims to simplify working with MongoDB in your NodeJS projects.

## Features

- Simple and intuitive interface for MongoDB operations
- Supports data retrieval, storage, updating, and deletion
- Provides schema and collection management
- Handles database switching with ease
- Emits events on connection and disconnection

## Installation

Install the package via npm:

```bash
npm install @vlodia/mongo
yarn add @vlodia/mongo
```

## Usage

```typescript
import { Client } from '@vlodia/mongo';

// Creating a new Client instance
const client = new Client('mongodb://localhost:27017/mydatabase', 'myModel');

// Connecting to the database
await client.connect('mongodb://localhost:27017/mydatabase');

// Storing a key-value pair
await client.store('myKey', { some: 'data' }); // Store data

// Retrieving a value by key
const data = await client.retrieve('myKey'); // Retrieve data
console.log('Retrieved data:', data);

// Checking if a key exists
const exists = await client.exists('myKey'); // Check existence
console.log('Key exists:', exists);

// Incrementing a numeric value by a specified amount
await client.increment('myCounter', 5); // Increment a numeric value

// Decrementing a numeric value by a specified amount
await client.decrement('myCounter', 2); // Decrement a numeric value

// Appending an element to an array stored under a key
await client.append('myArrayKey', 'newElement'); // Append to array

// Removing an element from an array stored under a key
await client.removeElement('myArrayKey', 'newElement'); // Remove from array

// Listing all documents in the current collection
const allDocuments = await client.listAll(); // List all documents
console.log('All documents:', allDocuments);

// Removing a document by key
const removed = await client.remove('myKey'); // Remove a document by key
console.log('Document removed:', removed);

// Clearing all documents in the current collection
await client.clearAll(); // Clear all documents

// Switching to a different database
const newClient = await client.switchDatabase('newDatabase'); // Switch to a new database

// Switching to a different collection
await client.switchCollection('newCollection'); // Switch to a new collection

// Getting the uptime of the database connection
const uptime = client.getUptime(); // Get connection uptime
console.log('Uptime:', uptime);

// Updating the schema/model used by the Client
await client.updateSchema('newModelName'); // Update schema/model

// Creating a new model within the same database connection
const anotherClient = client.createNewModel('anotherModel'); // Create a new model

// Deleting the current database
await client.deleteDatabase(); // Delete the database

// Deleting the current collection
await client.deleteCollection(); // Delete the collection

// Disconnecting from the database
await client.disconnect(); // Disconnect from the database
```
