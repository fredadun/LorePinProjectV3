# LorePin Content Management System (CMS)

This directory contains comprehensive documentation for the LorePin Content Management System (CMS) v2.0, which provides advanced tools for content moderation, user management, challenge administration, and analytics.

## Overview

The LorePin CMS is a sophisticated backend system designed to support the operational needs of the platform. It focuses on scalability, ethics, and efficiency, providing administrators and moderators with the tools they need to manage content, users, and challenges effectively.

## Key Features

### User & Role Management
- **Granular Roles**: Super Admin, Content Admin, Moderator, Regional Moderator
- **Bulk User Actions**: Ban, warn, role assignment
- **Device Attestation**: TPM-based login for high-risk actions

### Advanced Content Moderation
- **AI-Driven Workflows**: NLP analysis, contextual risk scoring
- **Batch Actions**: Apply decisions to multiple submissions
- **Preset Reasons**: Templates for common moderation decisions
- **Notes & Tagging**: Internal annotations for user tracking

### Challenge Management
- **Dynamic Approval Workflows**: Rules engine for automatic approvals/rejections
- **Regional Policies**: Custom guidelines per country
- **Real-Time Edits**: Adjust rewards, deadlines, or locations mid-challenge

### Analytics & Reporting
- **Dashboards**: Sentiment analysis, predictive analytics
- **Custom Reports**: Filter by demographics, challenge type, or region

### Audit & Compliance
- **Transparency Portal**: Public logs of anonymized moderation decisions
- **GDPR/CCPA Tools**: One-click user anonymization and data export

### Mobile Access
- **Progressive Web App**: Review content on the go
- **Push Notifications**: Alerts for high-priority items
- **Offline Capabilities**: Review cached content without connectivity

## Technical Architecture

The CMS uses a modern tech stack:

- **Frontend**: React Admin + Retool for admin interfaces, Mobile PWA for moderators
- **Backend**: NestJS (Node.js) + PostgreSQL for RBAC and audit logs
- **AI/ML**: Google Vision API, OpenAI Moderation API, AWS Rekognition
- **Infrastructure**: Redis caching, Cloudflare CDN, AWS S3 backups

## Implementation Approach

The CMS will be implemented in three phases:

1. **Phase 1 (0-3 Months)**: Core architecture, RBAC, basic moderation queues, initial AI integration
2. **Phase 2 (3-6 Months)**: Predictive analytics, mobile PWA, public API, enhanced AI capabilities
3. **Phase 3 (6-12 Months)**: Transparency portal, ethical AI training, advanced compliance tools

## Documentation Index

- [CMS Specifications](./specifications.md): Comprehensive specifications for all CMS features
- [Implementation Plan](./implementation-plan.md): Detailed phased implementation approach
- [Database Schema](./database-schema.md): PostgreSQL schema design with Row-Level Security
- [AI Moderation System](./ai-moderation.md): Technical design for the AI-driven content moderation system
- [User Interface](./user-interface.md): UI mockups and design specifications
- [API Documentation](./api-documentation.md): API endpoints and integration points

## Integration with LorePin Platform

The CMS integrates with the existing LorePin platform through:

- **Authentication Integration**: Shared authentication provider with Firebase
- **Data Integration**: Access to Firestore data with proper validation
- **Content Integration**: Access to user-generated content in Firebase Storage
- **API Integration**: RESTful API endpoints for cross-platform communication

## Related GitHub Issues

- #66 [S6-EPIC] LorePin CMS Implementation (v2.0)
- #67 [S6-US1] As an admin, I can manage users with granular role-based access control
- #68 [S6-US2] As a moderator, I can use AI-driven workflows to efficiently review content
- #69 [S6-US3] As a content admin, I can manage challenges with dynamic approval workflows
- #70 [S6-US4] As an admin, I can access advanced analytics and reporting dashboards
- #71 [S6-US5] As an admin, I can ensure compliance with data protection regulations
- #72 [S6-US6] As a moderator, I can use a mobile PWA to review content on the go