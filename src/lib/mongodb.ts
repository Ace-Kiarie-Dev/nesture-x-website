import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;

if (!uri) throw new Error('Missing MONGODB_URI in environment variables.');

// In development, reuse the client across hot reloads.
// In production, create a fresh client per serverless invocation.
const globalWithMongo = global as typeof globalThis & {
  _mongoClient?: MongoClient;
};

let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri);
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(uri);
}

export async function getDb() {
  await client.connect();
  return client.db('nesture-x');
}
