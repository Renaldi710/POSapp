## Phase 0: Project Setup & Environment

**Branch:** `feat/00-project-setup`
**Owner:** Renaldi

### Tasks
- [x] Initialize FastAPI project structure (`app/main.py`, `app/routers/`, `app/models/`, `app/schemas/`)
- [x] Create `requirements.txt` (fastapi, uvicorn, sqlalchemy[asyncio], asyncpg, aiosqlite, pydantic-settings)
- [x] Setup `pydantic-settings` config that auto-detects `APP_ENV` (development → SQLite, production → Neon)
- [x] Setup `.env.example` and `.env.local` (SQLite, `DEBUG=True`)
- [x] Configure `vercel.json` for serverless Python deployment

### Deliverables
- ✅ Project boots locally on SQLite with zero external dependencies
- ✅ `/docs` (Swagger) accessible and auto-generated
- ✅ Config cleanly switches between local and production via `APP_ENV`

### PR Checklist
- [x] `.env.example` documents every required key (no real secrets)
- [x] `.gitignore` excludes `.env*`, `__pycache__`, local `.db` files
- [x] `requirements.txt` pinned to compatible versions
- [x] App starts with `uvicorn app.main:app --reload` without errors

---

## Phase 1: Database & Models

**Branch:** `feat/01-database-models`
**Owner:** Renaldi

### Tasks
- [x] Design schema: `products`, `categories`, `transactions`, `transaction_items`, `users`
- [x] Build SQLAlchemy 2.0 async models with proper relationships
- [x] Add `price_at_moment` column to `transaction_items` (historical pricing)
- [x] Wire `Base.metadata.create_all` on startup for local/dev table creation (no Alembic yet)
- [x] Add indexes on `products.sku` and `transactions.created_at`

### Deliverables
- ✅ All models defined with async-compatible relationships (`selectinload` ready)
- ✅ Tables auto-create on startup in both SQLite and Neon
- ✅ `transaction_items.price_at_moment` confirmed present and populated correctly

### PR Checklist
- [x] No lazy/sync relationship loading left un-guarded (must use `selectinload` where needed)
- [x] Foreign keys defined with explicit `ondelete` behavior
- [x] Schema tested against both SQLite (local) and Neon (prod) connection
- [x] No raw SQL strings used anywhere in model/query code

---

## Phase 2: Products API

**Branch:** `feat/02-products-api`
**Owner:** Renaldi

### Tasks
- [x] Build CRUD routes for products (index, create, update, delete) directly in route handlers
- [x] Define Pydantic V2 schemas for request/response validation
- [x] Implement search by SKU/name and category filtering
- [x] Add stock validation (reject negative stock on update)
- [x] Write async tests covering CRUD + validation failure paths

### Deliverables
- ✅ Products API fully functional, documented via `/docs`
- ✅ Validation errors return clear Pydantic-driven 422 responses
- ✅ Stock can never go negative through the API

### PR Checklist
- [x] All DB calls are async (`await session.execute(...)`), no sync/blocking calls
- [x] No `services/` or `repository/` layer introduced (logic stays in route handlers)
- [x] Validation lives in Pydantic schemas, not manual if-checks in handlers
- [x] Tests cover at least one failure-path per endpoint

---

## Phase 3: Transactions API

**Branch:** `feat/03-transactions-api`
**Owner:** Renaldi

### Tasks
- [x] Build checkout endpoint: create transaction + transaction_items in one request
- [x] Wrap stock deduction + transaction creation inside `async with db.begin():`
- [x] Snapshot `price_at_moment` from current product price at time of sale
- [x] Guard: validate `stock >= qty` before committing deduction; rollback on failure
- [x] Build paginated transaction history endpoint (filter by date/cashier)

### Deliverables
- ✅ Checkout is atomic — partial failures roll back completely, no orphaned stock changes
- ✅ Historical transactions retain original sale price regardless of later price changes
- ✅ Transaction history paginated and filterable

### PR Checklist
- [x] Entire checkout flow runs inside a single `async with db.begin():` block
- [x] Stock guard tested with insufficient-stock scenario (expects rollback, no partial write)
- [x] `price_at_moment` verified independent from current product price
- [x] No `httpx`/sync calls blocking the event loop during checkout

---

## Phase 4: Deployment & Production

**Branch:** `feat/04-deployment-production`
**Owner:** Renaldi

### Tasks
- [x] Configure Vercel Env Vars for production (Neon connection string, `APP_ENV=production`, `DEBUG=False`)
- [x] Verify Neon Postgres (Singapore region) connects via `asyncpg` in production
- [x] Confirm auto-deploy triggers correctly from GitHub → Vercel on merge to `main`
- [x] Add basic health check endpoint (`/health`) for uptime verification
- [x] Document cold-start behavior and expected latency on serverless/free tier

### Deliverables
- ✅ Production deploy live on Vercel, connected to Neon
- ✅ `/health` returns 200 consistently post-deploy
- ✅ Cold-start latency documented as known limitation (not treated as a bug)

### PR Checklist
- [x] No secrets committed; all prod config via Vercel Env Vars
- [x] `DEBUG=False` confirmed in production config
- [x] Health check endpoint verified live after deploy
- [x] Rollback path (revert to previous Vercel deployment) tested once