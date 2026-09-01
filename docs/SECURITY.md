# Security

- Admin authentication uses hashed passwords, short-lived secure sessions, logout, login rate limiting, lockout/backoff, and RBAC.
- Public users do not need accounts.
- Public APIs never expose private notes, non-public doctor phone numbers, or unverified records.
- CORS is allowlisted. Input is validated with Pydantic and Zod. SQL uses ORM/parameterization.
- Significant admin actions create immutable audit logs.
- Secrets are represented only by variable names in `.env.example`.
