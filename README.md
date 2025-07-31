# Homensure
---

## Prerequisites

- **Node.js** v18 or newer  
- **npm** (bundled with Node.js)

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/<your-org>/homensure.git
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Prisma and environment

1. Create a `.env` file in the root directory with your Supabase PostgreSQL connection details:

```
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<db>"
DIRECT_URL="${DATABASE_URL}"
AUTH_SECRET="your-random-hex-secret"
```

2. Generate the Prisma client:
```bash
npx prisma generate
```

3. Push the schema to your Supabase DB:
```bash
npx prisma db push
```

---

## Running Locally

Start the Next.js dev server with Turbopack:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---
