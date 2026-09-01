# Decisions

- Use clearly fictional demo records in Git. Real local data must be imported privately after verification.
- Use latitude/longitude initially instead of PostGIS because MVP distance and map links do not require advanced geo queries.
- Keep Ask Arogya LLM provider disabled by default; deterministic safety and local fact retrieval remain functional.
- Expose all admin route destinations, but only controls backed by implemented API actions are shown.
