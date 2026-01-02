const pool = require("../config/db");

const assignAsset = async (req, res) => {
  const { base_id, asset_id, quantity, assignee } = req.body;

  if (!base_id || !asset_id || !quantity) {
    return res.status(400).json({ error: "missing required fields" });
  }

  try {
    // check inventory
    const inventoryResult = await pool.query(
      `
      SELECT quantity FROM inventory
      WHERE base_id = $1 AND asset_id = $2
      `,
      [base_id, asset_id]
    );

    if (
      inventoryResult.rows.length === 0 ||
      inventoryResult.rows[0].quantity < quantity
    ) {
      return res.status(400).json({ error: "insufficient inventory" });
    }

    // reduce inventory
    await pool.query(
      `
      UPDATE inventory
      SET quantity = quantity - $1
      WHERE base_id = $2 AND asset_id = $3
      `,
      [quantity, base_id, asset_id]
    );

    // log assignment
    await pool.query(
      `
      INSERT INTO transactions (type, base_id, asset_id, quantity, metadata)
      VALUES ('assignment', $1, $2, $3, $4)
      `,
      [base_id, asset_id, quantity, { assignee }]
    );

    res.status(201).json({ message: "asset assigned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const expendAsset = async (req, res) => {
  const { base_id, asset_id, quantity, reason } = req.body;

  if (!base_id || !asset_id || !quantity) {
    return res.status(400).json({ error: "missing required fields" });
  }

  try {
    const inventoryResult = await pool.query(
      `
      SELECT quantity FROM inventory
      WHERE base_id = $1 AND asset_id = $2
      `,
      [base_id, asset_id]
    );

    if (
      inventoryResult.rows.length === 0 ||
      inventoryResult.rows[0].quantity < quantity
    ) {
      return res.status(400).json({ error: "insufficient inventory" });
    }

    // reduce inventory
    await pool.query(
      `
      UPDATE inventory
      SET quantity = quantity - $1
      WHERE base_id = $2 AND asset_id = $3
      `,
      [quantity, base_id, asset_id]
    );

    // log expended
    await pool.query(
      `
      INSERT INTO transactions (type, base_id, asset_id, quantity, metadata)
      VALUES ('expended', $1, $2, $3, $4)
      `,
      [base_id, asset_id, quantity, { reason }]
    );

    res.status(201).json({ message: "asset expended successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { assignAsset, expendAsset };
