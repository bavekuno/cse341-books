import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  const db = getDb();
  return db.collection('books').find({}).toArray();
};

const getBookById = async (bookId) => {
  const db = getDb();
  return db.collection('books').findOne({ id: bookId });
};

export { getAllBooks, getBookById };
