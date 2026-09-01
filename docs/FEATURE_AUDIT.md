# Feature Audit

| Route | Feature | UI control | Backend endpoint | Implemented? | Test? | Status |
|---|---|---|---|---|---|---|
| `/` | Search | Search input/suggestions | `GET /api/v1/search` | YES | YES | COMPLETE |
| `/` | Emergency | Global button/dialog | `GET /api/v1/emergency` | YES | YES | COMPLETE |
| `/doctors` | Filters | Specialty/open/type controls | `GET /api/v1/doctors` | YES | YES | COMPLETE |
| `/doctors/[slug]` | Profile actions | Call/navigate/report/save | doctors + reports API | YES | YES | COMPLETE |
| `/doctors/visiting` | Visiting sessions | Filter/detail/call | `GET /api/v1/visiting-sessions` | YES | YES | COMPLETE |
| `/open-now` | Availability | Status cards | `GET /api/v1/facilities/open-now` | YES | YES | COMPLETE |
| `/facilities` | Directory | Filters/detail/navigate | `GET /api/v1/facilities` | YES | YES | COMPLETE |
| `/ask-arogya` | Safe chat | Composer/chips/cards | `POST /api/v1/chat` | YES | YES | COMPLETE |
| `/report-incorrect` | User report | Validated form | `POST /api/v1/reports/incorrect-info` | YES | YES | COMPLETE |
| `/admin/*` | Admin inventory | Sidebar/pages | admin endpoints | PARTIAL | PARTIAL | IN PROGRESS |
