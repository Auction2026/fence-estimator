CREATE INDEX IF NOT EXISTS idx_estimates_status ON estimates(status);
CREATE INDEX IF NOT EXISTS idx_contracts_signed_at ON contracts(signed_at);
CREATE INDEX IF NOT EXISTS idx_inventory_name ON inventory(name);
