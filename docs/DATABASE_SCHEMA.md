# Database Schema

Normalized production tables:

- admins, roles, permissions, admin_roles
- doctors, specialties, doctor_specialties
- facilities, doctor_facilities
- services, facility_services
- schedules, availability_overrides, visiting_sessions
- schemes, lab_tests, procedures, knowledge_articles
- health_alerts, public_health_metrics
- subscriptions, incorrect_info_reports
- verification_requests, verification_history
- audit_logs
- sources

All healthcare records include verification status, source, last verified timestamp, reviewer/verifier where relevant, freshness, and next review due date.
