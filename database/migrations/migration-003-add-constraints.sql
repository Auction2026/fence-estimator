-- Migration 003: check constraints
ALTER TABLE estimates
  ADD CONSTRAINT chk_estimates_total_nonnegative CHECK (total >= 0);

ALTER TABLE inventory_items
  ADD CONSTRAINT chk_inventory_price_nonnegative CHECK (unit_price >= 0);
