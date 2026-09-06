-- Operava Desk — D1 schema (Cloudflare)
-- Apply: npx wrangler d1 execute operava-desk --remote --file=./migrations/0001_init.sql
-- Local:  npx wrangler d1 execute operava-desk --local --file=./migrations/0001_init.sql

PRAGMA foreign_keys = ON;

-- Generic JSON document store (portal state blobs keyed by name)
CREATE TABLE IF NOT EXISTS portal_docs (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Support tickets (normalized enough for queries; messages as JSON)
CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY NOT NULL,
  ticket_no TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  category TEXT,
  priority TEXT NOT NULL DEFAULT 'Medium',
  status TEXT NOT NULL DEFAULT 'Open',
  channel TEXT,
  client_name TEXT,
  client_email TEXT,
  assigned_agent_id TEXT,
  sla_due TEXT,
  sla_breached INTEGER NOT NULL DEFAULT 0,
  payload TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);

-- CRM leads (payload holds full lead JSON)
CREATE TABLE IF NOT EXISTS crm_leads (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT,
  stage TEXT,
  score INTEGER,
  deal_value REAL,
  payload TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_crm_stage ON crm_leads(stage);

-- Audit / security log append-only
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY NOT NULL,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  actor TEXT,
  module TEXT,
  action TEXT NOT NULL,
  severity TEXT DEFAULT 'Info',
  details TEXT,
  ip_address TEXT,
  payload TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_audit_ts ON audit_logs(timestamp);

-- File metadata (bytes live in R2 under object_key)
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  folder TEXT,
  size_bytes INTEGER,
  content_type TEXT,
  object_key TEXT NOT NULL UNIQUE,
  author TEXT,
  version TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_files_folder ON files(folder);
