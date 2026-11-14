import { getDb } from '../db/connect.js';

const collection = () => {
  return getDb().collection('authors');
};

const booksCollection = () => {
  return getDb().collection('books');
};

const getAllAuthors = async () => {
  return collection().find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
};

const getAuthorById = async (id) => {
  return collection().findOne({ id }, { projection: { _id: 0 } });
};

const createAuthor = async (author) => {
  await collection().insertOne(author);
  return getAuthorById(author.id);
};

const updateAuthor = async (id, data) => {
  const result = await collection().findOneAndUpdate(
    { id },
    { $set: data },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  return result;
};

const deleteAuthor = async (id) => {
  const result = await collection().deleteOne({ id });
  return result.deletedCount === 1;
};

const authorHasBooks = async (authorId) => {
  const book = await booksCollection().findOne({ authorId }, { projection: { _id: 1 } });
  return book !== null;
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks,
};
