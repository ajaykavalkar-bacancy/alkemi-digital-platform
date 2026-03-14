# MoneyMind — Multi-Agent Development System

## Overview

MoneyMind is a **Digital Banking Experience Platform MVP** built to demonstrate modern fintech capabilities using simulated banking data.

The application showcases core banking workflows with a polished user experience and an AI-driven financial insights feature.

Primary capabilities include:

* Account management
* Transaction history
* Fund transfers
* Card controls
* Notifications
* AI financial insights

The product is designed as a **modern fintech platform**.

---

# Technology Stack

Frontend

* Next.js 14 (App Router)
* TypeScript
* TailwindCSS
* shadcn/ui

Backend

* Supabase
* PostgreSQL
* Row Level Security

AI

* OpenAI API

Data Visualization

* Recharts

---

# Multi-Agent Architecture

The system uses specialized development agents.

Each agent is responsible for a specific part of the platform.

Agents collaborate but must respect module boundaries.

Agents:

1 Product Architect Agent
2 UI/UX Design Agent
3 Frontend Development Agent
4 Backend & Database Agent
5 AI Feature Agent
6 Security Agent
7 Testing & Quality Agent

---

# Product Architect Agent

Responsibilities:

* define application architecture
* enforce folder structure
* maintain consistency across modules
* define API contracts
* coordinate other agents

Key rules:

* follow the defined project structure
* maintain modular component design
* ensure scalability for future features

Project structure:

```id="ar9eb6"
/app
  /login
  /signup
  /dashboard
  /accounts
  /transactions
  /transfer
  /cards
  /notifications
  /insights
  /admin

/components
  account-summary.tsx
  transaction-list.tsx
  transfer-form.tsx
  card-controls.tsx
  ai-copilot.tsx
  notifications-panel.tsx
  spending-chart.tsx
  navbar.tsx
  sidebar.tsx

/lib
  supabaseClient.ts
  openai.ts
  utils.ts

/database
  schema.sql
  seed.sql
```

---

# UI/UX Design Agent

Responsibilities:

* design the visual interface
* ensure fintech-grade UX
* maintain consistent design system

Design guidelines:

* modern banking dashboard layout
* large balance cards
* intuitive navigation sidebar
* rounded UI components
* subtle shadows
* responsive layout
* dark/light mode support

Primary UI screens:

Login
Signup
Dashboard
Accounts
Transactions
Transfer
Cards
Notifications
Insights
Admin

Charts should use **Recharts**.

---

# Frontend Development Agent

Responsibilities:

* implement Next.js pages
* build reusable components
* manage state and UI interactions

Pages to implement:

```id="tvw8i4"
/login
/signup
/dashboard
/accounts
/transactions
/transfer
/cards
/notifications
/insights
/admin
```

Components:

```id="7y9afq"
account-summary.tsx
transaction-list.tsx
transfer-form.tsx
card-controls.tsx
ai-copilot.tsx
notifications-panel.tsx
spending-chart.tsx
navbar.tsx
sidebar.tsx
```

Requirements:

* TypeScript strict mode
* reusable UI components
* responsive design
* Tailwind styling
* shadcn/ui component usage

---

# Backend & Database Agent

Responsibilities:

* design database schema
* implement Supabase integration
* enforce Row Level Security
* seed realistic data

Tables:

users
accounts
transactions
transfers
cards
notifications
ai_insights

Schema definitions:

Accounts

```id="upqj2t"
id
user_id
account_type
balance
created_at
```

Transactions

```id="li6w9p"
id
account_id
type
description
category
amount
created_at
```

Transfers

```id="y93xnt"
id
from_account
to_account
amount
status
created_at
```

Cards

```id="6dyep4"
id
user_id
card_number
status
online_payments_enabled
international_enabled
```

Notifications

```id="pjmp1s"
id
user_id
message
type
created_at
```

AI Insights

```id="i0f8ae"
id
user_id
insight_type
insight_text
created_at
```

Security rules:

* enable row-level security
* users can only access their own data
* admin role can view aggregated data

---

# AI Feature Agent

Responsible for implementing the **MoneyMind Financial Copilot**.

Purpose:

Provide AI-powered financial analysis and predictions.

Inputs:

* last 30 user transactions
* current account balances

Processing:

Send transaction data to OpenAI API.

Expected structured output:

```id="ynzbb8"
{
  spending_insight: string,
  saving_tip: string,
  anomaly_detection: string,
  predicted_balance_7_days: number
}
```

UI display:

* dashboard insight cards
* financial health suggestions
* anomaly alerts

---

# Security Agent

Responsibilities:

* enforce secure authentication
* validate transfer operations
* ensure user data isolation
* protect API keys

Security rules:

* Supabase Auth required
* secure environment variables
* protect OpenAI API key
* validate all database mutations

Environment variables:

```id="wneblx"
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
OPENAI_API_KEY
```

---

# Testing & Quality Agent

Responsibilities:

* ensure app compiles successfully
* validate core workflows
* detect runtime errors

Key workflows to test:

User authentication
Dashboard loading
Transaction listing
Money transfer workflow
Card control toggles
Notification generation
AI insight generation

Success criteria:

* no TypeScript errors
* no runtime crashes
* correct database updates
* responsive UI layout

---

# Seed Data

Seed workspace user:

```id="95mb8h"
email: seed@moneymind.com
password: password123
```

Seed data must include:

* 2 financial accounts
* 20 transactions
* 1 debit card

Example transactions:

Salary deposit
Amazon purchase
Starbucks
Netflix subscription
Electricity bill

---

# Development Workflow

Agents must execute work in this order:

1 Product Architect defines structure
2 Backend Agent creates schema
3 Backend Agent seeds workspace data
4 Frontend Agent builds authentication
5 UI Agent designs dashboard
6 Frontend Agent builds transactions module
7 Frontend Agent builds transfer module
8 Frontend Agent builds card controls
9 Backend Agent implements notifications
10 AI Agent builds financial copilot
11 Testing Agent validates system

---

# Final Requirements

The MoneyMind MVP must:

* run using `npm install` and `npm run dev`
* compile without TypeScript errors
* include Supabase integration
* include seeded data
* include AI Financial Copilot
* provide responsive fintech-style UI

---

# Deliverable

Agents must output a **complete working Next.js codebase for the MoneyMind digital banking MVP**.
