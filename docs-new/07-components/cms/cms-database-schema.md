# LorePin CMS Database Schema

## Overview

This document outlines the database schema design for the LorePin Content Management System (CMS) v2.0. The schema is designed for PostgreSQL with a focus on security, performance, and scalability. The design incorporates Row-Level Security (RLS) for fine-grained access control and comprehensive audit logging.

## Database Architecture

### General Principles

1. **Normalization**: The schema follows 3NF (Third Normal Form) to minimize redundancy while balancing performance needs
2. **Security**: Row-Level Security (RLS) policies are applied to all tables for fine-grained access control
3. **Audit Logging**: All changes are tracked in dedicated audit tables
4. **Performance**: Appropriate indexes are defined for common query patterns
5. **Extensibility**: JSONB columns are used for flexible, schema-less data where appropriate

### Database Engine

- **PostgreSQL 14+**: Selected for its robust features, including:
  - Row-Level Security (RLS)
  - JSONB support for flexible data
  - Full-text search capabilities
  - Transactional DDL
  - Advanced indexing options

## Schema Definitions

### Core Tables

#### `users`

Stores user information for CMS access.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Index for firebase_uid lookups
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
```

#### `roles`

Defines available roles in the system.

```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
    ('super_admin', 'Full system access, audit logs, disaster recovery'),
    ('content_admin', 'Manages challenges, sponsors, and featured content'),
    ('moderator', 'Reviews reported content, handles appeals'),
    ('regional_moderator', 'Manages location-specific policies');
```

#### `permissions`

Defines granular permissions that can be assigned to roles.

```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(resource, action)
);

-- Index for resource-action lookups
CREATE INDEX idx_permissions_resource_action ON permissions(resource, action);
```

#### `role_permissions`

Maps permissions to roles (many-to-many).

```sql
CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);
```

#### `user_roles`

Maps users to roles (many-to-many).

```sql
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, role_id)
);
```

#### `regions`

Defines geographical regions for regional policies.

```sql
CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    parent_id UUID REFERENCES regions(id),
    geofence GEOMETRY(POLYGON, 4326),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Spatial index for geofence queries
CREATE INDEX idx_regions_geofence ON regions USING GIST(geofence);
```

#### `user_regions`

Maps users (regional moderators) to regions they manage.

```sql
CREATE TABLE user_regions (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    region_id UUID NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, region_id)
);
```

### Moderation Tables

#### `moderation_queue`

Stores content pending moderation.

```sql
CREATE TABLE moderation_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(50) NOT NULL, -- 'submission', 'challenge', 'comment', etc.
    content_id VARCHAR(128) NOT NULL, -- ID in the original collection
    priority INTEGER NOT NULL DEFAULT 0,
    risk_score DECIMAL(5,2),
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'in_review', 'approved', 'rejected'
    assigned_to UUID REFERENCES users(id),
    region_id UUID REFERENCES regions(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB,
    UNIQUE(content_type, content_id)
);

-- Indexes for common query patterns
CREATE INDEX idx_moderation_queue_status ON moderation_queue(status);
CREATE INDEX idx_moderation_queue_priority ON moderation_queue(priority DESC);
CREATE INDEX idx_moderation_queue_assigned_to ON moderation_queue(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_moderation_queue_region_id ON moderation_queue(region_id) WHERE region_id IS NOT NULL;
```

#### `moderation_decisions`

Records decisions made on moderated content.

```sql
CREATE TABLE moderation_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_id UUID NOT NULL REFERENCES moderation_queue(id),
    moderator_id UUID NOT NULL REFERENCES users(id),
    decision VARCHAR(20) NOT NULL, -- 'approve', 'reject', 'escalate'
    reason VARCHAR(100),
    notes TEXT,
    decision_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ai_recommendation VARCHAR(20),
    ai_confidence DECIMAL(5,2),
    processing_time_ms INTEGER, -- Time taken to make decision
    metadata JSONB
);

-- Index for queue lookups
CREATE INDEX idx_moderation_decisions_queue_id ON moderation_decisions(queue_id);
```

#### `moderation_rules`

Defines automated moderation rules.

```sql
CREATE TABLE moderation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL, -- 'submission', 'challenge', 'comment', etc.
    condition JSONB NOT NULL, -- Rule conditions in JSON format
    action VARCHAR(50) NOT NULL, -- 'auto_approve', 'auto_reject', 'flag', 'prioritize'
    action_params JSONB,
    priority INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    region_id UUID REFERENCES regions(id), -- NULL for global rules
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for rule evaluation
CREATE INDEX idx_moderation_rules_content_type ON moderation_rules(content_type) WHERE is_active = TRUE;
CREATE INDEX idx_moderation_rules_region_id ON moderation_rules(region_id) WHERE is_active = TRUE;
```

#### `content_flags`

Stores user-reported content flags.

```sql
CREATE TABLE content_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(50) NOT NULL,
    content_id VARCHAR(128) NOT NULL,
    reporter_id VARCHAR(128) NOT NULL, -- Firebase UID of reporter
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'reviewed', 'dismissed'
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB
);

-- Indexes for content lookups
CREATE INDEX idx_content_flags_content ON content_flags(content_type, content_id);
CREATE INDEX idx_content_flags_status ON content_flags(status);
```

### Analytics Tables

#### `moderation_metrics`

Stores aggregated moderation metrics.

```sql
CREATE TABLE moderation_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    region_id UUID REFERENCES regions(id),
    total_items INTEGER NOT NULL DEFAULT 0,
    approved_items INTEGER NOT NULL DEFAULT 0,
    rejected_items INTEGER NOT NULL DEFAULT 0,
    escalated_items INTEGER NOT NULL DEFAULT 0,
    avg_processing_time_ms INTEGER,
    ai_agreement_rate DECIMAL(5,2),
    false_positive_count INTEGER NOT NULL DEFAULT 0,
    false_negative_count INTEGER NOT NULL DEFAULT 0,
    UNIQUE(metric_date, content_type, region_id)
);

-- Index for time-series queries
CREATE INDEX idx_moderation_metrics_date ON moderation_metrics(metric_date DESC);
```

#### `user_metrics`

Stores moderator performance metrics.

```sql
CREATE TABLE user_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    metric_date DATE NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    total_processed INTEGER NOT NULL DEFAULT 0,
    approved_count INTEGER NOT NULL DEFAULT 0,
    rejected_count INTEGER NOT NULL DEFAULT 0,
    escalated_count INTEGER NOT NULL DEFAULT 0,
    avg_processing_time_ms INTEGER,
    accuracy_rate DECIMAL(5,2),
    UNIQUE(user_id, metric_date, content_type)
);

-- Index for user performance queries
CREATE INDEX idx_user_metrics_user_date ON user_metrics(user_id, metric_date DESC);
```

### Audit Tables

#### `audit_logs`

Comprehensive audit logging for all system actions.

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(128),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    request_id UUID,
    changes JSONB,
    metadata JSONB
);

-- Indexes for audit queries
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
```

#### `legal_holds`

Tracks content under legal hold.

```sql
CREATE TABLE legal_holds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(50) NOT NULL,
    content_id VARCHAR(128) NOT NULL,
    reason TEXT NOT NULL,
    requested_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    reference_number VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'expired', 'released'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(content_type, content_id)
);

-- Index for legal hold status
CREATE INDEX idx_legal_holds_status ON legal_holds(status);
```

## Row-Level Security (RLS) Policies

### Users Table RLS

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Super Admins can see and modify all users
CREATE POLICY super_admin_users ON users
    USING (EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = current_user_id() AND r.name = 'super_admin'
    ));

-- Users can see and modify their own records
CREATE POLICY self_users ON users
    USING (id = current_user_id());

-- Content Admins can see all users but not modify Super Admins
CREATE POLICY content_admin_users ON users
    USING (EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = current_user_id() AND r.name = 'content_admin'
    ))
    WITH CHECK (NOT EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = id AND r.name = 'super_admin'
    ));
```

### Moderation Queue RLS

```sql
-- Enable RLS on moderation_queue table
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;

-- Super Admins and Content Admins can see all items
CREATE POLICY admin_moderation_queue ON moderation_queue
    USING (EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = current_user_id() AND r.name IN ('super_admin', 'content_admin')
    ));

-- Moderators can see items assigned to them or unassigned
CREATE POLICY moderator_moderation_queue ON moderation_queue
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = current_user_id() AND r.name = 'moderator'
        ) AND (
            assigned_to IS NULL OR assigned_to = current_user_id()
        )
    );

-- Regional Moderators can see items in their regions
CREATE POLICY regional_moderator_moderation_queue ON moderation_queue
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            JOIN user_regions ureg ON ur.user_id = ureg.user_id
            WHERE ur.user_id = current_user_id() 
            AND r.name = 'regional_moderator'
            AND ureg.region_id = moderation_queue.region_id
        )
    );
```

## Indexing Strategy

### Primary Indexes
- Primary keys on all tables (UUID)
- Foreign key indexes for all relationships

### Performance Indexes
- Status-based indexes for filtering (e.g., moderation status)
- Timestamp indexes for time-range queries
- Full-text search indexes for content searching
- Spatial indexes for geolocation queries

### Specialized Indexes
- JSONB path indexes for metadata queries
- Partial indexes for common filtered queries
- Expression indexes for computed values

## Backup and Recovery

### Backup Strategy
- Full database backup daily
- WAL (Write-Ahead Log) archiving for point-in-time recovery
- Logical backups of schema changes

### Retention Policy
- Daily backups retained for 30 days
- Weekly backups retained for 3 months
- Monthly backups retained for 1 year
- WAL archives retained for 7 days

### Recovery Procedures
- Automated recovery testing monthly
- Documented recovery procedures for different failure scenarios
- Recovery time objective (RTO): 4 hours
- Recovery point objective (RPO): 15 minutes

## Related Documentation
- [CMS Specifications](./cms-specifications.md)
- [CMS Implementation Plan](./cms-implementation-plan.md)
- [Technical Architecture](../../02-architecture/technical-architecture.md)
- [AI-Driven Content Moderation](./cms-ai-moderation.md)

## Conclusion

This database schema provides a solid foundation for the LorePin CMS v2.0, with a focus on security, performance, and scalability. The use of Row-Level Security ensures that data access is properly controlled, while comprehensive audit logging maintains a record of all system actions. The schema is designed to be extensible, allowing for future enhancements as the system evolves. 