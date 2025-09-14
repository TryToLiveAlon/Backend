import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URI;
if (!uri) {
  throw new Error("❌ MONGO_DB_URI is not defined in environment variables");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // reuse client in dev to avoid hot reload issues
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // in production, always new client
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
