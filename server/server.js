const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

const PORT = Number(process.env.PORT || 5000);
const DEMO_USER_ID = 1;

function validPositiveInt(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0;
}

app.get("/api/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS server_time");
    res.json({ status: "ok", message: "API and PostgreSQL are connected", serverTime: result.rows[0].server_time });
  } catch (error) {
    console.error(error.message);
    res.status(503).json({ status: "error", message: "Database connection failed" });
  }
});

app.get("/api/products", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, description, category, price, image_url, stock FROM products ORDER BY id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to load products" });
  }
});

async function readCart(userId) {
  const result = await pool.query(
    `SELECT p.id AS product_id, p.name, p.description, p.category,
            p.price, p.image_url, p.stock, ci.quantity,
            (p.price * ci.quantity)::NUMERIC(12,2) AS item_total
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = $1
     ORDER BY ci.created_at DESC, ci.id DESC`,
    [userId]
  );
  const items = result.rows.map((item) => ({
    ...item,
    price: Number(item.price),
    item_total: Number(item.item_total),
  }));
  const subtotal = items.reduce((sum, item) => sum + item.item_total, 0);
  return {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: Number(subtotal.toFixed(2)),
  };
}

app.get("/api/cart/:userId", async (req, res) => {
  if (!validPositiveInt(req.params.userId)) return res.status(400).json({ error: "Invalid user ID" });
  try {
    res.json(await readCart(Number(req.params.userId)));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to load cart" });
  }
});

app.post("/api/cart/:userId/items", async (req, res) => {
  const userId = Number(req.params.userId);
  const productId = Number(req.body.productId);
  const quantity = req.body.quantity === undefined ? 1 : Number(req.body.quantity);

  if (!validPositiveInt(userId) || !validPositiveInt(productId) || !validPositiveInt(quantity)) {
    return res.status(400).json({ error: "userId, productId, and quantity must be positive integers" });
  }

  try {
    const productResult = await pool.query("SELECT id, stock FROM products WHERE id = $1", [productId]);
    if (!productResult.rowCount) return res.status(404).json({ error: "Product not found" });

    const currentResult = await pool.query(
      "SELECT quantity FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );
    const nextQuantity = quantity + (currentResult.rows[0]?.quantity || 0);
    if (nextQuantity > productResult.rows[0].stock) {
      return res.status(400).json({ error: `Only ${productResult.rows[0].stock} item(s) are in stock` });
    }

    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = CURRENT_TIMESTAMP`,
      [userId, productId, nextQuantity]
    );
    res.status(200).json(await readCart(userId));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
});

app.patch("/api/cart/:userId/items/:productId", async (req, res) => {
  const userId = Number(req.params.userId);
  const productId = Number(req.params.productId);
  const quantity = Number(req.body.quantity);

  if (!validPositiveInt(userId) || !validPositiveInt(productId) || !validPositiveInt(quantity)) {
    return res.status(400).json({ error: "Quantity must be a positive integer" });
  }

  try {
    const result = await pool.query(
      `UPDATE cart_items ci
       SET quantity = $1, updated_at = CURRENT_TIMESTAMP
       FROM products p
       WHERE ci.product_id = p.id AND ci.user_id = $2 AND ci.product_id = $3
         AND $1 <= p.stock`,
      [quantity, userId, productId]
    );
    if (!result.rowCount) {
      const exists = await pool.query(
        "SELECT ci.product_id, p.stock FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.user_id = $1 AND ci.product_id = $2",
        [userId, productId]
      );
      if (!exists.rowCount) return res.status(404).json({ error: "Cart item not found" });
      return res.status(400).json({ error: `Quantity exceeds available stock (${exists.rows[0].stock})` });
    }
    res.json(await readCart(userId));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to update quantity" });
  }
});

app.delete("/api/cart/:userId/items/:productId", async (req, res) => {
  const userId = Number(req.params.userId);
  const productId = Number(req.params.productId);
  if (!validPositiveInt(userId) || !validPositiveInt(productId)) {
    return res.status(400).json({ error: "Invalid user or product ID" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );
    if (!result.rowCount) return res.status(404).json({ error: "Cart item not found" });
    res.json(await readCart(userId));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to remove item" });
  }
});

app.delete("/api/cart/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  if (!validPositiveInt(userId)) return res.status(400).json({ error: "Invalid user ID" });
  try {
    await pool.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);
    res.json(await readCart(userId));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Unexpected server error" });
});

const server = app.listen(PORT, () => {
  console.log(`Shopping cart API running at http://localhost:${PORT}`);
});

async function shutdown() {
  server.close();
  await pool.end();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
