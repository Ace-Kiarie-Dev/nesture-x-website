import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;

if (!uri) throw new Error('Missing MONGODB_URI in environment variables.');

// One client per server instance, cached on globalThis so dev hot reloads and warm
// serverless invocations reuse its connection pool instead of opening new ones.
// Give up on an unreachable server after 8s rather than the driver's 30s default,
// unless the URI sets its own serverSelectionTimeoutMS.
const globalWithMongo = global as typeof globalThis & {
  _mongoClient?: MongoClient;
};

if (!globalWithMongo._mongoClient) {
  globalWithMongo._mongoClient = new MongoClient(
    uri,
    /serverSelectionTimeoutMS=/i.test(uri) ? {} : { serverSelectionTimeoutMS: 8000 },
  );
}
const client: MongoClient = globalWithMongo._mongoClient;

export async function getDb() {
  await client.connect();
  return client.db('nesture-x');
}
