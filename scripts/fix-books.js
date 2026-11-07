import { MongoClient } from 'mongodb';

const connectionString = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || process.env.DB_NAME;

if (!connectionString) throw new Error('MONGODB_URI is not defined');
if (!dbName) throw new Error('MONGODB_DB_NAME is not defined');

const books = [
  {
    id: 'b1',
    author: 'J.K. Rowling',
    title: "Harry Potter and the Philosopher's Stone",
    publicationDate: '1997-06-26',
  },
  {
    id: 'b2',
    author: 'George Orwell',
    title: 'Animal Farm',
    publicationDate: '1945-08-17',
  },
  {
    id: 'b3',
    author: 'Chinua Achebe',
    title: 'Things Fall Apart',
    publicationDate: '1958-06-17',
  },
  {
    id: 'b4',
    author: 'William Shakespeare',
    title: 'Romeo and Juliet',
    publicationDate: '1597-01-01',
  },
];

const client = new MongoClient(connectionString);

try {
  await client.connect();
  const collection = client.db(dbName).collection('books');

  const deleted = await collection.deleteMany({});
  const inserted = await collection.insertMany(books);

  console.log(`Deleted ${deleted.deletedCount} document(s) from ${dbName}.books`);
  console.log(`Inserted ${inserted.insertedCount} document(s)`);

  const sample = await collection.findOne({ id: 'b1' }, { projection: { _id: 0 } });
  console.log('b1 lookup:', sample);
} finally {
  await client.close();
}
