import { getDb } from '../db/connect.js';

const collection = () => {
  return getDb().collection('books');
};

const authorsCollection = () => {
  return getDb().collection('authors');
};

const getAllBooks = async () => {
  return collection().find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
};

const getBookById = async (id) => {
  return collection().findOne({ id }, { projection: { _id: 0 } });
};

const createBook = async (book) => {
  await collection().insertOne(book);
  return getBookById(book.id);
};

const updateBook = async (id, data) => {
  const result = await collection().findOneAndUpdate(
    { id },
    { $set: data },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  return result;
};

const deleteBook = async (id) => {
  const result = await collection().deleteOne({ id });
  return result.deletedCount === 1;
};

const authorExists = async (authorId) => {
  const author = await authorsCollection().findOne({ id: authorId }, { projection: { _id: 1 } });
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
