import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');
  const books = await collection.find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();

  return books;
};

const getBookById = async (id) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ id }, { projection: { _id: 0 } });

  return book;
};

const createBook = async (book) => {
  const db = getDb();
  const collection = db.collection('books');
  await collection.insertOne(book);
  const createdBook = await collection.findOne({ id: book.id }, { projection: { _id: 0 } });

  return createdBook;
};

const updateBook = async (id, book) => {
  const db = getDb();
  const collection = db.collection('books');
  const result = await collection.findOneAndUpdate(
    { id },
    { $set: book },
    { returnDocument: 'after', projection: { _id: 0 } }
  );

  return result;
};

const deleteBook = async (id) => {
  const db = getDb();
  const collection = db.collection('books');
  const result = await collection.deleteOne({ id });

  return result.deletedCount === 1;
};

const authorExists = async (authorId) => {
  const db = getDb();
  const collection = db.collection('authors');
  const author = await collection.findOne({ id: authorId }, { projection: { _id: 1 } });

  return author !== null;
};

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  authorExists,
};
