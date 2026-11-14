import { MongoClient } from 'mongodb';

const connectionString = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || process.env.DB_NAME;

if (!connectionString) {
  throw new Error('MONGODB_URI is not defined');
}
if (!dbName) {
  throw new Error('MONGODB_DB_NAME is not defined');
}

const authors = [
  { id: 'a1', name: 'Jane Austen', birthYear: 1775 },
  { id: 'a2', name: 'William Shakespeare', birthYear: 1564 },
  { id: 'a3', name: 'Charles Dickens', birthYear: 1812 },
];

const books = [
  {
    id: 'b1',
    authorId: 'a1',
    title: "Harry Potter and the Philosopher's Stone",
    publicationDate: '1997-06-26',
  },
  {
    id: 'b2',
    authorId: 'a3',
    title: 'Animal Farm',
    publicationDate: '1945-08-17',
  },
  {
    id: 'b3',
    authorId: 'a3',
    title: 'Things Fall Apart',
    publicationDate: '1958-06-17',
  },
  {
    id: 'b4',
    authorId: 'a2',
    title: 'Romeo and Juliet',
    publicationDate: '1597-01-01',
  },
];

const client = new MongoClient(connectionString);

try {
  await client.connect();
  const db = client.db(dbName);
  const authorsCol = db.collection('authors');
  const booksCol = db.collection('books');

  const deletedAuthors = await authorsCol.deleteMany({});
  const insertedAuthors = await authorsCol.insertMany(authors);
  console.log(`Authors: deleted ${deletedAuthors.deletedCount}, inserted ${insertedAuthors.insertedCount}`);

  const deletedBooks = await booksCol.deleteMany({});
  const insertedBooks = await booksCol.insertMany(books);
  console.log(`Books: deleted ${deletedBooks.deletedCount}, inserted ${insertedBooks.insertedCount}`);

  const sampleAuthor = await authorsCol.findOne({ id: 'a1' }, { projection: { _id: 0 } });
  const sampleBook = await booksCol.findOne({ id: 'b1' }, { projection: { _id: 0 } });
  console.log('Sample author:', sampleAuthor);
  console.log('Sample book:', sampleBook);
} finally {
  await client.close();
}
