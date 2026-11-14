import { MongoClient, ObjectId } from 'mongodb';

const connectionString = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || process.env.DB_NAME;

if (!connectionString) {
  throw new Error('MONGODB_URI is not defined');
}
if (!dbName) {
  throw new Error('MONGODB_DB_NAME is not defined');
}

const updates = [
  { _id: new ObjectId('6aef61e29412da52eb3fe9f2'), authorId: 'a1' },
  { _id: new ObjectId('6aef61e29412da52eb3fe9f3'), authorId: 'a3' },
  { _id: new ObjectId('6aef61e29412da52eb3fe9f4'), authorId: 'a3' },
  { _id: new ObjectId('6aef61e29412da52eb3fe9f5'), authorId: 'a2' },
];

const client = new MongoClient(connectionString);

try {
  await client.connect();
  const books = client.db(dbName).collection('books');

  for (const update of updates) {
    const result = await books.updateOne(
      { _id: update._id },
      { $set: { authorId: update.authorId }, $unset: { author: '' } }
    );
    console.log(`${update._id.toString()}: matched=${result.matchedCount} modified=${result.modifiedCount}`);
  }

  const out = await books
    .find({}, { projection: { _id: 0 } })
    .sort({ id: 1 })
    .toArray();
  console.log(JSON.stringify(out, null, 2));
} finally {
  await client.close();
}
