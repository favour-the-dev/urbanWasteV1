import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/urbanwastev1";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const g = global as any;
g._mongoClientPromise = g._mongoClientPromise || { conn: null, promise: null };

export async function connectToDB() {
  if (g._mongoClientPromise.conn) {
    return g._mongoClientPromise.conn;
  }

  if (!g._mongoClientPromise.promise) {
    const opts = {
      bufferCommands: false,
    };
    g._mongoClientPromise.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance: typeof mongoose) => mongooseInstance);
  }

  g._mongoClientPromise.conn = await g._mongoClientPromise.promise;
  return g._mongoClientPromise.conn;
}

export default mongoose;
