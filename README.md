# NoirBite — Hotel Management & Online Food Ordering

**Tagline:** Luxury Dining. Smarter Ordering.

A GitHub-ready starter project using React + JavaScript, Java Spring Boot, Spring Data JPA, Maven, and MySQL. It includes a responsive dark/gold customer interface, menu search/filtering, persistent cart, server-side price validation and bill calculation, order persistence, basic admin food/order APIs, SQL seed data, tests, and GitHub Actions.

> **Scope note:** This is a runnable foundation. Admin and write endpoints are protected by an `X-Admin-Key` header (set `ADMIN_API_KEY`; if unset they are disabled). Customer-facing order lookup by ID/phone is not authenticated, so add proper customer auth before storing sensitive data at scale.

## Deploy with Docker (recommended)

```bash
cp .env.example .env      # edit DB_PASSWORD and ADMIN_API_KEY
docker compose up -d --build
```

The site is served at `http://localhost` (or your server's address). nginx serves the React app and proxies `/api` to the Spring Boot backend; MySQL is initialised with `database/schema.sql` and `sample-data.sql` on first start. Set `FRONTEND_ORIGIN` to your public URL (comma-separate multiple origins). Put HTTPS in front (Caddy, Cloudflare, or your host's load balancer).

Staff order desk: open `/admin` and enter your `ADMIN_API_KEY`.

## Local development prerequisites

- JDK 17+
- Maven 3.9+
- Node.js 20+ and npm (frontend toolchain only)
- MySQL 8+
- Git

## 1. Create the database

Log in to MySQL and run:

```sql
SOURCE /absolute/path/to/noirbite-hotel-management/database/schema.sql;
SOURCE /absolute/path/to/noirbite-hotel-management/database/sample-data.sql;
```

Or execute each file from your MySQL client. The schema creates `noirbite_db`.

## 2. Configure and run the backend

Set environment variables in your terminal (example values are local-development placeholders):

**macOS/Linux**
```bash
export DB_URL='jdbc:mysql://localhost:3306/noirbite_db'
export DB_USERNAME='root'
export DB_PASSWORD='change-me'
export TAX_RATE='0.05'
export ADMIN_API_KEY='dev-key'
cd backend
mvn spring-boot:run
```

**Windows PowerShell**
```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/noirbite_db"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="change-me"
$env:TAX_RATE="0.05"
$env:ADMIN_API_KEY="dev-key"
cd backend
mvn spring-boot:run
```

The API runs at `http://localhost:8080`. Never commit actual passwords to GitHub. Copy `backend/.env.example` for reference; Spring reads environment variables from the process environment.

## 3. Run the frontend

Open a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

On Windows, create `.env` manually if `cp` is unavailable. The Vite dev server prints the local URL, usually `http://localhost:5173`.

## 4. Main API endpoints

- `GET /api/health`
- `GET /api/categories`
- `GET /api/foods`
- `GET /api/foods/{id}`
- `POST /api/orders`
- `GET /api/orders/{id}`
- `GET /api/orders/my-orders?phone=...` (development convenience; protect this before deployment)
- `GET /api/admin/orders`
- `POST /api/foods`
- `PUT /api/foods/{id}`
- `DELETE /api/foods/{id}`
- `PATCH /api/orders/{id}/status`

Example order body:

```json
{
  "customerName": "Demo Customer",
  "phone": "9876543210",
  "orderType": "TAKEAWAY",
  "tableNumber": null,
  "instructions": "Less spicy",
  "items": [
    { "foodId": 2, "quantity": 2 },
    { "foodId": 1, "quantity": 3 }
  ]
}
```

The frontend does not send trusted prices or totals. The backend fetches current prices from MySQL, validates availability/quantities, computes subtotal and tax using `TAX_RATE`, and persists the order transactionally.

## 5. Test

Backend:
```bash
cd backend
mvn test
```

Frontend:
```bash
cd frontend
npm test
```

## 6. GitHub upload

```bash
git init
git add .
git commit -m "Initial NoirBite hotel management system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/noirbite-hotel-management.git
git push -u origin main
```

Review `.gitignore` and confirm no `.env` files or real secrets are staged before pushing.

## 7. Troubleshooting

- **Access denied:** verify MySQL is running and `DB_USERNAME` / `DB_PASSWORD` are correct.
- **Unknown database:** run `database/schema.sql`.
- **CORS error:** frontend dev URL is allowed by backend configuration; adjust `app.cors.allowed-origin` for your setup.
- **No menu items:** run `database/sample-data.sql`.
- **Port occupied:** change `server.port` in `backend/src/main/resources/application.properties` or stop the process using port 8080.
- **Maven dependency issue:** verify JDK 17+ and internet access for Maven's first dependency download.

## Architecture

- `frontend/`: React/Vite UI, API helper, cart state persisted in local storage.
- `backend/`: Spring Boot REST API, JPA entities/repositories, transactional order service.
- `database/`: schema and seed data.
- `.github/workflows/ci.yml`: frontend and backend build/test checks.

## Security notes

Done: admin/write endpoints require `X-Admin-Key`, prices/totals are computed server-side, secrets come from environment variables. Still recommended before heavy production use: HTTPS, rate limiting, per-customer authentication for order history, and replacing the shared admin key with real staff accounts (Spring Security).
