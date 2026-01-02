const pool = require("../config/db");

const createPurchase = async (req, res) => {
  const { base_id, asset_id, quantity } = req.body;

  if (!base_id || !asset_id || !quantity) {
    return res.status(400).json({ error: "missing required fields" });
  }

  try {
    // upsert inventory
    await pool.query(
      `
      INSERT INTO inventory (base_id, asset_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (base_id, asset_id)
      DO UPDATE SET quantity = inventory.quantity + EXCLUDED.quantity
      `,
      [base_id, asset_id, quantity]
    );

    // log transaction
    await pool.query(
      `
      INSERT INTO transactions (type, base_id, asset_id, quantity)
      VALUES ('purchase', $1, $2, $3)
      `,
      [base_id, asset_id, quantity]
    );

    res.status(201).json({ message: "purchase recorded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPurchases = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM transactions
      WHERE type = 'purchase'
      ORDER BY created_at DESC
      `
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createPurchase, getPurchases };
