import { Connection, ConnectOptions } from "mongoose";
import * as mongoose from 'mongoose';

export class DataLayerService {
    connection: Connection;

    // Asynchronously connect to a MongoDB database
    async connect(uri: string, config: ConnectOptions = {}) {
        // Default configuration options for the MongoDB connection
        const baseConfig: ConnectOptions = {
            // maxPoolSize: process.env.MONGO_MAX_POOL_SIZE || 500, // Maximum pool size for connections
            // minPoolSize: process.env.MONGO_MIN_POOL_SIZE || 10, // Minimum pool size for connections
            autoIndex: process.env.AUTO_CREATE_INDEX === 'true', // Automatically create indexes
            maxIdleTimeMS: 1000 * 60 * 10 // Maximum time a connection can remain idle
        };

        // Attempt to connect to the MongoDB database using the provided URI and merged configuration options
        const instance = await mongoose.connect(uri, {
            ...baseConfig,
            ...config,
        });

        // Store the connection instance for later use
        this.connection = instance.connection;

        return this.connection; // Return the MongoDB connection object
    }

    // Check if the MongoDB connection is currently active
    isConnected(): boolean {
        return this.connection && this.connection.readyState === 1;
    }

    // Asynchronously disconnect from the MongoDB database
    async disconnect() {
        await mongoose.disconnect(); // Close the connection to the database
    }

    // Asynchronously drop the database (only allowed in test mode)
    async destroy() {
        // Ensure that this function is only used in the 'test' environment
        if (process.env.NODE_ENV !== 'test') {
            throw new Error('Allowed only in test mode');
        }

        // Drop the entire database (use with caution)
        await mongoose.connection.dropDatabase();
    }
}
