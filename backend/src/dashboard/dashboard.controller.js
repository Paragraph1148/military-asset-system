const pool = require("../config/db");

const getDashboard = async (req, res) => {
  const { base_id, asset_id, start_date, end_date } = req.query;

  // optional filters
  const filters = [];
  const values = [];

  if (base_id) {
    values.push(base_id);
    filters.push(`base_id = $${values.length}`);
  }

  if (asset_id) {
    values.push(asset_id);
    filters.push(`asset_id = $${values.length}`);
  }

  if (start_date) {
    values.push(start_date);
    filters.push(`created_at >= $${values.length}`);
  }

  if (end_date) {
    values.push(end_date);
    filters.push(`created_at <= $${values.length}`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  try {
    // net movements
    const movementResult = await pool.query(
      `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'purchase' THEN quantity ELSE 0 END), 0) AS purchases,
        COALESCE(SUM(CASE WHEN type = 'transfer_in' THEN quantity ELSE 0 END), 0) AS transfer_in,
        COALESCE(SUM(CASE WHEN type = 'transfer_out' THEN quantity ELSE 0 END), 0) AS transfer_out,
        COALESCE(SUM(CASE WHEN type = 'assignment' THEN quantity ELSE 0 END), 0) AS assigned,
        COALESCE(SUM(CASE WHEN type = 'expended' THEN quantity ELSE 0 END), 0) AS expended
      FROM transactions
      ${whereClause}
      `,
      values
    );

    // closing balance (current inventory)
    const closingResult = await pool.query(
      `
      SELECT COALESCE(SUM(quantity), 0) AS closing_balance
      FROM inventory
      ${base_id ? "WHERE base_id = $1" : ""}
      `,
      base_id ? [base_id] : []
    );

    const data = movementResult.rows[0];

    const net_movement =
      Number(data.purchases) +
      Number(data.transfer_in) -
      Number(data.transfer_out);

    res.json({
      opening_balance: "derived from transactions (not stored)",
      closing_balance: Number(closingResult.rows[0].closing_balance),
      net_movement,
      purchases: Number(data.purchases),
      transfer_in: Number(data.transfer_in),
      transfer_out: Number(data.transfer_out),
      assigned: Number(data.assigned),
      expended: Number(data.expended),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDashboard };
