# Deployment

Local development uses Docker Compose with PostgreSQL, Redis, API, and web services.

Recommended production:

- Frontend: Vercel or CloudFront.
- API: ECS/Fargate, App Runner, or EC2.
- Database: RDS PostgreSQL.
- Redis: managed Redis.
- Monitoring: Sentry plus structured JSON logs.

Provider-specific concerns stay outside domain logic.
