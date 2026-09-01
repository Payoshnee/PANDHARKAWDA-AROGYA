# API Contract

All endpoints are versioned under `/api/v1`. Healthcare resources return `data` and `meta`; errors return stable codes.

Required public endpoints implemented in the API shell:

- `GET /api/v1/search`
- `GET /api/v1/doctors`
- `GET /api/v1/doctors/{id_or_slug}`
- `GET /api/v1/specialties`
- `GET /api/v1/visiting-sessions`
- `GET /api/v1/facilities`
- `GET /api/v1/facilities/{id_or_slug}`
- `GET /api/v1/facilities/open-now`
- `GET /api/v1/emergency`
- `GET /api/v1/schemes`
- `GET /api/v1/schemes/{slug}`
- `GET /api/v1/lab-tests`
- `GET /api/v1/lab-tests/{slug}`
- `GET /api/v1/procedures`
- `GET /api/v1/procedures/{slug}`
- `GET /api/v1/health-alerts`
- `POST /api/v1/chat`
- `POST /api/v1/reports/incorrect-info`

Admin endpoints require an admin session and RBAC permission checks in production configuration.
