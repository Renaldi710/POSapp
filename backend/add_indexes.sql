-- ponytail: B-Tree indexes for serverless POS. Add when pg_stat_user_indexes shows high seq scans.
-- Ceiling: Indexes slow writes; drop if write latency spikes post-deploy.

-- Foreign keys (already added via model.py index=True, kept here for explicit documentation)
CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_transaction_items_transaction_id
    ON transaction_items (transaction_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_transaction_items_product_id
    ON transaction_items (product_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_products_category_id
    ON products (category_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_transactions_user_id
    ON transactions (user_id);

-- Sort/filter optimization (DESC for newest-first pagination)
CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_transactions_created_at_desc
    ON transactions (created_at DESC);

-- Composite index for common filter combos (daily report, user transactions)
CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_transactions_user_created
    ON transactions (user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_transactions_created_status
    ON transactions (created_at DESC, status);

-- Analyze tables after index creation
ANALYZE transactions;
ANALYZE transaction_items;
ANALYZE products;
