# Eastman Hackathon — Database (`eastman_cart`)

This directory contains the relational database definition and initial dataset for the Eastman Store e-commerce platform.

---

## Requirements

- **PostgreSQL**: Version 14 or higher (v18.6 used for original dump)
- **Database Client**: `psql` CLI, pgAdmin 4, or DBeaver

---

## Database Specifications

- **Database Name**: `eastman_cart`
- **Default Schema**: `public`
- **Tables**:
  - `products`: Catalog items, pricing, inventory stock, categories, and active flags.
  - `coupons`: Percentage and fixed discount codes with minimum order constraints and caps.
  - `orders`: Checkout orders capturing subtotals, applied coupon discounts, status, and placement timestamps.
  - `order_items`: Line items capturing historical unit prices, product references, and quantities.

---

## Setup Instructions

### Option 1: Using `psql` (Recommended)

1. Create the database:
   ```sh
   createdb -U postgres eastman_cart
   ```
2. Execute the schema:
   ```sh
   psql -U postgres -d eastman_cart -f schema.sql
   ```
3. Seed sample products and coupons:
   ```sh
   psql -U postgres -d eastman_cart -f seed.sql
   ```

> **Note on PostgreSQL versions < 17**: If executing on PostgreSQL 14–16, remove or comment out lines 5 (`\restrict ...`) and 288 (`\unrestrict ...`) in `schema.sql`, as these are psql meta-commands specific to newer dump formats.

### Option 2: Using pgAdmin 4

1. Open pgAdmin 4 and establish a connection to your PostgreSQL server.
2. Under **Databases**, create a new database named `eastman_cart`.
3. Select `eastman_cart` and open the **Query Tool** (`Tools` -> `Query Tool`).
4. Open `schema.sql` and click **Execute** (F5).
5. Open `seed.sql` and click **Execute** (F5).
6. Verify table creation and data population:
   ```sql
   SELECT COUNT(*) FROM products; -- returns 10
   SELECT COUNT(*) FROM coupons;  -- returns 2
   ```

---

## Important Operational Notes

1. **Fresh Database Execution**: Run `seed.sql` only once on initial setup. Running `seed.sql` repeatedly will generate duplicate product entries because `products` does not currently possess a unique constraint on product names.
2. **Comprehensive Documentation & Audit**: For complete architectural diagrams, ERDs, frontend API integration contracts, vulnerability analysis, and recommended schema migrations, refer to the root [README.md](../README.md).
