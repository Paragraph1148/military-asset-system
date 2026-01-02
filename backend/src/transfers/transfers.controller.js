const pool = require("../config/db");

const createTransfer = async (req, res) => {
  const { from_base_id, to_base_id, asset_id, quantity } = req.body;

  if (!from_base_id || !to_base_id || !asset_id || !quantity) {
    return res.status(400).json({ error: "missing required fields" });
  }

  if (from_base_id === to_base_id) {
    return res.status(400).json({ error: "cannot transfer to same base" });
  }

  try {
    // check available inventory
    const inventoryResult = await pool.query(
      `
      SELECT quantity FROM inventory
      WHERE base_id = $1 AND asset_id = $2
      `,
      [from_base_id, asset_id]
    );

    if (
      inventoryResult.rows.length === 0 ||
      inventoryResult.rows[0].quantity < quantity
    ) {
      return res.status(400).json({ error: "insufficient inventory" });
    }

    // subtract from source base
    await pool.query(
      `
      UPDATE inventory
      SET quantity = quantity - $1
      WHERE base_id = $2 AND asset_id = $3
      `,
      [quantity, from_base_id, asset_id]
    );

    // add to destination base (upsert)
    await pool.query(
      `
      INSERT INTO inventory (base_id, asset_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (base_id, asset_id)
      DO UPDATE SET quantity = inventory.quantity + EXCLUDED.quantity
      `,
      [to_base_id, asset_id, quantity]
    );

    // log transfer_out
    await pool.query(
      `
      INSERT INTO transactions (type, base_id, asset_id, quantity)
      VALUES ('transfer_out', $1, $2, $3)
      `,
      [from_base_id, asset_id, quantity]
    );

    // log transfer_in
    await pool.query(
      `
      INSERT INTO transactions (type, base_id, asset_id, quantity)
      VALUES ('transfer_in', $1, $2, $3)
      `,
      [to_base_id, asset_id, quantity]
    );

    res.status(201).json({ message: "transfer completed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTransfers = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM transactions
      WHERE type IN ('transfer_in', 'transfer_out')
      ORDER BY created_at DESC
      `
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createTransfer, getTransfers };
