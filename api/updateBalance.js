import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    await client.connect();
    const db = client.db("mines_game");
    const balances = db.collection("balances");

    const { userId, balance } = req.body;
    if (!userId || balance === undefined) {
      return res.status(400).json({ error: "Missing userId or balance" });
    }

    await balances.updateOne(
      { userId },
      { $set: { balance } },
      { upsert: true }
    );

    res.status(200).json({ success: true, userId, balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
                         }
