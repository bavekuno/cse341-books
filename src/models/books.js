import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  const db = getDb();
  return db.collection('books').find({}).toArray();
};

export { getAllBooks };
