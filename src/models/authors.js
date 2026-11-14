import { getDb } from '../db/connect.js';

const getAllAuthors = async () => {
  const db = getDb();
  const collection = db.collection('authors');
  const authors = await collection.find({}).sort({ id: 1 }).project({ _id: 0 }).toArray();

  return authors;
};

const getAuthorById = async (id) => {
  const db = getDb();
  const collection = db.collection('authors');
  const author = await collection.findOne({ id }, { projection: { _id: 0 } });

  return author;
};

const createAuthor = async (author) => {
  const db = getDb();
  const collection = db.collection('authors');
  await collection.insertOne(author);
  const createdAuthor = await collection.findOne({ id: author.id }, { projection: { _id: 0 } });

  return createdAuthor;
};

const updateAuthor = async (id, author) => {
  const db = getDb();
  const collection = db.collection('authors');
  const result = await collection.findOneAndUpdate(
    { id },
    { $set: author },
    { returnDocument: 'after', projection: { _id: 0 } }
  );

  return result;
};

const deleteAuthor = async (id) => {
  const db = getDb();
  const collection = db.collection('authors');
  const result = await collection.deleteOne({ id });

  return result.deletedCount === 1;
};

const authorHasBooks = async (id) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ authorId: id }, { projection: { _id: 1 } });

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
