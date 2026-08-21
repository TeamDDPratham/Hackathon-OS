---
name: database
description: Design normalized, performant database schemas, indexes, migrations, query repositories, and deterministic seed datasets.
---

# Database Engineering Skill

## Purpose
This skill ensures persistent data is modeled cleanly, queries are optimized and indexed, and reliable seed data is available for instant demonstration.

## Database Guidelines
1. **Schema Design & Normalization**:
   - Model entities with clear primary keys, foreign key constraints, and appropriate data types.
   - Enforce consistency at the database level rather than solely relying on application logic.
2. **Indexing & Query Performance**:
   - Add indexes to all columns involved in `WHERE`, `JOIN`, and `ORDER BY` operations.
   - Avoid `N+1` query antipatterns by using eager loading / joins in repository methods.
3. **Migration Management**:
   - Use declarative migration tools (e.g., Prisma, Alembic, Drizzle).
   - Ensure migrations are repeatable, reversible, and version-controlled.
4. **Deterministic Seed Data**:
   - Maintain a comprehensive `seeds/` script that populates realistic demo accounts, entities, and historical activity with a single command.
   - The demo must never start on an empty, broken-looking screen.
