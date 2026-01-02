# Military Asset Management System

This project is a minimal, backend-focused implementation of a Military Asset Management System built as part of a take-home assignment.

The system is designed to track assets across multiple bases, record purchases and movements, enforce role-based access control (RBAC), and maintain an auditable history of all transactions.

The focus of this implementation is correctness, clarity, and explainability rather than feature completeness or UI polish.

---

## Core Features

- Asset inventory tracking per base
- Purchase recording with inventory updates
- Immutable transaction logging for auditability
- Role-Based Access Control (RBAC)
- JWT-based authentication
- Hosted PostgreSQL database using Supabase

---

## Tech Stack

### Backend

- Node.js
- Express.js
- PostgreSQL (Supabase)
- JWT for authentication
- bcrypt for password hashing

### Database

- Supabase-hosted PostgreSQL
- Relational schema to model assets, bases, inventory, users, and transactions

---

## Architecture Overview

- RESTful API architecture
- Authentication via JWT
- Authorization enforced using middleware
- Inventory state stored separately from immutable transaction logs
- All asset movements are recorded as transactions for transparency and auditing

---

## Data Models (Core Tables)

- `users` – application users with roles
- `bases` – military bases
- `assets` – asset types (weapons, vehicles, ammunition)
- `inventory` – current stock per base and asset
- `transactions` – immutable log of all asset movements

---

## Role-Based Access Control (RBAC)

Roles supported:

- **Admin**

  - Full access to all operations and data

- **Logistics Officer**

  - Can record purchases and transfers

- **Base Commander**
  - Can view and manage data for their assigned base

RBAC is enforced at the API level using middleware that validates user roles from JWT claims.

---

## API Logging

All operations that modify asset state (purchases, transfers, assignments, expenditures) are recorded in the `transactions` table.

Each transaction includes:

- type of operation
- base
- asset
- quantity
- timestamp
- optional metadata

This ensures full traceability and auditability.

---

## Setup Instructions

### Prerequisites

- Node.js installed
- Supabase account

### Steps

1. Clone the repository
2. Install dependencies
   npm install
3. Create a .env file in the backend directory
   PORT=5000
   JWT_SECRET=your_secret_key
   DATABASE_URL=your_supabase_postgres_url
4. Run the development server
   npm run dev

---

## Authentication

### Login Endpoint

POST /auth/login

Request body:

    {
      "email": "admin@example.com",
      "password": "admin123"
    }

Response:

{
"token": "<JWT_TOKEN>"
}

The token must be passed in the Authorization header for protected routes:

Authorization: Bearer <JWT_TOKEN>

The token must be passed in the Authorization header for protected routes:

## Authorization: Bearer <JWT_TOKEN>

---

## Implemented API Endpoints (Sample)

POST /auth/login

POST /purchases

GET /purchases

## All protected routes require a valid JWT.

## Assumptions & Limitations

This is a prototype-level implementation

Frontend is minimal and intended for demonstration only

Advanced validations, reporting, and scalability concerns are out of scope

Asset types are generalized for simplicity

---

## Notes

This project prioritizes clarity of design and reasoning over exhaustive feature coverage. Trade-offs were made to fit within a constrained development timeline.

---
