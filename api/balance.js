import clientPromise from "../lib/mongodb.js";

export default async function handler(req, res) {
  // ✅ Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("mines_game");
    const balances = db.collection("balances");

    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const user = await balances.findOne({ userId });

    res.status(200).json({
      userId,
      balance: user ? user.balance : 0
    });
  } catch (err) {
    console.error("Balance error:", err);
    res.status(500).json({ error: err.message });
  }
}
