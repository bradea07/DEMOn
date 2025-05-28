-- Add the created_at column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;

-- Update existing products with a creation date if it's null
-- We'll set them with different dates to avoid all products appearing as "new" at the same time
UPDATE products SET created_at = DATE_SUB(NOW(), INTERVAL (id % 30) DAY) WHERE created_at IS NULL;

-- Add index on created_at for better performance on queries that filter by date
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Create unique index on user_id and product_id in the user_recommendation_history table
-- to prevent duplicate entries for the same user-product combination
ALTER TABLE user_recommendation_history ADD CONSTRAINT IF NOT EXISTS uk_user_product UNIQUE (user_id, product_id);
