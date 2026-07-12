# AGENTS.md - POS Kasir UMKM (FastAPI Backend)

## Git Workflow (MANDATORY)

### Branch Strategy
- **Main Branch:** `main` (production-ready ONLY)
- **Feature Branches:** `feat/00-<name>`, `feat/01-<name>`, ... sequential per phase
- **NEVER commit directly to `main`**

### Per-Phase Flow
1. Create branch: `git checkout -b feat/00-setup`
2. Develop & test locally against SQLite
3. Push to GitHub: `git push origin feat/00-setup`
4. Create Pull Request with checklist filled in
5. Squash Merge to `main` → Vercel auto-deploys

---

## The Lazy Senior Ladder

- [ ] Step 1: Can this be solved by deleting code instead of adding it?
- [ ] Step 2: Can FastAPI/Pydantic/SQLAlchemy already do this natively instead of custom logic?
- [ ] Step 3: Can this be a config change (`.env`, `pydantic-settings`) instead of a code change?
- [ ] Step 4: If custom code is unavoidable, write the smallest correct version directly in the route handler
- [ ] Step 5: Only optimize/refactor after it works and is tested

---

## Phase-Specific Guidelines

- [ ] Phase 0-1 (Setup/DB): No Alembic — use `Base.metadata.create_all` on startup
- [ ] Phase 0-1 (Setup/DB): Config must auto-switch SQLite (local) vs Neon (prod) via `APP_ENV`
- [ ] Phase 2-3 (APIs): Validation lives in Pydantic V2 schemas, never manual checks in handlers
- [ ] Phase 2-3 (APIs): All DB access is async — no sync SQLAlchemy session anywhere
- [ ] Phase 3 (Transactions): Stock mutations MUST run inside `async with db.begin():`
- [ ] Phase 3 (Transactions): `transaction_items` MUST store `price_at_moment`, never reference live product price
- [ ] Phase 4 (Deployment): No secrets hardcoded — Vercel Env Vars only in production

---

## PR Requirements

- [ ] PR title follows `[Phase X] Short description` format
- [ ] PR description links to relevant task(s) in `plan.md`
- [ ] All checklist items in the corresponding `plan.md` phase are checked
- [ ] Async test included for new logic (minimum: one happy path + one failure path)
- [ ] No merge conflicts with `main` before requesting review

---

## Anti-Patterns (Auto-Reject)

- ❌ Supabase / Firebase or any BaaS that hides DB logic
- ❌ `services/` or `repository/` folder for logic under 50 lines — keep it in the route handler
- ❌ Sync blocking calls inside `async def` (`requests`, `time.sleep`, sync DB session)
- ❌ Raw SQL strings — use SQLAlchemy ORM/Core constructs only
- ❌ Direct commits to `main`
- ❌ Stock/balance mutations outside `async with db.begin():`
- ❌ Computing historical revenue from current product price instead of `price_at_moment`
- ❌ Alembic migrations introduced before schema complexity actually demands it
- ❌ Secrets or `.env` values committed to the repo
- ❌ Vague PR checklist items (e.g. "Test code", "Check everything")

---

## Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI app + lifespan (create_all + seed)
│   ├── config.py         # APP_ENV auto-switch SQLite/Neon
│   ├── database.py       # engine, SessionLocal, Base, get_db
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── token.py
│   │   ├── category.py
│   │   ├── product.py
│   │   └── transaction.py
│   ├── schemas/          # Pydantic V2 (Phase 2)
│   └── routers/          # Route handlers (Phase 2)
├── requirements.txt
├── .env.example
└── vercel.json
```
