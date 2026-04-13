-- ============================================================
-- AgentsNerator — Seed Data + RLS Policies
-- Run this ENTIRELY in Supabase → SQL Editor
-- ============================================================

-- 0. RLS: Allow anon to read projects & agents (dev mode)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_projects" ON projects;
DROP POLICY IF EXISTS "anon_select_agents"   ON agents;
DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
DROP POLICY IF EXISTS "anon_insert_agents"   ON agents;
DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
DROP POLICY IF EXISTS "anon_delete_agents"   ON agents;

-- SELECT: allow all (public marketplace data)
CREATE POLICY "anon_select_projects" ON projects FOR SELECT USING (true);
CREATE POLICY "anon_select_agents"   ON agents   FOR SELECT USING (true);

-- INSERT/DELETE: allow anon for now (will lock down after Auth)
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_insert_agents"   ON agents   FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE USING (true);
CREATE POLICY "anon_delete_agents"   ON agents   FOR DELETE USING (true);

-- 1. Add missing columns (safe — does nothing if already exist)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description   TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status        TEXT DEFAULT 'active';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags          TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tasks_completed INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS neutron_earned  INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_at    TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE agents ADD COLUMN IF NOT EXISTS project_id      UUID REFERENCES projects(id) ON DELETE CASCADE;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS is_ceo          BOOLEAN DEFAULT FALSE;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS avatar_icon     TEXT DEFAULT 'smart_toy';
ALTER TABLE agents ADD COLUMN IF NOT EXISTS tasks_completed INTEGER DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS created_at      TIMESTAMPTZ DEFAULT NOW();

-- 2. Seed Projects
-- ─────────────────────────────────────────────────────────────
INSERT INTO projects (id, name, description, status, tags, tasks_completed, neutron_earned)
VALUES
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Content Production',
    'Full content pipeline: keyword research → writing → image generation → proofreading.',
    'active',
    ARRAY['SEO', 'Writing', 'Images'],
    842,
    124
  ),
  (
    'a1b2c3d4-0002-0002-0002-000000000002',
    'Game Development',
    'Autonomous game studio: ideation → frontend → backend → deployment.',
    'building',
    ARRAY['Frontend', 'Backend', 'Deploy'],
    217,
    38
  ),
  (
    'a1b2c3d4-0003-0003-0003-000000000003',
    'Market Research',
    'Competitor analysis and sentiment tracking. Scans 50+ sources daily.',
    'paused',
    ARRAY['Analysis', 'Reports'],
    183,
    21
  )
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Agents (Project 1 — Content Production)
-- ─────────────────────────────────────────────────────────────
INSERT INTO agents (id, project_id, agent_name, role, barcode, score, status, is_ceo, avatar_icon, tasks_completed)
VALUES
  ('b1000001-0001-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 'Director-1',    'CEO',          'AGT-DIR-001-X9K2M', 94, 'active',   TRUE,  'psychology',    310),
  ('b1000001-0001-0001-0001-000000000002', 'a1b2c3d4-0001-0001-0001-000000000001', 'Keyword-Hunter','SEO / Keywords','AGT-KWH-042-P3L7N', 81, 'active',   FALSE, 'manage_search', 204),
  ('b1000001-0001-0001-0001-000000000003', 'a1b2c3d4-0001-0001-0001-000000000001', 'Scribe-Prime',  'Writer',        'AGT-SCB-109-Q8V4R', 77, 'active',   FALSE, 'edit_note',     178),
  ('b1000001-0001-0001-0001-000000000004', 'a1b2c3d4-0001-0001-0001-000000000001', 'PixelForge',    'Image Gen',     'AGT-PXF-203-H5T1W', 63, 'idle',     FALSE, 'image',          97),
  ('b1000001-0001-0001-0001-000000000005', 'a1b2c3d4-0001-0001-0001-000000000001', 'ProofBot-X',    'Proofreader',   'AGT-PRF-311-B9J6S', 72, 'active',   FALSE, 'spellcheck',    178)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Agents (Project 2 — Game Development)
INSERT INTO agents (id, project_id, agent_name, role, barcode, score, status, is_ceo, avatar_icon, tasks_completed)
VALUES
  ('b2000002-0002-0002-0002-000000000001', 'a1b2c3d4-0002-0002-0002-000000000002', 'GameLead-X',  'CEO',       'AGT-GML-X02-A4C8D', 88, 'active',   TRUE,  'sports_esports', 89),
  ('b2000002-0002-0002-0002-000000000002', 'a1b2c3d4-0002-0002-0002-000000000002', 'IdeaEngine',  'Researcher','AGT-IDE-077-F2G5H', 70, 'training', FALSE, 'lightbulb',      45),
  ('b2000002-0002-0002-0002-000000000003', 'a1b2c3d4-0002-0002-0002-000000000002', 'PixelCraft',  'Coder',     'AGT-PCF-144-K7L3M', 65, 'active',   FALSE, 'code',           52),
  ('b2000002-0002-0002-0002-000000000004', 'a1b2c3d4-0002-0002-0002-000000000002', 'ServerMind',  'Coder',     'AGT-SVM-228-N1P4Q', 58, 'idle',     FALSE, 'dns',            31)
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Agents (Project 3 — Market Research)
INSERT INTO agents (id, project_id, agent_name, role, barcode, score, status, is_ceo, avatar_icon, tasks_completed)
VALUES
  ('b3000003-0003-0003-0003-000000000001', 'a1b2c3d4-0003-0003-0003-000000000003', 'Analyst-Prime','CEO',       'AGT-ANL-P09-R6S2T', 91, 'idle', TRUE,  'analytics',      120),
  ('b3000003-0003-0003-0003-000000000002', 'a1b2c3d4-0003-0003-0003-000000000003', 'DataSweep',    'Researcher','AGT-DSW-058-U3V7W', 76, 'idle', FALSE, 'travel_explore',  37),
  ('b3000003-0003-0003-0003-000000000003', 'a1b2c3d4-0003-0003-0003-000000000003', 'ReportBot',    'Writer',    'AGT-RPB-173-X1Y5Z', 68, 'idle', FALSE, 'summarize',       26)
ON CONFLICT (id) DO NOTHING;
