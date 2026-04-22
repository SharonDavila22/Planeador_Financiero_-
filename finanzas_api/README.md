# Finanzas API — Django REST Framework

Personal finance REST API backed by PostgreSQL, containerised with Docker.

---

## Project Structure

```
finanzas_api/
├── finanzas/           # Django project (settings, urls, wsgi)
├── accounts/           # Auth: register, login, profile
├── categories/         # Income / expense categories
├── transactions/       # Financial transactions + summary
├── budgets/            # Monthly budgets per category
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

---

## Quick Start

```bash
# 1. Clone / place files
cd finanzas_api

# 2. Start services (db + api)
docker compose up --build

# 3. The API is now live at http://localhost:8000
```

The `api` service automatically runs `migrate` on startup.

---

## Authentication

Token-based (`Authorization: Token <token>`).

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register/` | Create account → returns token |
| POST | `/api/v1/auth/login/` | Login → returns token |
| POST | `/api/v1/auth/logout/` | Invalidate token |
| GET/PATCH | `/api/v1/auth/profile/` | View / update profile |
| POST | `/api/v1/auth/change-password/` | Change password |

**Register example:**
```json
POST /api/v1/auth/register/
{
  "username": "maria",
  "email": "maria@example.com",
  "password": "securepass123",
  "currency": "MXN",
  "monthly_income": "25000.00"
}
```

---

## Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/categories/` | List all categories |
| POST | `/api/v1/categories/` | Create category |
| GET/PATCH/DELETE | `/api/v1/categories/{id}/` | Detail / edit / delete |

**Filter:** `?type=income` or `?type=expense`

**Create example:**
```json
POST /api/v1/categories/
{
  "name": "Groceries",
  "type": "expense",
  "icon": "🛒",
  "color": "#f59e0b"
}
```

---

## Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/transactions/` | List transactions (paginated) |
| POST | `/api/v1/transactions/` | Create transaction |
| GET/PATCH/DELETE | `/api/v1/transactions/{id}/` | Detail / edit / delete |
| GET | `/api/v1/transactions/summary/` | Totals & per-category breakdown |

**Filters:** `type`, `category`, `date_from`, `date_to`, `min_amount`, `max_amount`  
**Search:** `?search=coffee` (description / notes)  
**Ordering:** `?ordering=-date` or `?ordering=amount`

**Create example:**
```json
POST /api/v1/transactions/
{
  "type": "expense",
  "amount": "350.00",
  "description": "Weekly groceries",
  "date": "2026-04-21",
  "category": 3
}
```

**Summary response:**
```json
{
  "total_income": "25000.00",
  "total_expenses": "9450.50",
  "balance": "15549.50",
  "by_category": [
    {"category__name": "Groceries", "type": "expense", "total": "3200.00", ...}
  ]
}
```

---

## Budgets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/budgets/` | List budgets |
| POST | `/api/v1/budgets/` | Create budget |
| GET/PATCH/DELETE | `/api/v1/budgets/{id}/` | Detail / edit / delete |
| GET | `/api/v1/budgets/status/` | Progress for a month |

**Status example:** `GET /api/v1/budgets/status/?month=4&year=2026`

```json
[
  {
    "id": 1,
    "category": 3,
    "limit_amount": "4000.00",
    "month": 4,
    "year": 2026,
    "spent": "3200.00",
    "remaining": "800.00",
    "percent_used": 80.0
  }
]
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | insecure default | Django secret key |
| `DEBUG` | `True` | Debug mode |
| `DB_HOST` | `db` | Postgres host |
| `POSTGRES_DB` | `finanzas_db` | Database name |
| `POSTGRES_USER` | `finanzas_user` | DB user |
| `POSTGRES_PASSWORD` | `finanzas_pass` | DB password |
| `ALLOWED_HOSTS` | `localhost 127.0.0.1` | Space-separated hosts |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | Space-separated origins |
