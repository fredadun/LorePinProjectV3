# LorePin CMS Database Schema

## Overview

This document outlines the database schema for the LorePin Content Management System (CMS) v2.0. The CMS uses PostgreSQL with row-level security to manage administrative data while maintaining integration with the Firebase backend used by the main application.

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     cms_user    │       │     cms_role    │       │  cms_permission │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │       │ id              │
│ firebase_uid    │◄──┐   │ name            │       │ name            │
│ email           │   │   │ description     │       │ description     │
│ first_name      │   │   │ created_at      │       │ resource        │
│ last_name       │   │   │ updated_at      │       │ action          │
│ active          │   │   └────────┬────────┘       │ created_at      │
│ last_login      │   │            │                │ updated_at      │
│ created_at      │   │            │                └────────┬────────┘
│ updated_at      │   │            │                         │
└────────┬────────┘   │   ┌────────▼────────┐                │
         │            │   │ cms_user_role   │                │
         │            │   ├─────────────────┤                │
         │            └───┤ user_id         │                │
         │                │ role_id         │                │
         │                │ created_at      │                │
         │                └────────┬────────┘                │
         │                         │                         │
         │                ┌────────▼────────┐                │
         │                │ cms_role_perm   │                │
         │                ├─────────────────┤                │
         │                │ role_id         │◄───────────────┘
         │                │ permission_id   │
         │                │ created_at      │
         │                └─────────────────┘
         │
         │
┌────────▼────────┐       ┌─────────────────┐       ┌─────────────────┐
│  cms_mod_action │       │  cms_challenge  │       │   cms_region    │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │       │ id              │
│ user_id         │       │ firebase_id     │       │ name            │
│ action_type     │       │ title           │       │ code            │
│ target_type     │       │ status          │       │ parent_id       │
│ target_id       │       │ sponsor_id      │       │ active          │
│ reason          │       │ region_id       │◄──────┤ created_at      │
│ notes           │       │ created_at      │       │ updated_at      │
│ created_at      │       │ updated_at      │       └─────────────────┘
└─────────────────┘       └─────────────────┘
         ▲                         ▲
         │                         │
┌────────┴────────┐       ┌───────┴─────────┐       ┌─────────────────┐
│ cms_submission  │       │   cms_policy    │       │    cms_audit    │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │       │ id              │
│ firebase_id     │       │ name            │       │ user_id         │
│ challenge_id    │◄──────┤ description     │       │ action          │
│ user_id         │       │ region_id       │◄──────┤ resource_type   │
│ status          │       │ rules           │       │ resource_id     │
│ media_url       │       │ active          │       │ details         │
│ flags           │       │ created_at      │       │ ip_address      │
│ mod_score       │       │ updated_at      │       │ user_agent      │
│ mod_reason      │       └─────────────────┘       │ created_at      │
│ created_at      │                                 └─────────────────┘
│ updated_at      │
└─────────────────┘
```

## Table Definitions

### User Management

#### `cms_user`
Stores CMS user information linked to Firebase users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| firebase_uid | VARCHAR(128) | Firebase user ID (for authentication) |
| email | VARCHAR(255) | User email address |
| first_name | VARCHAR(100) | User first name |
| last_name | VARCHAR(100) | User last name |
| active | BOOLEAN | Whether user account is active |
| last_login | TIMESTAMP | Last login timestamp |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Record update timestamp |

#### `cms_role`
Defines roles available in the CMS.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(50) | Role name (e.g., "Super Admin", "Moderator") |
| description | TEXT | Role description |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Record update timestamp |

#### `cms_permission`
Defines granular permissions for CMS actions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(100) | Permission name |
| description | TEXT | Permission description |
| resource | VARCHAR(50) | Resource type (e.g., "challenge", "submission") |
| action | VARCHAR(50) | Action type (e.g., "create", "read", "update", "delete") |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Record update timestamp |

#### `cms_user_role`
Maps users to roles (many-to-many).

| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | Foreign key to cms_user |
| role_id | UUID | Foreign key to cms_role |
| created_at | TIMESTAMP | Record creation timestamp |

#### `cms_role_perm`
Maps roles to permissions (many-to-many).

| Column | Type | Description |
|--------|------|-------------|
| role_id | UUID | Foreign key to cms_role |
| permission_id | UUID | Foreign key to cms_permission |
| created_at | TIMESTAMP | Record creation timestamp |

### Content Management

#### `cms_region`
Defines geographical regions for policy enforcement.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(100) | Region name (e.g., "European Union", "Middle East") |
| code | VARCHAR(20) | Region code (e.g., "EU", "ME") |
| parent_id | UUID | Self-reference for hierarchical regions |
| active | BOOLEAN | Whether region is active |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Record update timestamp |

#### `cms_policy`
Defines content policies, potentially region-specific.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(100) | Policy name |
| description | TEXT | Policy description |
| region_id | UUID | Foreign key to cms_region (NULL for global) |
| rules | JSONB | Policy rules in JSON format |
| active | BOOLEAN | Whether policy is active |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Record update timestamp |

#### `cms_challenge`
Mirrors challenge data from Firebase for admin operations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| firebase_id | VARCHAR(128) | Firebase document ID |
| title | VARCHAR(255) | Challenge title |
| status | VARCHAR(50) | Challenge status |
| sponsor_id | VARCHAR(128) | Sponsor Firebase ID |
| region_id | UUID | Foreign key to cms_region |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Record update timestamp |

#### `cms_submission`
Mirrors submission data from Firebase for moderation.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| firebase_id | VARCHAR(128) | Firebase document ID |
| challenge_id | UUID | Foreign key to cms_challenge |
| user_id | VARCHAR(128) | User Firebase ID |
| status | VARCHAR(50) | Submission status |
| media_url | TEXT | URL to submission media |
| flags | INTEGER | Number of user flags/reports |
| mod_score | DECIMAL(5,2) | AI moderation confidence score |
| mod_reason | TEXT | Moderation reason if rejected |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Record update timestamp |

### Audit and Logging

#### `cms_mod_action`
Records all moderation actions taken.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to cms_user |
| action_type | VARCHAR(50) | Action type (e.g., "approve", "reject") |
| target_type | VARCHAR(50) | Target type (e.g., "submission", "challenge") |
| target_id | UUID | Target ID |
| reason | TEXT | Action reason |
| notes | TEXT | Internal notes |
| created_at | TIMESTAMP | Record creation timestamp |

#### `cms_audit`
Comprehensive audit log for all CMS actions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to cms_user |
| action | VARCHAR(50) | Action performed |
| resource_type | VARCHAR(50) | Resource type |
| resource_id | UUID | Resource ID |
| details | JSONB | Action details in JSON format |
| ip_address | VARCHAR(45) | User IP address |
| user_agent | TEXT | User agent string |
| created_at | TIMESTAMP | Record creation timestamp |

## Indexes

### Primary Indexes
- Primary key on `id` for all tables

### Foreign Key Indexes
- `cms_user_role`: Indexes on `user_id` and `role_id`
- `cms_role_perm`: Indexes on `role_id` and `permission_id`
- `cms_challenge`: Index on `region_id`
- `cms_submission`: Index on `challenge_id`
- `cms_policy`: Index on `region_id`
- `cms_mod_action`: Index on `user_id`
- `cms_audit`: Index on `user_id`

### Performance Indexes
- `cms_user`: Index on `firebase_uid`
- `cms_challenge`: Index on `firebase_id`
- `cms_submission`: Indexes on `firebase_id` and `status`
- `cms_audit`: Index on `created_at`
- `cms_mod_action`: Composite index on `target_type` and `target_id`

## Row-Level Security Policies

PostgreSQL's Row-Level Security (RLS) is used to enforce access control at the database level:

### Example RLS Policies

#### For `cms_submission`:
```sql
-- Allow moderators to see only submissions in their assigned regions
CREATE POLICY region_based_submission_access ON cms_submission
    USING (
        challenge_id IN (
            SELECT c.id FROM cms_challenge c
            JOIN cms_user_region ur ON c.region_id = ur.region_id
            WHERE ur.user_id = current_setting('app.current_user_id')::uuid
        )
    );

-- Super admins can see all submissions
CREATE POLICY super_admin_submission_access ON cms_submission
    USING (
        EXISTS (
            SELECT 1 FROM cms_user_role ur
            JOIN cms_role r ON ur.role_id = r.id
            WHERE ur.user_id = current_setting('app.current_user_id')::uuid
            AND r.name = 'Super Admin'
        )
    );
```

## Data Synchronization

The CMS database synchronizes with Firebase using the following mechanisms:

1. **Real-time Listeners**: For critical data that needs immediate reflection
2. **Scheduled Jobs**: For bulk synchronization of less time-sensitive data
3. **Event-driven Updates**: Using Firebase Cloud Functions to trigger updates

### Synchronization Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Firebase   │     │Cloud Function│     │PostgreSQL CMS│
│  Database   │────►│  Triggers   │────►│  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                                       │
       │                                       │
       │            ┌─────────────┐            │
       └────────────┤   CMS API   │◄───────────┘
                    └─────────────┘
```

## Migration Strategy

Initial data migration from Firebase to the CMS database will follow these steps:

1. **Schema Creation**: Set up PostgreSQL schema with all tables and indexes
2. **Initial Import**: Bulk import of existing Firebase data
3. **Validation**: Verify data integrity and completeness
4. **Sync Enablement**: Enable ongoing synchronization mechanisms

## Related Documentation
- [CMS Specifications](./specifications.md)
- [Implementation Plan](./implementation-plan.md)
- [AI Moderation System](./ai-moderation.md)
- [Technical Architecture](../../02-architecture/technical-architecture.md)