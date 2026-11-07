// src/db/connect.js

import { MongoClient } from 'mongodb';

let db;

const connectToDb = async () => {
  try {
    const connectionString = process.env.MONGODB_URI;

    if (!connectionString) {
      throw new Error('MONGODB_URI is not defined');
    }

    const client = new MongoClient(connectionString);

    await client.connect();

    db = client.db(process.env.DB_NAME);

    console.log('Connected to MongoDB successfully');

    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

const getDb = () => {
  if (!db) {
    throw new Error('Database has not been initialized');
  }

  return db;
};

export { connectToDb, getDb };