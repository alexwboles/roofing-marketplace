-- ============================================================
--  ENABLE EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS citext;

-- ============================================================
--  USERS TABLE (Homeowners + Contractors)
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email CITEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('homeowner', 'contractor', 'admin')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
--  CONTRACTORS TABLE
--  (One contractor per user with role='contractor')
-- ============================================================

CREATE TABLE contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name TEXT,
    logo_url TEXT,
    service_area GEOGRAPHY(MULTIPOLYGON, 4326), -- optional
    rating NUMERIC(3,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
--  CONTRACTOR PRICING TABLE
--  (JSONB pricing rules)
-- ============================================================

CREATE TABLE contractor_pricing (
    contractor_id UUID PRIMARY KEY REFERENCES contractors(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
--  LEADS TABLE (Homeowner Intake)
-- ============================================================

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email CITEXT NOT NULL,
    phone TEXT,
    address TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
--  ROOF ANALYSIS TABLE
--  (Stores AI output + optional roof polygons)
-- ============================================================

CREATE TABLE roof_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID UNIQUE NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    data JSONB NOT NULL, -- full AI output
    roof_geom GEOMETRY(MULTIPOLYGON, 4326), -- optional roof footprint
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
--  QUOTES TABLE
-- ============================================================

CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
--  INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_address ON leads(address);

CREATE INDEX idx_roof_analysis_geom ON roof_analysis USING GIST (roof_geom);
CREATE INDEX idx_contractor_service_area ON contractors USING GIST (service_area);

CREATE INDEX idx_quotes_lead_id ON quotes(lead_id);
CREATE INDEX idx_quotes_contractor_id ON quotes(contractor_id);

-- ============================================================
--  OPTIONAL: MATERIALIZED VIEW FOR ANALYTICS
-- ============================================================

-- Example: total quotes per contractor
-- CREATE MATERIALIZED VIEW contractor_quote_stats AS
-- SELECT contractor_id, COUNT(*) AS total_quotes, AVG(amount) AS avg_bid
-- FROM quotes
-- GROUP BY contractor_id;
