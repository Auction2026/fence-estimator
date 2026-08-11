-- Database Recovery Procedures
-- Restore commands for Fence Depot Estimator.
-- psql -h localhost -U fence_user -d fence_estimator -f backup_YYYYMMDD.sql
-- pg_restore -h localhost -U fence_user -d fence_estimator --clean --if-exists backup_YYYYMMDD.dump

CREATE OR REPLACE FUNCTION restore_inventory_item(
    p_sku VARCHAR,
    p_name VARCHAR,
    p_category VARCHAR,
    p_subcategory VARCHAR,
    p_fence_type VARCHAR,
    p_unit VARCHAR,
    p_unit_cost NUMERIC,
    p_retail_price NUMERIC,
    p_quantity_on_hand INTEGER,
    p_reorder_level INTEGER,
    p_supplier VARCHAR,
    p_supplier_sku VARCHAR,
    p_description TEXT
)
RETURNS UUID AS $$
DECLARE
    v_inventory_id UUID;
BEGIN
    INSERT INTO inventory (
        sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price,
        quantity_on_hand, reorder_level, supplier, supplier_sku, description
    ) VALUES (
        p_sku, p_name, p_category, p_subcategory, p_fence_type, p_unit, p_unit_cost, p_retail_price,
        p_quantity_on_hand, p_reorder_level, p_supplier, p_supplier_sku, p_description
    )
    ON CONFLICT (sku) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        subcategory = EXCLUDED.subcategory,
        fence_type = EXCLUDED.fence_type,
        unit = EXCLUDED.unit,
        unit_cost = EXCLUDED.unit_cost,
        retail_price = EXCLUDED.retail_price,
        quantity_on_hand = EXCLUDED.quantity_on_hand,
        reorder_level = EXCLUDED.reorder_level,
        supplier = EXCLUDED.supplier,
        supplier_sku = EXCLUDED.supplier_sku,
        description = EXCLUDED.description,
        updated_at = CURRENT_TIMESTAMP
    RETURNING inventory_id INTO v_inventory_id;

    RETURN v_inventory_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION restore_project_from_json(p_payload JSONB)
RETURNS UUID AS $$
DECLARE
    v_project_id UUID;
BEGIN
    INSERT INTO projects (
        project_id, project_number, customer_first_name, customer_last_name, customer_email, customer_phone,
        customer_company, address_street, address_city, address_state, address_zip, property_type,
        project_type, status, estimator_id, notes, start_date, end_date
    ) VALUES (
        COALESCE((p_payload ->> 'project_id')::UUID, uuid_generate_v4()),
        p_payload ->> 'project_number',
        p_payload ->> 'customer_first_name',
        p_payload ->> 'customer_last_name',
        p_payload ->> 'customer_email',
        p_payload ->> 'customer_phone',
        p_payload ->> 'customer_company',
        p_payload ->> 'address_street',
        p_payload ->> 'address_city',
        p_payload ->> 'address_state',
        p_payload ->> 'address_zip',
        p_payload ->> 'property_type',
        p_payload ->> 'project_type',
        COALESCE(p_payload ->> 'status', 'draft'),
        (p_payload ->> 'estimator_id')::UUID,
        p_payload ->> 'notes',
        NULLIF(p_payload ->> 'start_date', '')::DATE,
        NULLIF(p_payload ->> 'end_date', '')::DATE
    )
    ON CONFLICT (project_id) DO UPDATE SET
        customer_first_name = EXCLUDED.customer_first_name,
        customer_last_name = EXCLUDED.customer_last_name,
        customer_email = EXCLUDED.customer_email,
        customer_phone = EXCLUDED.customer_phone,
        customer_company = EXCLUDED.customer_company,
        address_street = EXCLUDED.address_street,
        address_city = EXCLUDED.address_city,
        address_state = EXCLUDED.address_state,
        address_zip = EXCLUDED.address_zip,
        property_type = EXCLUDED.property_type,
        project_type = EXCLUDED.project_type,
        status = EXCLUDED.status,
        estimator_id = EXCLUDED.estimator_id,
        notes = EXCLUDED.notes,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        updated_at = CURRENT_TIMESTAMP
    RETURNING project_id INTO v_project_id;

    RETURN v_project_id;
END;
$$ LANGUAGE plpgsql;
