-- ============================================================
-- FENCE DEPOT FENCE ESTIMATOR - DATABASE SCHEMA
-- MySQL-Only Schema (requires MySQL 8.0+)
-- Note: Uses MySQL-specific syntax (InnoDB, TINYINT, AUTO_INCREMENT,
--       FULLTEXT INDEX, CREATE INDEX IF NOT EXISTS).
--       Not compatible with PostgreSQL without modification.
-- Version: 1.0.0
-- ============================================================

-- Create database (run as superuser or DBA)
-- CREATE DATABASE fence_estimator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE fence_estimator;

-- ============================================================
-- TABLE 1: users
-- Stores all system users (admin, estimators, crew)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    email           VARCHAR(100) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            ENUM('admin','estimator','crew') NOT NULL DEFAULT 'estimator',
    first_name      VARCHAR(50),
    last_name       VARCHAR(50),
    company         VARCHAR(100) NOT NULL DEFAULT 'Fence Depot',
    phone           VARCHAR(20),
    is_active       TINYINT(1)   NOT NULL DEFAULT 1,
    last_login      DATETIME,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email  (email),
    INDEX idx_users_role   (role),
    INDEX idx_users_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE 2: customers
-- Customer records linked to estimates & projects
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(50)  NOT NULL,
    last_name       VARCHAR(50)  NOT NULL,
    email           VARCHAR(100),
    phone           VARCHAR(20)  NOT NULL,
    address         VARCHAR(200) NOT NULL,
    city            VARCHAR(100) NOT NULL,
    province        VARCHAR(50)  NOT NULL DEFAULT 'AB',
    postal_code     VARCHAR(10)  NOT NULL,
    notes           TEXT,
    created_by      INT UNSIGNED,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_customers_email    (email),
    INDEX idx_customers_lastname (last_name),
    INDEX idx_customers_phone    (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE 3: projects
-- Fence installation projects
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_number  VARCHAR(20)  NOT NULL UNIQUE,
    customer_id     INT UNSIGNED NOT NULL,
    estimator_id    INT UNSIGNED NOT NULL,
    project_name    VARCHAR(200),
    site_address    VARCHAR(200),
    site_city       VARCHAR(100),
    site_province   VARCHAR(50)  DEFAULT 'AB',
    site_postal     VARCHAR(10),
    status          ENUM('draft','estimate','approved','in_progress','completed','cancelled') NOT NULL DEFAULT 'draft',
    start_date      DATE,
    completion_date DATE,
    notes           TEXT,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id)  REFERENCES customers(id) ON DELETE RESTRICT,
    FOREIGN KEY (estimator_id) REFERENCES users(id)     ON DELETE RESTRICT,
    INDEX idx_projects_number   (project_number),
    INDEX idx_projects_customer (customer_id),
    INDEX idx_projects_status   (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE 4: fence_specifications
-- Technical specs for each fence section in a project
-- ============================================================
CREATE TABLE IF NOT EXISTS fence_specifications (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id          INT UNSIGNED NOT NULL,
    section_label       VARCHAR(50)  DEFAULT 'Main Section',
    fence_type          ENUM('Chain Link','Wood','Vinyl','Wrought Iron','Composite','Aluminum','PVC') NOT NULL DEFAULT 'Chain Link',
    height_feet         DECIMAL(5,2) NOT NULL DEFAULT 4.00,
    color               VARCHAR(50)  DEFAULT 'Galvanized',
    linear_feet         DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    number_posts        INT          NOT NULL DEFAULT 0,
    post_spacing_feet   DECIMAL(4,2) NOT NULL DEFAULT 10.00,
    post_gauge          DECIMAL(4,2),
    post_diameter_in    DECIMAL(4,2),
    gate_type           ENUM('None','Single Swing','Double Swing','Sliding','Cantilever','Barrier') DEFAULT 'None',
    number_gates        INT          NOT NULL DEFAULT 0,
    barbed_wire         TINYINT(1)   NOT NULL DEFAULT 0,
    barbed_wire_strands INT          DEFAULT 0,
    installation_type   ENUM('Residential','Commercial','Industrial','Specialty') NOT NULL DEFAULT 'Residential',
    terrain             ENUM('Flat','Slight Slope','Steep Slope','Rocky','Soft Ground') DEFAULT 'Flat',
    special_notes       TEXT,
    created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_fencespec_project (project_id),
    INDEX idx_fencespec_type    (fence_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE 5: estimates
-- Financial estimates linked to projects
-- ============================================================
CREATE TABLE IF NOT EXISTS estimates (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    estimate_number     VARCHAR(20)  NOT NULL UNIQUE,
    project_id          INT UNSIGNED NOT NULL,
    customer_id         INT UNSIGNED NOT NULL,
    created_by          INT UNSIGNED NOT NULL,
    fence_type          VARCHAR(50)  NOT NULL,
    linear_feet         DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    height_feet         DECIMAL(5,2),
    material_cost       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    labor_hours         DECIMAL(8,2)  NOT NULL DEFAULT 0.00,
    labor_rate          DECIMAL(8,2)  NOT NULL DEFAULT 65.00,
    labor_cost          DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    equipment_cost      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    disposal_cost       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    subtotal            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    markup_percent      DECIMAL(5,2)  NOT NULL DEFAULT 20.00,
    markup_amount       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax_percent         DECIMAL(5,2)  NOT NULL DEFAULT 5.00,
    tax_amount          DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    deposit_required    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status              ENUM('draft','sent','approved','declined','expired') NOT NULL DEFAULT 'draft',
    valid_until         DATE,
    notes               TEXT,
    pricing_locked      TINYINT(1)    NOT NULL DEFAULT 0,
    pricing_locked_at   DATETIME,
    pricing_locked_by   INT UNSIGNED,
    emailed_at          DATETIME,
    approved_at         DATETIME,
    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id)       REFERENCES projects(id)  ON DELETE RESTRICT,
    FOREIGN KEY (customer_id)      REFERENCES customers(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by)       REFERENCES users(id)     ON DELETE RESTRICT,
    FOREIGN KEY (pricing_locked_by) REFERENCES users(id)   ON DELETE SET NULL,
    INDEX idx_estimates_number    (estimate_number),
    INDEX idx_estimates_project   (project_id),
    INDEX idx_estimates_customer  (customer_id),
    INDEX idx_estimates_status    (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE 6: estimate_line_items
-- Individual product/material lines within an estimate
-- ============================================================
CREATE TABLE IF NOT EXISTS estimate_line_items (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    estimate_id     INT UNSIGNED NOT NULL,
    product_plu     VARCHAR(20),
    product_name    VARCHAR(200) NOT NULL,
    department      VARCHAR(100),
    unit_of_measure VARCHAR(20)  DEFAULT 'EA',
    quantity        DECIMAL(10,3) NOT NULL DEFAULT 0.000,
    unit_cost       DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    unit_sell       DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    line_total      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    notes           VARCHAR(255),
    sort_order      INT          NOT NULL DEFAULT 0,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE,
    INDEX idx_lineitems_estimate  (estimate_id),
    INDEX idx_lineitems_plu       (product_plu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE 7: inventory_products
-- Master product catalog (mirrors POS inventory)
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory_products (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    plu             VARCHAR(20)  NOT NULL UNIQUE,
    description     VARCHAR(255) NOT NULL,
    department      VARCHAR(100) NOT NULL,
    unit_of_measure VARCHAR(20)  NOT NULL DEFAULT 'EA',
    cost_price      DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    sell_price      DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    on_hand_qty     DECIMAL(10,3) NOT NULL DEFAULT 0.000,
    reorder_point   DECIMAL(10,3) DEFAULT 0.000,
    reorder_qty     DECIMAL(10,3) DEFAULT 0.000,
    vendor_name     VARCHAR(100),
    vendor_sku      VARCHAR(50),
    is_active       TINYINT(1)   NOT NULL DEFAULT 1,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_products_plu        (plu),
    INDEX idx_products_dept       (department),
    INDEX idx_products_active     (is_active),
    FULLTEXT INDEX ft_products_desc (description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE 8: change_orders
-- Modifications to approved estimates/contracts
-- ============================================================
CREATE TABLE IF NOT EXISTS change_orders (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    change_order_number VARCHAR(20)   NOT NULL UNIQUE,
    project_id          INT UNSIGNED  NOT NULL,
    estimate_id         INT UNSIGNED  NOT NULL,
    requested_by        VARCHAR(100),
    description         TEXT          NOT NULL,
    reason              TEXT,
    material_cost_delta DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    labor_cost_delta    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_delta         DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status              ENUM('draft','pending_approval','approved','declined') NOT NULL DEFAULT 'draft',
    approved_by         INT UNSIGNED,
    approved_at         DATETIME,
    created_by          INT UNSIGNED  NOT NULL,
    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id)  REFERENCES projects(id)  ON DELETE RESTRICT,
    FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE RESTRICT,
    FOREIGN KEY (approved_by) REFERENCES users(id)     ON DELETE SET NULL,
    FOREIGN KEY (created_by)  REFERENCES users(id)     ON DELETE RESTRICT,
    INDEX idx_co_number   (change_order_number),
    INDEX idx_co_project  (project_id),
    INDEX idx_co_estimate (estimate_id),
    INDEX idx_co_status   (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE 9: audit_log
-- Tracks all critical actions for accountability
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED,
    action      VARCHAR(100) NOT NULL,
    table_name  VARCHAR(100),
    record_id   INT UNSIGNED,
    old_values  JSON,
    new_values  JSON,
    ip_address  VARCHAR(45),
    user_agent  VARCHAR(255),
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_user   (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_table  (table_name),
    INDEX idx_audit_date   (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- END OF SCHEMA
-- ============================================================
