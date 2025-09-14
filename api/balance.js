import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URI; // your Mongo URI
const client = new MongoClient(uri);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("mines_game");
    const balances = db.collection("balances");

    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const user = await balances.findOne({ userId });

    res.status(200).json({
      userId,
      balance: user ? user.balance : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
      }
