ALTER TABLE contracts ADD CONSTRAINT contracts_total_amount_nonnegative CHECK (total_amount >= 0);
ALTER TABLE change_orders ADD CONSTRAINT change_orders_delta_amount_nonzero CHECK (delta_amount <> 0);
