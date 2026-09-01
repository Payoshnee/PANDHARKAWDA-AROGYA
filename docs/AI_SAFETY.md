# AI Safety

Ask Arogya is a hybrid assistant:

1. Detect language.
2. Run deterministic red-flag rules.
3. Classify intent.
4. Query local verified data or reviewed content.
5. Optionally use an LLM for explanation only.
6. Run a safety post-check.
7. Return structured cards, actions, sources, and verification metadata.

The LLM is never the source of local facts. If a fact is missing, the assistant says it does not have verified information and provides a safer next action.
