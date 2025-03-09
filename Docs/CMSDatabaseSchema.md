# LorePin CMS Database Schema Design

## Overview

This document outlines the database schema design for the LorePin Content Management System (CMS) v2.0. The CMS will use PostgreSQL as its primary database, leveraging its advanced features such as JSONB for flexible data storage, Row-Level Security (RLS) for fine-grained access control, and robust indexing capabilities for performance optimization.

## Database Design Principles

The database design follows these key principles:

1. **Normalization**: Tables are properly normalized to reduce redundancy while maintaining practical considerations for query performance.

2. **Security**: Row-Level Security policies are implemented to enforce access control at the database level.

3. **Auditability**: All tables include audit fields to track creation, modification, and deletion of records.

4. **Performance**: Appropriate indexes are defined to optimize query performance for common access patterns.

5. **Flexibility**: JSONB columns are used where schema flexibility is required, with proper indexing for efficient queries.

6. **Integrity**: Foreign key constraints and check constraints are used to maintain data integrity.

## Schema Overview

The CMS database schema consists of the following main components:

1. **User Management**: Tables for users, roles, permissions, and audit logs.
2. **Content Moderation**: Tables for moderation queues, decisions, and appeals.
3. **Challenge Management**: Tables for challenge approval workflows and regional policies.
4. **Analytics**: Tables for storing aggregated data and metrics.
5. **Compliance**: Tables for tracking consent, data requests, and legal holds.

## Table Definitions

### User Management

#### `cms_users`

Stores information about CMS users (admins, moderators, etc.).

```sql
CREATE TABLE cms_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    last_login TIMESTAMPTZ,
    device_info JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES cms_users(id),
    updated_by UUID REFERENCES cms_users(id)
);

CREATE INDEX idx_cms_users_firebase_uid ON cms_users(firebase_uid);
CREATE INDEX idx_cms_users_email ON cms_users(email);
CREATE INDEX idx_cms_users_status ON cms_users(status);
```

#### `cms_roles`

Defines the available roles in the CMS.

```sql
CREATE TABLE cms_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES cms_users(id),
    updated_by UUID REFERENCES cms_users(id)
);

-- Insert default roles
INSERT INTO cms_roles (name, description, is_system) VALUES
('super_admin', 'Full system access, audit logs, disaster recovery', TRUE),
('content_admin', 'Manages challenges, sponsors, and featured content', TRUE),
('moderator', 'Reviews reported content, handles appeals', TRUE),
('regional_moderator', 'Manages location-specific policies', TRUE);
```

#### `cms_permissions`

Defines granular permissions that can be assigned to roles.

```sql
CREATE TABLE cms_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES cms_users(id),
    updated_by UUID REFERENCES cms_users(id),
    UNIQUE(resource, action)
);

CREATE INDEX idx_cms_permissions_resource_action ON cms_permissions(resource, action);
```

#### `cms_role_permissions`

Maps permissions to roles.

```sql
CREATE TABLE cms_role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES cms_roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES cms_permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES cms_users(id),
    UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_cms_role_permissions_role_id ON cms_role_permissions(role_id);
CREATE INDEX idx_cms_role_permissions_permission_id ON cms_role_permissions(permission_id);
```

#### `cms_user_roles`

Maps roles to users.

```sql
CREATE TABLE cms_user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES cms_users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES cms_roles(id) ON DELETE CASCADE,
    region_code VARCHAR(10),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES cms_users(id),
    updated_by UUID REFERENCES cms_users(id),
    UNIQUE(user_id, role_id, COALESCE(region_code, ''))
);

CREATE INDEX idx_cms_user_roles_user_id ON cms_user_roles(user_id);
CREATE INDEX idx_cms_user_roles_role_id ON cms_user_roles(role_id);
CREATE INDEX idx_cms_user_roles_region_code ON cms_user_roles(region_code);
```

#### `cms_audit_logs`

Tracks all actions performed in the CMS.

```sql
CREATE TABLE cms_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES cms_users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    previous_state JSONB,
    new_state JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_audit_logs_user_id ON cms_audit_logs(user_id);
CREATE INDEX idx_cms_audit_logs_action ON cms_audit_logs(action);
CREATE INDEX idx_cms_audit_logs_resource_type_id ON cms_audit_logs(resource_type, resource_id);
CREATE INDEX idx_cms_audit_logs_created_at ON cms_audit_logs(created_at);
```

### Content Moderation

#### `cms_moderation_queues`

Defines different moderation queues for organizing content review.

```sql
CREATE TABLE cms_moderation_queues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    priority INTEGER NOT NULL DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES cms_users(id),
    updated_by UUID REFERENCES cms_users(id)
);

-- Insert default queues
INSERT INTO cms_moderation_queues (name, description, priority) VALUES
('high_risk', 'Content with high risk score requiring immediate review', 100),
('reported', 'Content reported by users', 80),
('new_submissions', 'New content submissions', 50),
('ai_flagged', 'Content flagged by AI for potential violations', 70);
```

#### `cms_moderation_items`

Stores items that need moderation.

```sql
CREATE TABLE cms_moderation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_id UUID NOT NULL REFERENCES cms_moderation_queues(id),
    content_type VARCHAR(100) NOT NULL,
    content_id VARCHAR(100) NOT NULL,
    firebase_path TEXT NOT NULL,
    content_data JSONB NOT NULL,
    risk_score DECIMAL(5,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    assigned_to UUID REFERENCES cms_users(id),
    submission_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    decision_time TIMESTAMPTZ,
    decision VARCHAR(50),
    decision_reason TEXT,
    decision_by UUID REFERENCES cms_users(id),
    notes TEXT,
    tags JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_moderation_items_queue_id ON cms_moderation_items(queue_id);
CREATE INDEX idx_cms_moderation_items_content_type_id ON cms_moderation_items(content_type, content_id);
CREATE INDEX idx_cms_moderation_items_status ON cms_moderation_items(status);
CREATE INDEX idx_cms_moderation_items_risk_score ON cms_moderation_items(risk_score);
CREATE INDEX idx_cms_moderation_items_assigned_to ON cms_moderation_items(assigned_to);
CREATE INDEX idx_cms_moderation_items_submission_time ON cms_moderation_items(submission_time);
CREATE INDEX idx_cms_moderation_items_tags ON cms_moderation_items USING GIN(tags);
```

#### `cms_moderation_decisions`

Stores the history of moderation decisions.

```sql
CREATE TABLE cms_moderation_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES cms_moderation_items(id),
    decision VARCHAR(50) NOT NULL,
    reason TEXT,
    notes TEXT,
    moderator_id UUID NOT NULL REFERENCES cms_users(id),
    ai_recommendation VARCHAR(50),
    ai_confidence DECIMAL(5,2),
    processing_time INTEGER, -- Time in seconds
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_moderation_decisions_item_id ON cms_moderation_decisions(item_id);
CREATE INDEX idx_cms_moderation_decisions_moderator_id ON cms_moderation_decisions(moderator_id);
CREATE INDEX idx_cms_moderation_decisions_decision ON cms_moderation_decisions(decision);
CREATE INDEX idx_cms_moderation_decisions_created_at ON cms_moderation_decisions(created_at);
```

#### `cms_user_notes`

Stores notes about users for moderation purposes.

```sql
CREATE TABLE cms_user_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) NOT NULL,
    note TEXT NOT NULL,
    note_type VARCHAR(50) NOT NULL,
    created_by UUID NOT NULL REFERENCES cms_users(id),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES cms_users(id)
);

CREATE INDEX idx_cms_user_notes_firebase_uid ON cms_user_notes(firebase_uid);
CREATE INDEX idx_cms_user_notes_note_type ON cms_user_notes(note_type);
CREATE INDEX idx_cms_user_notes_created_by ON cms_user_notes(created_by);
```

#### `cms_user_tags`

Stores tags assigned to users for categorization.

```sql
CREATE TABLE cms_user_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) NOT NULL,
    tag VARCHAR(100) NOT NULL,
    created_by UUID NOT NULL REFERENCES cms_users(id),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(firebase_uid, tag)
);

CREATE INDEX idx_cms_user_tags_firebase_uid ON cms_user_tags(firebase_uid);
CREATE INDEX idx_cms_user_tags_tag ON cms_user_tags(tag);
```

#### `cms_appeals`

Stores user appeals against moderation decisions.

```sql
CREATE TABLE cms_appeals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES cms_moderation_decisions(id),
    firebase_uid VARCHAR(128) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    assigned_to UUID REFERENCES cms_users(id),
    resolution VARCHAR(50),
    resolution_reason TEXT,
    resolved_by UUID REFERENCES cms_users(id),
    resolution_time TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_appeals_decision_id ON cms_appeals(decision_id);
CREATE INDEX idx_cms_appeals_firebase_uid ON cms_appeals(firebase_uid);
CREATE INDEX idx_cms_appeals_status ON cms_appeals(status);
CREATE INDEX idx_cms_appeals_assigned_to ON cms_appeals(assigned_to);
CREATE INDEX idx_cms_appeals_created_at ON cms_appeals(created_at);
```

### Challenge Management

#### `cms_regional_policies`

Defines content policies for specific regions.

```sql
CREATE TABLE cms_regional_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_code VARCHAR(10) NOT NULL,
    region_name VARCHAR(100) NOT NULL,
    policy_type VARCHAR(50) NOT NULL,
    policy_data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES cms_users(id),
    updated_by UUID REFERENCES cms_users(id),
    UNIQUE(region_code, policy_type)
);

CREATE INDEX idx_cms_regional_policies_region_code ON cms_regional_policies(region_code);
CREATE INDEX idx_cms_regional_policies_policy_type ON cms_regional_policies(policy_type);
CREATE INDEX idx_cms_regional_policies_is_active ON cms_regional_policies(is_active);
```

#### `cms_approval_rules`

Defines rules for automatic challenge approval/rejection.

```sql
CREATE TABLE cms_approval_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    rule_type VARCHAR(50) NOT NULL,
    rule_data JSONB NOT NULL,
    priority INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    region_code VARCHAR(10),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES cms_users(id),
    updated_by UUID REFERENCES cms_users(id)
);

CREATE INDEX idx_cms_approval_rules_rule_type ON cms_approval_rules(rule_type);
CREATE INDEX idx_cms_approval_rules_priority ON cms_approval_rules(priority);
CREATE INDEX idx_cms_approval_rules_is_active ON cms_approval_rules(is_active);
CREATE INDEX idx_cms_approval_rules_region_code ON cms_approval_rules(region_code);
```

#### `cms_challenge_approvals`

Tracks the approval workflow for challenges.

```sql
CREATE TABLE cms_challenge_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id VARCHAR(100) NOT NULL,
    challenge_data JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    current_step VARCHAR(50) NOT NULL DEFAULT 'initial_review',
    assigned_to UUID REFERENCES cms_users(id),
    applied_rules JSONB,
    policy_violations JSONB,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES cms_users(id),
    updated_by UUID REFERENCES cms_users(id)
);

CREATE INDEX idx_cms_challenge_approvals_challenge_id ON cms_challenge_approvals(challenge_id);
CREATE INDEX idx_cms_challenge_approvals_status ON cms_challenge_approvals(status);
CREATE INDEX idx_cms_challenge_approvals_current_step ON cms_challenge_approvals(current_step);
CREATE INDEX idx_cms_challenge_approvals_assigned_to ON cms_challenge_approvals(assigned_to);
CREATE INDEX idx_cms_challenge_approvals_created_at ON cms_challenge_approvals(created_at);
```

#### `cms_approval_steps`

Defines the steps in multi-step approval workflows.

```sql
CREATE TABLE cms_approval_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_id UUID NOT NULL REFERENCES cms_challenge_approvals(id),
    step_name VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    assigned_to UUID REFERENCES cms_users(id),
    decision VARCHAR(50),
    decision_reason TEXT,
    decision_by UUID REFERENCES cms_users(id),
    decision_time TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_approval_steps_approval_id ON cms_approval_steps(approval_id);
CREATE INDEX idx_cms_approval_steps_step_name ON cms_approval_steps(step_name);
CREATE INDEX idx_cms_approval_steps_status ON cms_approval_steps(status);
CREATE INDEX idx_cms_approval_steps_assigned_to ON cms_approval_steps(assigned_to);
```

### Analytics

#### `cms_moderation_metrics`

Stores aggregated moderation metrics.

```sql
CREATE TABLE cms_moderation_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    region_code VARCHAR(10),
    value DECIMAL(10,2) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(metric_date, metric_type, content_type, COALESCE(region_code, ''))
);

CREATE INDEX idx_cms_moderation_metrics_metric_date ON cms_moderation_metrics(metric_date);
CREATE INDEX idx_cms_moderation_metrics_metric_type ON cms_moderation_metrics(metric_type);
CREATE INDEX idx_cms_moderation_metrics_content_type ON cms_moderation_metrics(content_type);
CREATE INDEX idx_cms_moderation_metrics_region_code ON cms_moderation_metrics(region_code);
```

#### `cms_moderator_performance`

Tracks performance metrics for moderators.

```sql
CREATE TABLE cms_moderator_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES cms_users(id),
    metric_date DATE NOT NULL,
    items_processed INTEGER NOT NULL DEFAULT 0,
    average_processing_time DECIMAL(10,2),
    accuracy_rate DECIMAL(5,2),
    appeal_rate DECIMAL(5,2),
    appeal_success_rate DECIMAL(5,2),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, metric_date)
);

CREATE INDEX idx_cms_moderator_performance_user_id ON cms_moderator_performance(user_id);
CREATE INDEX idx_cms_moderator_performance_metric_date ON cms_moderator_performance(metric_date);
```

#### `cms_ai_performance`

Tracks performance metrics for AI moderation.

```sql
CREATE TABLE cms_ai_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    true_positives INTEGER NOT NULL DEFAULT 0,
    false_positives INTEGER NOT NULL DEFAULT 0,
    true_negatives INTEGER NOT NULL DEFAULT 0,
    false_negatives INTEGER NOT NULL DEFAULT 0,
    precision_rate DECIMAL(5,2),
    recall_rate DECIMAL(5,2),
    f1_score DECIMAL(5,2),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(metric_date, content_type, model_version)
);

CREATE INDEX idx_cms_ai_performance_metric_date ON cms_ai_performance(metric_date);
CREATE INDEX idx_cms_ai_performance_content_type ON cms_ai_performance(content_type);
CREATE INDEX idx_cms_ai_performance_model_version ON cms_ai_performance(model_version);
```

### Compliance

#### `cms_user_consents`

Tracks user consent for data processing.

```sql
CREATE TABLE cms_user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) NOT NULL,
    consent_type VARCHAR(50) NOT NULL,
    is_granted BOOLEAN NOT NULL,
    granted_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_user_consents_firebase_uid ON cms_user_consents(firebase_uid);
CREATE INDEX idx_cms_user_consents_consent_type ON cms_user_consents(consent_type);
CREATE INDEX idx_cms_user_consents_is_granted ON cms_user_consents(is_granted);
```

#### `cms_data_requests`

Tracks data access, export, and deletion requests.

```sql
CREATE TABLE cms_data_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) NOT NULL,
    request_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    processed_by UUID REFERENCES cms_users(id),
    verification_method VARCHAR(50),
    verification_data JSONB,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_data_requests_firebase_uid ON cms_data_requests(firebase_uid);
CREATE INDEX idx_cms_data_requests_request_type ON cms_data_requests(request_type);
CREATE INDEX idx_cms_data_requests_status ON cms_data_requests(status);
CREATE INDEX idx_cms_data_requests_requested_at ON cms_data_requests(requested_at);
```

#### `cms_legal_holds`

Tracks legal holds on user data.

```sql
CREATE TABLE cms_legal_holds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) NOT NULL,
    reason TEXT NOT NULL,
    reference_number VARCHAR(100),
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    requested_by VARCHAR(255) NOT NULL,
    approved_by UUID REFERENCES cms_users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES cms_users(id),
    updated_by UUID REFERENCES cms_users(id)
);

CREATE INDEX idx_cms_legal_holds_firebase_uid ON cms_legal_holds(firebase_uid);
CREATE INDEX idx_cms_legal_holds_status ON cms_legal_holds(status);
CREATE INDEX idx_cms_legal_holds_start_date ON cms_legal_holds(start_date);
CREATE INDEX idx_cms_legal_holds_end_date ON cms_legal_holds(end_date);
```

## Row-Level Security Policies

Row-Level Security (RLS) policies are implemented to enforce access control at the database level. Here are examples of RLS policies for key tables:

### User Management RLS

```sql
-- Enable RLS on cms_users table
ALTER TABLE cms_users ENABLE ROW LEVEL SECURITY;

-- Super Admin can see all users
CREATE POLICY super_admin_all_users ON cms_users
    USING (EXISTS (
        SELECT 1 FROM cms_user_roles ur
        JOIN cms_roles r ON ur.role_id = r.id
        WHERE ur.user_id = current_setting('app.current_user_id')::UUID
        AND r.name = 'super_admin'
    ));

-- Users can see themselves
CREATE POLICY users_see_self ON cms_users
    USING (id = current_setting('app.current_user_id')::UUID);

-- Content Admins can see moderators
CREATE POLICY content_admin_see_moderators ON cms_users
    USING (EXISTS (
        SELECT 1 FROM cms_user_roles ur
        JOIN cms_roles r ON ur.role_id = r.id
        WHERE ur.user_id = current_setting('app.current_user_id')::UUID
        AND r.name = 'content_admin'
    ) AND EXISTS (
        SELECT 1 FROM cms_user_roles ur
        JOIN cms_roles r ON ur.role_id = r.id
        WHERE ur.user_id = id
        AND r.name IN ('moderator', 'regional_moderator')
    ));
```

### Content Moderation RLS

```sql
-- Enable RLS on cms_moderation_items table
ALTER TABLE cms_moderation_items ENABLE ROW LEVEL SECURITY;

-- Super Admin and Content Admin can see all items
CREATE POLICY admin_all_moderation_items ON cms_moderation_items
    USING (EXISTS (
        SELECT 1 FROM cms_user_roles ur
        JOIN cms_roles r ON ur.role_id = r.id
        WHERE ur.user_id = current_setting('app.current_user_id')::UUID
        AND r.name IN ('super_admin', 'content_admin')
    ));

-- Moderators can see items assigned to them
CREATE POLICY moderator_assigned_items ON cms_moderation_items
    USING (assigned_to = current_setting('app.current_user_id')::UUID);

-- Regional Moderators can see items in their region
CREATE POLICY regional_moderator_region_items ON cms_moderation_items
    USING (EXISTS (
        SELECT 1 FROM cms_user_roles ur
        WHERE ur.user_id = current_setting('app.current_user_id')::UUID
        AND ur.region_code = (content_data->>'region_code')
    ));
```

## Database Migrations

Database migrations will be managed using a migration tool such as Flyway or Knex.js. Each migration will be versioned and include both up and down scripts to allow for rollbacks if needed.

Example migration structure:

```
migrations/
├── V1__initial_schema.sql
├── V2__add_user_management.sql
├── V3__add_content_moderation.sql
├── V4__add_challenge_management.sql
├── V5__add_analytics.sql
├── V6__add_compliance.sql
├── V7__add_rls_policies.sql
```

## Backup and Recovery

The database will be backed up regularly to ensure data durability:

1. **Full Backups**: Daily full database backups
2. **Incremental Backups**: Hourly incremental backups
3. **Transaction Log Backups**: Continuous transaction log backups
4. **Offsite Storage**: Backups stored in AWS S3 with encryption
5. **Retention Policy**: 30 days for daily backups, 7 days for hourly backups

Recovery procedures will be documented and tested regularly to ensure they work as expected.

## Performance Considerations

To ensure optimal database performance, the following measures will be implemented:

1. **Indexing Strategy**: Appropriate indexes for common query patterns
2. **Partitioning**: Table partitioning for large tables (e.g., audit logs)
3. **Query Optimization**: Regular review and optimization of slow queries
4. **Connection Pooling**: Efficient connection management
5. **Caching**: Redis caching for frequently accessed data
6. **Monitoring**: Continuous monitoring of database performance metrics

## Security Considerations

In addition to Row-Level Security, the following security measures will be implemented:

1. **Encryption**: Data encryption at rest and in transit
2. **Access Control**: Strict access control for database users
3. **Audit Logging**: Comprehensive logging of database access and changes
4. **Vulnerability Scanning**: Regular security scans for vulnerabilities
5. **Patch Management**: Timely application of security patches

## Conclusion

This database schema design provides a solid foundation for the LorePin CMS v2.0. It balances normalization with performance considerations, implements proper security measures, and ensures auditability of all actions. The schema is designed to be flexible enough to accommodate future requirements while maintaining data integrity and performance.

The implementation will follow the phased approach outlined in the CMS Implementation Plan, with the database schema evolving as new features are added in each phase.

## Appendix

### Database Diagram

A visual representation of the database schema will be created using a tool such as dbdiagram.io or ERD tools. The diagram will show tables, relationships, and key fields to provide a clear overview of the database structure.

### Performance Benchmarks

Performance benchmarks will be established for common database operations to ensure the database meets performance requirements. These benchmarks will include:

1. Query response times for common operations
2. Transaction throughput for write-heavy operations
3. Concurrency handling for multiple simultaneous users
4. Resource utilization (CPU, memory, disk I/O)

### Related Documentation

- [CMS Specifications](CMSSpecifications.md)
- [CMS Implementation Plan](CMSImplementationPlan.md)
- [Technical Architecture](TechnicalArchitecture.md)