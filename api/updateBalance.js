import clientPromise from "../lib/mongodb.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("mines_game");
    const balances = db.collection("balances");

    const { userId, balance } = req.body;

    if (!userId || balance === undefined) {
      return res.status(400).json({ error: "Missing userId or balance" });
    }

    await balances.updateOne(
      { userId },
      { $set: { balance: parseFloat(balance) } },
      { upsert: true }
    );

    res.status(200).json({ success: true, userId, balance: parseFloat(balance) });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
}
