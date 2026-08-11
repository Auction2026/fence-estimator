-- ================================================================
-- FENCE ESTIMATOR PRO – DATABASE SCHEMA
-- MySQL / MariaDB compatible
-- ================================================================

-- Create and select database
CREATE DATABASE IF NOT EXISTS fence_estimator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fence_estimator;

-- ── Users ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)     PRIMARY KEY DEFAULT (UUID()),
  username      VARCHAR(255) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin','estimator','crew') NOT NULL DEFAULT 'estimator',
  company       VARCHAR(255) NOT NULL DEFAULT 'Fence Depot',
  phone         VARCHAR(20),
  active        TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email  (email),
  INDEX idx_users_role   (role),
  INDEX idx_users_active (active)
) ENGINE=InnoDB;

-- ── Projects ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id              CHAR(36)     PRIMARY KEY DEFAULT (UUID()),
  project_id      VARCHAR(50)  UNIQUE NOT NULL,
  customer_name   VARCHAR(255) NOT NULL,
  customer_email  VARCHAR(255) NOT NULL,
  customer_phone  VARCHAR(20)  NOT NULL,
  customer_company VARCHAR(255),
  address         VARCHAR(255) NOT NULL,
  city            VARCHAR(100) NOT NULL,
  province        VARCHAR(100) NOT NULL,
  postal_code     VARCHAR(10)  NOT NULL,
  property_size   VARCHAR(50),
  property_type   ENUM('residential','commercial','industrial','agricultural') DEFAULT 'residential',
  project_notes   TEXT,
  estimator_id    CHAR(36),
  status          ENUM('draft','estimate','contract','active','completed') NOT NULL DEFAULT 'draft',
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_projects_project_id  (project_id),
  INDEX idx_projects_estimator   (estimator_id),
  INDEX idx_projects_status      (status),
  INDEX idx_projects_created     (created_at),
  CONSTRAINT fk_projects_estimator FOREIGN KEY (estimator_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── Fence Specifications ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fence_specs (
  id                   CHAR(36)       PRIMARY KEY DEFAULT (UUID()),
  project_id           VARCHAR(50)    UNIQUE NOT NULL,
  fence_type           VARCHAR(50)    NOT NULL,
  height               INT            NOT NULL,
  color                VARCHAR(50),
  post_gauge           INT,
  post_diameter        DECIMAL(5,2),
  post_spacing         INT            NOT NULL DEFAULT 8,
  gate_type            VARCHAR(50)    NOT NULL DEFAULT 'none',
  gate_width           DECIMAL(5,2),
  barbed_wire          TINYINT(1)     NOT NULL DEFAULT 0,
  privacy_slats        TINYINT(1)     NOT NULL DEFAULT 0,
  tension_wire         TINYINT(1)     NOT NULL DEFAULT 0,
  installation_type    VARCHAR(50)    NOT NULL DEFAULT 'residential',
  soil_type            VARCHAR(50)    NOT NULL DEFAULT 'normal',
  linear_feet          INT            NOT NULL,
  number_posts         INT            NOT NULL DEFAULT 0,
  number_gates         INT            NOT NULL DEFAULT 0,
  special_requirements TEXT,
  created_at           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_fspecs_project (project_id),
  CONSTRAINT fk_fspecs_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Estimates ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS estimates (
  id               CHAR(36)       PRIMARY KEY DEFAULT (UUID()),
  estimate_number  VARCHAR(50)    UNIQUE NOT NULL,
  project_id       VARCHAR(50)    NOT NULL,
  customer_name    VARCHAR(255)   NOT NULL,
  fence_type       VARCHAR(50)    NOT NULL,
  linear_feet      INT            NOT NULL,
  height           INT,
  material_cost    DECIMAL(12,2)  NOT NULL DEFAULT 0,
  labour_hours     DECIMAL(8,2)   NOT NULL DEFAULT 0,
  labour_rate      DECIMAL(8,2)   NOT NULL DEFAULT 65,
  labour_cost      DECIMAL(12,2)  NOT NULL DEFAULT 0,
  equipment_cost   DECIMAL(12,2)  NOT NULL DEFAULT 0,
  permit_cost      DECIMAL(10,2)  NOT NULL DEFAULT 0,
  contingency      DECIMAL(10,2)  NOT NULL DEFAULT 0,
  discount         DECIMAL(10,2)  NOT NULL DEFAULT 0,
  subtotal         DECIMAL(14,2)  NOT NULL DEFAULT 0,
  tax              DECIMAL(12,2)  NOT NULL DEFAULT 0,
  total            DECIMAL(14,2)  NOT NULL DEFAULT 0,
  notes            TEXT,
  status           ENUM('draft','sent','accepted','rejected') NOT NULL DEFAULT 'draft',
  valid_until      DATE,
  estimator_id     CHAR(36),
  created_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_estimates_project   (project_id),
  INDEX idx_estimates_number    (estimate_number),
  INDEX idx_estimates_status    (status),
  INDEX idx_estimates_created   (created_at),
  CONSTRAINT fk_estimates_project   FOREIGN KEY (project_id)   REFERENCES projects(project_id) ON DELETE CASCADE,
  CONSTRAINT fk_estimates_estimator FOREIGN KEY (estimator_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── Contracts ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contracts (
  id                  CHAR(36)       PRIMARY KEY DEFAULT (UUID()),
  contract_number     VARCHAR(50)    UNIQUE NOT NULL,
  estimate_number     VARCHAR(50)    NOT NULL,
  project_id          VARCHAR(50)    NOT NULL,
  customer_name       VARCHAR(255)   NOT NULL,
  scope_of_work       TEXT           NOT NULL,
  materials           TEXT           NOT NULL,
  labour              TEXT,
  timeline            VARCHAR(255),
  total_price         DECIMAL(14,2)  NOT NULL,
  price_locked        TINYINT(1)     NOT NULL DEFAULT 1,
  deposit_amount      DECIMAL(12,2),
  deposit_paid        TINYINT(1)     NOT NULL DEFAULT 0,
  final_balance       DECIMAL(12,2),
  warranty            TEXT,
  terms               TEXT,
  customer_signature  TEXT,
  customer_sign_date  TIMESTAMP      NULL,
  company_signature   TEXT,
  company_sign_date   TIMESTAMP      NULL,
  status              ENUM('pending','signed','active','completed') NOT NULL DEFAULT 'pending',
  created_at          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_contracts_project  (project_id),
  INDEX idx_contracts_number   (contract_number),
  INDEX idx_contracts_status   (status),
  INDEX idx_contracts_locked   (price_locked),
  CONSTRAINT fk_contracts_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Change Orders ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS change_orders (
  id                    CHAR(36)       PRIMARY KEY DEFAULT (UUID()),
  change_order_number   VARCHAR(50)    UNIQUE NOT NULL,
  contract_number       VARCHAR(50)    NOT NULL,
  project_id            VARCHAR(50)    NOT NULL,
  description           TEXT           NOT NULL,
  reason                TEXT,
  material_cost_change  DECIMAL(12,2)  NOT NULL DEFAULT 0,
  labour_cost_change    DECIMAL(12,2)  NOT NULL DEFAULT 0,
  timeline_change       VARCHAR(255),
  new_total             DECIMAL(14,2)  NOT NULL,
  customer_approval     TINYINT(1)     NOT NULL DEFAULT 0,
  customer_signature    TEXT,
  approval_date         TIMESTAMP      NULL,
  status                ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at            TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_co_project  (project_id),
  INDEX idx_co_contract (contract_number),
  INDEX idx_co_status   (status),
  CONSTRAINT fk_co_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Sign-Offs ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sign_offs (
  id                      CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
  sign_off_number         VARCHAR(50)   UNIQUE NOT NULL,
  project_id              VARCHAR(50)   NOT NULL,
  contract_number         VARCHAR(50)   NOT NULL,
  completion_date         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fence_inspection_passed TINYINT(1)    NOT NULL DEFAULT 0,
  customer_walkthrough    TINYINT(1)    NOT NULL DEFAULT 0,
  warranty_explained      TINYINT(1)    NOT NULL DEFAULT 0,
  photos                  JSON,
  outstanding_items       TEXT,
  follow_up_needed        TINYINT(1)    NOT NULL DEFAULT 0,
  warranty_start_date     DATE,
  next_maintenance_date   DATE,
  customer_signature      TEXT,
  customer_sign_date      TIMESTAMP     NULL,
  company_rep             VARCHAR(255)  NOT NULL,
  company_rep_signature   TEXT,
  company_rep_sign_date   TIMESTAMP     NULL,
  status                  ENUM('pending','signed','completed') NOT NULL DEFAULT 'pending',
  created_at              TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_signoff_project (project_id),
  CONSTRAINT fk_signoff_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Notes ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notes (
  id             CHAR(36)     PRIMARY KEY DEFAULT (UUID()),
  note_id        VARCHAR(50)  UNIQUE,
  title          VARCHAR(255) NOT NULL,
  category       VARCHAR(100) NOT NULL DEFAULT 'general',
  content        TEXT         NOT NULL,
  created_by_id  CHAR(36),
  usage_count    INT          NOT NULL DEFAULT 0,
  last_used      TIMESTAMP    NULL,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_notes_category (category),
  INDEX idx_notes_usage    (usage_count),
  INDEX idx_notes_created  (created_at),
  CONSTRAINT fk_notes_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── Inventory (Product Catalog) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS inventory (
  id            CHAR(36)       PRIMARY KEY DEFAULT (UUID()),
  sku           VARCHAR(100)   UNIQUE NOT NULL,
  name          VARCHAR(255)   NOT NULL,
  category      VARCHAR(100)   NOT NULL,
  type          VARCHAR(100)   NOT NULL DEFAULT 'Material',
  description   TEXT,
  unit          VARCHAR(50)    NOT NULL DEFAULT 'each',
  unit_cost     DECIMAL(12,2)  NOT NULL,
  retail_price  DECIMAL(12,2)  NOT NULL,
  quantity      INT            NOT NULL DEFAULT 0,
  supplier      VARCHAR(255),
  reorder_level INT            NOT NULL DEFAULT 10,
  active        TINYINT(1)     NOT NULL DEFAULT 1,
  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_inv_sku      (sku),
  INDEX idx_inv_category (category),
  INDEX idx_inv_active   (active),
  FULLTEXT KEY ft_inv_search (name, description, sku)
) ENGINE=InnoDB;

-- ── Audit Log ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id          CHAR(36)     PRIMARY KEY DEFAULT (UUID()),
  user_id     CHAR(36),
  action      VARCHAR(100) NOT NULL,
  table_name  VARCHAR(100),
  record_id   VARCHAR(100),
  old_data    JSON,
  new_data    JSON,
  ip_address  VARCHAR(45),
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_user    (user_id),
  INDEX idx_audit_table   (table_name),
  INDEX idx_audit_created (created_at)
) ENGINE=InnoDB;

-- ── Additional Indexes ────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_projects_created  ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_estimates_created ON estimates(created_at);
CREATE INDEX IF NOT EXISTS idx_contracts_created ON contracts(created_at);
