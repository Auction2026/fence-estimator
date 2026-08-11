ALTER TABLE estimates ADD CONSTRAINT chk_estimate_amount_non_negative CHECK (total_amount >= 0);
ALTER TABLE inventory ADD CONSTRAINT chk_inventory_non_negative CHECK (quantity >= 0 AND cost >= 0 AND retail_price >= 0);
