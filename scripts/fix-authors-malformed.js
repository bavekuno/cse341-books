import { MongoClient, ObjectId } from 'mongodb';

const connectionString = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || process.env.DB_NAME;

if (!connectionString) {
  throw new Error('MONGODB_URI is not defined');
}
if (!dbName) {
  throw new Error('MONGODB_DB_NAME is not defined');
}

const fixes = [
  {
    _id: new ObjectId('6af722727ba5f5ff1e4f7f38'),
    doc: { id: 'a1', name: 'Jane Austen', birthYear: 1775 },
  },
  {
    _id: new ObjectId('6af723147ba5f5ff1e4f7f39'),
    doc: { id: 'a2', name: 'William Shakespeare', birthYear: 1564 },
  },
  {
    _id: new ObjectId('6af7231f7ba5f5ff1e4f7f3a'),
    doc: { id: 'a3', name: 'Charles Dickens', birthYear: 1812 },
  },
];

const client = new MongoClient(connectionString);

try {
  await client.connect();
  const collection = client.db(dbName).collection('authors');

  for (const fix of fixes) {
    const result = await collection.replaceOne({ _id: fix._id }, fix.doc);
    console.log(`Replaced ${fix._id.toString()}: matched=${result.matchedCount} modified=${result.modifiedCount}`);
  }

  const authors = await collection.find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
  console.log('Authors now:', authors);
} finally {
  await client.close();
}
