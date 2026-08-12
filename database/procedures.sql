CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'projects_touch_updated_at') THEN
    CREATE TRIGGER projects_touch_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'fence_specs_touch_updated_at') THEN
    CREATE TRIGGER fence_specs_touch_updated_at BEFORE UPDATE ON fence_specs FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'estimates_touch_updated_at') THEN
    CREATE TRIGGER estimates_touch_updated_at BEFORE UPDATE ON estimates FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'contracts_touch_updated_at') THEN
    CREATE TRIGGER contracts_touch_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'catalog_touch_updated_at') THEN
    CREATE TRIGGER catalog_touch_updated_at BEFORE UPDATE ON catalog_products FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
  END IF;
END $$;
