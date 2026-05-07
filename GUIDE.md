# Orphan Mentorship Platform — Complete Developer & User Guide

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [User Roles](#3-user-roles)
4. [Prerequisites](#4-prerequisites)
5. [Backend Setup](#5-backend-setup)
6. [Frontend Setup](#6-frontend-setup)
7. [Database Setup & Migrations](#7-database-setup--migrations)
8. [Environment Variables](#8-environment-variables)
9. [Running the Application](#9-running-the-application)
10. [Authentication](#10-authentication)
11. [SuperAdmin Portal — Feature Guide](#11-superadmin-portal--feature-guide)
12. [Mentor Portal — Feature Guide](#12-mentor-portal--feature-guide)
13. [API Reference](#13-api-reference)
14. [File Uploads](#14-file-uploads)
15. [Database Schema](#15-database-schema)
16. [Troubleshooting](#16-troubleshooting)

---

## 1. Project Overview

The **Orphan Mentorship Platform** is a full-stack web application that connects orphaned children with mentors (admins) under the oversight of a SuperAdmin. It supports:

- Child registration and profile management
- Mentor (admin) registration and assignment
- Visit planning and reporting
- Activity and journal tracking
- Task management
- Learning material uploads
- Announcements
- Dashboard statistics and analytics

**Tech Stack:**

| Layer | Technology |
|---|---|
| Backend | Node.js 18+, Express 4, Sequelize 6, PostgreSQL |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Auth | JWT (jsonwebtoken), bcrypt |
| File Storage | AWS S3 via multer-s3 |
| Email | SendGrid |
| API Docs | Swagger UI at `/api-docs` |

---

## 2. Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vite + React)               │
│                                                              │
│   ┌─────────────────────┐   ┌──────────────────────────┐    │
│   │  SuperAdmin Portal  │   │      Mentor Portal        │    │
│   │  /management/*      │   │  /mentor/*                │    │
│   │  (port 5173)        │   │  (same app, role-gated)   │    │
│   └─────────────────────┘   └──────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
                         │ HTTP + accessToken header
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                  BACKEND (Express — port 5000)               │
│                                                              │
│  /admin  /child  /tasks  /reports  /visitReports             │
│  /visitPlannings  /activity  /journal  /learningmaterials    │
│  /superadmin  /announcements  /management  /comment          │
│                                                              │
│  Middleware: JWT auth → role guard → multer (S3) → controller│
└──────────────────────────────────────────────────────────────┘
                         │ Sequelize ORM
                         ▼
┌──────────────────────────────────────────────────────────────┐
│              PostgreSQL Database ("Orphan")                  │
│                                                              │
│  super_admins → admins → children → journals/tasks/reports   │
│                        → activities / visit_plannings        │
│                        → visit_reports / notifications       │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. User Roles

| Role | Token value | Who they are | Access level |
|---|---|---|---|
| **SuperAdmin** | `superadmin` | Platform administrator | Full visibility across all countries; manages mentors, announcements, managements |
| **Admin (Mentor)** | `admin` | Field mentor | Manages their own assigned children; records activities, visits, reports, tasks |
| **Child** | `child` | Registered orphan | Read-only access to own profile, tasks, notifications, journals |

**Auth header:** All protected endpoints require `accessToken: <jwt>` in the request header (NOT `Authorization: Bearer`).

---

## 4. Prerequisites

Make sure the following are installed before starting:

| Tool | Minimum Version | Check command |
|---|---|---|
| Node.js | 18.x | `node --version` |
| npm | 9.x | `npm --version` |
| PostgreSQL | 14+ | `psql --version` |
| sequelize-cli | 6.x | `npx sequelize-cli --version` |

---

## 5. Backend Setup

### 5.1 Clone and install

```bash
cd /path/to/Orphan-main
npm install
```

### 5.2 Create the `.env` file

Create a file named `.env` in the project root:

```env
PORT=5000
TOKEN_SECRET=your_long_random_secret_here

# PostgreSQL (must match config/config.json development block)
# DB config is read from config/config.json, not .env

# AWS S3 (for file uploads)
OBJECT_STORAGE_KEY=your_s3_access_key
OBJECT_STORAGE_BUCKET=your_bucket_name
OBJECT_STORAGE_SECRET=your_s3_secret_key

# Email (SendGrid)
SENDGRID_API_KEY=SG.your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# CORS — comma-separated list of allowed frontend origins
ALLOWED_ORIGINS=http://localhost:5173
```

> **Security note:** Never commit `.env` to git. Add it to `.gitignore`.

### 5.3 Database config

Edit `config/config.json` — only the `development` block is used in dev:

```json
{
  "development": {
    "username": "db-user",
    "password": "dbuser",
    "database": "Orphan",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

---

## 6. Frontend Setup

```bash
cd "Mentorship-Program-Management-Dashboard "
npm install
```

The frontend expects the backend at `http://localhost:5000`. If you change the backend port, update the `baseURL` in `src/api.ts` (or equivalent axios config file).

---

## 7. Database Setup & Migrations

### 7.1 Create the database

```bash
# Option A — using sequelize-cli (recommended)
npx sequelize-cli db:create

# Option B — using psql directly
psql -U db-user -h 127.0.0.1 -c 'CREATE DATABASE "Orphan";'
```

### 7.2 Run all migrations

```bash
npx sequelize-cli db:migrate
```

**Expected output — migrations run in this exact order:**

```
== 20251128000001-create-super-admins: migrating =======
== 20251128000001-create-super-admins: migrated (0.XXXs)

== 20251128000002-create-admins: migrating =======
== 20251128000002-create-admins: migrated (0.XXXs)

== 20251128000003-create-children: migrating =======
...
== 20251128000015-add-role-to-admins: migrated (0.XXXs)
```

**Dependency order (why this order matters):**

```
20251128000001  super_admins          (no dependencies)
20251128000002  admins                (FK → super_admins)
20251128000003  children              (FK → admins)
20251128000004  journals              (FK → children)
20251128000005  comments              (FK → admins, journals)
20251128000006  activities            (FK → children, admins)
20251128000007  learning_materials    (FK → admins)
20251128000008  notifications         (FK → children, admins)
20251128000009  reports               (FK → admins, children)
20251128000010  tasks                 (FK → children, admins)
20251128000011  visit_plannings       (FK → children, admins)
20251128000012  visit_reports         (FK → children, admins)
20251128000013  announcements         (FK → super_admins)
20251128000014  managements           (FK → super_admins)
20251128000015  add role to admins    (ALTER TABLE admins)
```

### 7.3 Reset the database from scratch

```bash
# Drop all tables and re-run from zero
npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

### 7.4 Undo migrations (rollback)

```bash
# Undo the last migration only
npx sequelize-cli db:migrate:undo

# Undo all migrations (drops all tables in reverse order)
npx sequelize-cli db:migrate:undo:all
```

---

## 8. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Port the backend listens on (default: `5000`) |
| `TOKEN_SECRET` | Yes | Secret key for signing JWTs. Must be long and random |
| `OBJECT_STORAGE_KEY` | Yes | AWS S3 access key ID |
| `OBJECT_STORAGE_SECRET` | Yes | AWS S3 secret access key |
| `OBJECT_STORAGE_BUCKET` | Yes | S3 bucket name for file uploads |
| `SENDGRID_API_KEY` | Yes | SendGrid API key for email delivery |
| `SENDGRID_FROM_EMAIL` | Yes | Sender email shown in delivered emails |
| `ALLOWED_ORIGINS` | Yes | Comma-separated list of allowed CORS origins |

> If `TOKEN_SECRET` is missing the server will refuse to start with a clear error message.

---

## 9. Running the Application

### 9.1 Start the backend

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

Server starts on `http://localhost:5000`
Swagger API docs available at `http://localhost:5000/api-docs`

### 9.2 Start the frontend

```bash
cd "Mentorship-Program-Management-Dashboard "
npm run dev
```

Frontend runs at `http://localhost:5173`

### 9.3 Verify connection

When the backend starts successfully you will see:

```
Server running on port 5000
Connected to the database
```

---

## 10. Authentication

### How it works

1. User sends credentials to a login endpoint
2. Server validates password with bcrypt, returns a signed JWT
3. Client stores the JWT in `localStorage` (`adminId` + `accessToken` for mentors, `superAdminId` + `accessToken` for super admins)
4. Every subsequent API call includes `accessToken: <jwt>` in the request header

### Login endpoints

| Role | Endpoint | Body |
|---|---|---|
| SuperAdmin | `POST /superadmin/signin` | `{ email, password }` |
| Admin (Mentor) | `POST /admin/signin` | `{ email, password }` |
| Child | `POST /child/login` | `{ email, password }` |

### Password reset flow

```
POST /admin/sendOtp       { email }          → sends OTP to email
POST /admin/verifyOtp     { email, otp }     → validates OTP
POST /admin/resetPassword { email, newPassword, otp }
```

Same flow exists for children at `/child/sendOtp`, `/child/verifyOtp`, `/child/resetPassword`.

---

## 11. SuperAdmin Portal — Feature Guide

The SuperAdmin portal is accessed via `http://localhost:5173` after logging in with a `superadmin` role account. All pages are under the `/management/*` routing namespace.

---

### 11.1 Dashboard

**Route:** `/management/dashboard` (or `/`)

The dashboard shows a global overview of the platform.

```
[SCREENSHOT: SuperAdmin dashboard — shows stat cards for total children,
total mentors, total reports, upcoming visits, plus charts for
age distribution and country-wise activity]
```

**Stats shown:**
- Total children (active, non-deleted)
- Total mentors
- Total reports submitted
- Upcoming visit count
- Activity distribution by country (bar chart)
- Age group distribution (pie chart)

---

### 11.2 Mentors

**Route:** `/management/mentors`

Lists all mentors filtered by the selected country (top-right country selector).

```
[SCREENSHOT: Mentors list table — columns: Name, Email, Phone,
Employment Type, Country, Status, Actions (View/Delete)]
```

**Register a new mentor:**

Route: `/management/mentors/register`

```
[SCREENSHOT: Mentor registration form — fields: Full Name, Email,
Phone Number, Country, Employment Type, Years of Experience,
Professional Background, Maximum Case Load, Preferred Age Group,
Special Skills, Password]
```

Form fields:

| Field | Required | Notes |
|---|---|---|
| Full Name | Yes | |
| Email | Yes | Must be unique |
| Password | Yes | Hashed with bcrypt |
| Phone Number | No | |
| Country | No | Used for country filtering |
| Employment Type | No | |
| Years of Experience | No | Integer |
| Professional Background | No | Free text |
| Maximum Case Load | No | Integer |
| Preferred Age Group | No | |
| Special Skills | No | Free text |

---

### 11.3 Children

**Route:** `/management/children`

Lists all children filtered by country.

```
[SCREENSHOT: Children list — cards or table showing child photo,
name, age, location, assigned mentor name, and a View button]
```

**Register a new child:**

Route: `/management/children/register`

```
[SCREENSHOT: Child registration form — two columns layout with
personal info on left (name, age, gender, location) and
guardian/health info on right]
```

Form fields:

| Field | Required | Notes |
|---|---|---|
| First Name | Yes | |
| Last Name | Yes | |
| Age | No | Integer |
| Gender | No | |
| Location / Country | No | Used for filtering |
| Language | No | |
| Guardian Name | No | |
| Relationship | No | e.g. Uncle, Grandmother |
| Contact Number | No | |
| Email | No | For child login |
| General Condition | No | Health overview |
| Education Level | No | |
| School Performance | No | |
| Psychological Support Needs | No | |
| Financial Situation | No | |
| Additional Notes | No | |
| Profile Picture | No | Uploaded to S3 |
| Document Upload | No | Uploaded to S3 |

---

### 11.4 Reports

**Route:** `/management/reports`

```
[SCREENSHOT: Reports list — table with columns: Child Name,
Report Type, Urgency Level, Date, Mentor Name, Actions]
```

**Submit a new report:**

Route: `/management/reports/new`

```
[SCREENSHOT: New report form — large form with sections:
Basic Information (child selector, mentor selector for SuperAdmin,
report type, urgency level), then Health Status, Educational
Progress, Emotional Development, Financial Situation,
Special Events, Additional Notes]
```

**Report sections:**

| Section | Fields |
|---|---|
| Basic Information | Child, Mentor (SuperAdmin only), Report Type, Urgency Level |
| Health Status | General Condition, Recent Doctor Visits, Nutrition Status, Physical Activities |
| Educational Progress | Academic Performance, Attendance & Participation |
| Emotional Development | Mental State, Social Integration |
| Financial Situation | Current Needs, Existing Support |
| Special Events | Notable Events or Achievements |
| Additional Notes | Other Observations |

**Report Types:** Regular Check-in, Monthly Report, Emergency Report, Special Event

**Urgency Levels:** Normal, Important, Urgent, Emergency

---

### 11.5 Tasks

**Route:** `/management/tasks`

```
[SCREENSHOT: Tasks list — cards showing task title, child name,
due date, priority badge (Low/Medium/High), task type, status]
```

**Create a new task:**

Route: `/management/tasks/new`

```
[SCREENSHOT: Add Task form — fields for title, description,
child selector dropdown, mentor selector (SuperAdmin only),
due date, due time, priority dropdown, task type dropdown]
```

| Field | Required | Notes |
|---|---|---|
| Task Title | Yes | |
| Description | No | |
| Related Child | Yes | Dropdown of children by country |
| Assign to Mentor | Yes (SuperAdmin) | Dropdown — FK must be a mentor, not a superadmin |
| Due Date | Yes | Date picker |
| Due Time | No | Time picker, defaults to 09:00 |
| Priority | No | Low / Medium / High |
| Task Type | No | Visit / Report / Document / Other |

---

### 11.6 Activities

**Route:** `/management/activities`

```
[SCREENSHOT: Activities list — shows recent activities with
activity type icon, title, child name, date, status badge]
```

**Record a new activity:**

Route: `/management/activities/new`

```
[SCREENSHOT: Add Activity form — dropdowns for activity type
and child, mentor selector (SuperAdmin only), title input,
description textarea, date and time pickers, status dropdown,
and file upload drag-drop zone]
```

| Field | Required | Notes |
|---|---|---|
| Activity Type | Yes | Visit / Report / Media Upload / Other |
| Related Child | Yes | |
| Assign to Mentor | Yes (SuperAdmin) | |
| Activity Title | Yes | |
| Description | No | |
| Date | Yes | |
| Time | Yes | |
| Status | No | Completed / Pending / Cancelled |
| Attachments | No | Multiple files, images and PDFs |

---

### 11.7 Media Gallery

**Route:** `/management/media`

```
[SCREENSHOT: Media gallery — grid of uploaded files with
thumbnail, title, type badge (Document/Video/Image/Audio),
due date, priority, and uploader name]
```

**Upload new media:**

Route: `/management/media/upload`

```
[SCREENSHOT: Upload Media form — large drag-and-drop file zone
at top, then title, tag, description, due date/time, priority
and type dropdowns, mentor selector for SuperAdmin]
```

| Field | Required | Notes |
|---|---|---|
| File | No | Any file type; stored in S3 |
| Title | Yes | |
| Tag | No | e.g. Health, Education |
| Description | Yes | Minimum 10 characters |
| Due Date | Yes | |
| Due Time | No | |
| Priority | No | Low / Medium / High |
| Type | No | Document / Video / Image / Audio / Other |
| Assign to Mentor | Yes (SuperAdmin) | |

---

### 11.8 Visit Schedule

**Route:** `/management/schedule`

```
[SCREENSHOT: Schedule page — calendar or list view of all
upcoming visit plannings, with child name, mentor name,
visit type, date and time]
```

**Plan a new visit:**

Route: `/management/visits/new`

```
[SCREENSHOT: Add Visit form — child selector, mentor selector,
visit date, visit time, visit type (Home Visit/School/Medical/
Community), notes textarea]
```

---

### 11.9 Announcements

**Route:** `/management/announcements`

```
[SCREENSHOT: Announcements list — cards with title, content
preview, priority badge, date created]
```

**Create announcement:**

Route: `/management/announcements/new`

```
[SCREENSHOT: Add Announcement form — title input, content
textarea, priority selector (Normal/Important/Urgent)]
```

---

### 11.10 Statistics

**Route:** `/management/statistics`

```
[SCREENSHOT: Statistics page — multiple recharts visualizations:
bar chart of reports by country, pie chart of age groups,
line chart of monthly activity trends, task type breakdown]
```

---

### 11.11 Management Users

**Route:** `/management/users`

Lists management-level users linked to the SuperAdmin account.

```
[SCREENSHOT: Management users table — name, email, phone,
country, role, actions (delete)]
```

---

### 11.12 Settings (SuperAdmin)

**Route:** `/management/settings`

```
[SCREENSHOT: Settings page — profile edit form with Full Name,
Email, and password change fields (Current Password,
New Password)]
```

---

## 12. Mentor Portal — Feature Guide

The Mentor (Admin) portal shares the same React app but renders different components based on the `admin` JWT role. Mentors log in at the same login page.

---

### 12.1 Mentor Dashboard

```
[SCREENSHOT: Mentor dashboard — cards showing assigned children
count, tasks due today, recent activity count, upcoming visits;
plus a quick-links section and recent activity feed]
```

---

### 12.2 My Children

Lists only the children assigned to the logged-in mentor.

```
[SCREENSHOT: Children profiles page — grid of child cards each
showing photo, name, age, location badge, and View Profile button]
```

**Child Profile:**

```
[SCREENSHOT: Child profile page — header with photo, name, age,
gender; tabs for Overview, Tasks, Reports, Journals,
Visit History, Activities]
```

---

### 12.3 Add Child

```
[SCREENSHOT: Add Child form — same layout as SuperAdmin registration
but without mentor assignment dropdown since the child is
automatically assigned to the logged-in mentor]
```

---

### 12.4 Tasks (Mentor view)

```
[SCREENSHOT: Tasks page — list of tasks assigned by this mentor,
filterable by status and priority; each task shows child name,
due date, priority badge]
```

---

### 12.5 Reports (Mentor view)

```
[SCREENSHOT: Reports list filtered to this mentor's reports;
New Report button at top right]
```

---

### 12.6 Journal Entry

Mentors can write journal entries for each child.

```
[SCREENSHOT: Journal entry form — child selector, title, journal
text area, mood rating (1-10), emotion tags, social interaction
notes, file attachment]
```

---

### 12.7 Visit Planning & Reports

**Plan a visit:**

```
[SCREENSHOT: Add Visit form — child selector (only assigned
children shown), visit date, visit time, visit type, notes]
```

**Write a visit report:**

```
[SCREENSHOT: Visit report form — child selector, visit date,
visit time, visit type, notes textarea, status field]
```

---

### 12.8 Announcements (Mentor view)

Read-only view of announcements created by the SuperAdmin.

```
[SCREENSHOT: Announcements list — cards with priority color
coding (red = urgent, orange = important, gray = normal)]
```

---

### 12.9 Media Gallery (Mentor view)

```
[SCREENSHOT: Media gallery filtered to this mentor's uploads;
Upload button at top right]
```

---

### 12.10 Notifications

```
[SCREENSHOT: Notifications list — each item shows title, message,
child name, type, time ago; unread items highlighted]
```

---

### 12.11 Edit Profile (Mentor)

```
[SCREENSHOT: Profile edit form — photo upload, Full Name, Email,
Phone, Country, Employment Type, Years Experience, Skills,
password change section]
```

---

## 13. API Reference

All endpoints are prefixed by the base URL: `http://localhost:5000`

Authentication header for all protected routes:
```
accessToken: <your_jwt_token>
```

---

### SuperAdmin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/superadmin/create` | Public | Register a new SuperAdmin |
| POST | `/superadmin/signin` | Public | Login |
| GET | `/superadmin/getbyid/:id` | SuperAdmin | Get profile by ID |
| PUT | `/superadmin/update/:id` | SuperAdmin | Update profile / password |
| GET | `/superadmin/getDashboardCounts` | SuperAdmin | Global stats by country |
| GET | `/superadmin/getAdminsAndManagers` | SuperAdmin | List all admins + managers |
| DELETE | `/superadmin/delete/:id` | SuperAdmin | Soft-delete a SuperAdmin |

---

### Admin (Mentor)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/admin/add` | Public | Register a new mentor |
| POST | `/admin/signin` | Public | Login |
| POST | `/admin/sendOtp` | Public | Send OTP for password reset |
| POST | `/admin/verifyOtp` | Public | Verify OTP |
| POST | `/admin/resetPassword` | Public | Reset password after OTP |
| GET | `/admin/getbyid/:id` | Admin | Get own profile |
| PUT | `/admin/update/:id` | Admin | Update profile + optional photo |
| PUT | `/admin/updateAdmin/:id` | Admin | Update profile (no photo) |
| GET | `/admin/getDashboardStats/:adminId` | Admin | Dashboard stats for mentor |
| GET | `/admin/getAllNotifications` | Admin | Get all notifications |
| GET | `/admin/get-MentorsBy-Country` | SuperAdmin | List mentors by country |
| GET | `/admin/get-by-country` | SuperAdmin | List all admins |
| GET | `/admin/get-by-id/:id` | SuperAdmin | Get mentor by ID |
| DELETE | `/admin/deleteAdminById/:id` | SuperAdmin | Soft-delete a mentor |

---

### Children

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/child/login` | Public | Child login |
| POST | `/child/sendOtp` | Public | Send OTP |
| POST | `/child/verifyOtp` | Public | Verify OTP |
| POST | `/child/resetPassword` | Public | Reset password |
| POST | `/child/addChild` | Admin | Register a child |
| GET | `/child/allchildren` | Admin | List all children |
| GET | `/child/getbyid/:id` | Any auth | Get child by ID |
| PUT | `/child/updateChild/:id` | Admin | Update child profile |
| DELETE | `/child/deleteChild/:id` | Admin | Soft-delete child |
| GET | `/child/getChildrenByAdminId/:adminId` | Admin | Children by mentor |
| GET | `/child/getChildrenByCountry` | Admin/SuperAdmin | Children by country |
| GET | `/child/countChildrenByCountry` | Admin/SuperAdmin | Count by country |
| GET | `/child/getDashboardCounts` | Admin/SuperAdmin | Child stats |
| GET | `/child/get-Age-Group` | Admin/SuperAdmin | Age group distribution |
| GET | `/child/getNotificationsByChild/:childId` | Child | Own notifications |
| PUT | `/child/markNotificationAsRead/:id` | Child | Mark notification read |
| PUT | `/child/updatePassword/:id` | Child | Change own password |

---

### Tasks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/tasks/create` | Admin/SuperAdmin | Create task |
| GET | `/tasks/alltasks` | Admin | All tasks |
| GET | `/tasks/singletasks/:taskId` | Admin | Single task |
| GET | `/tasks/child/:childId` | Admin | Tasks by child |
| GET | `/tasks/getTasksByAdminId/:adminId` | Admin | Tasks by mentor |
| GET | `/tasks/count-Tasks-ByType` | Admin | Task type count by country |
| DELETE | `/tasks/delete/:id` | Admin | Soft-delete task |

---

### Reports

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/reports/add` | Admin/SuperAdmin | Submit report |
| GET | `/reports/by-Id/:id` | Admin | Get report by ID |
| PUT | `/reports/update/:id` | Admin | Update report |
| DELETE | `/reports/delete/:id` | Admin | Soft-delete report |
| GET | `/reports/get-by-admin/:adminId` | Admin | Reports by mentor |
| GET | `/reports/getReportsByChildId/:childId` | Admin | Reports by child |
| GET | `/reports/get-by-country` | Admin/SuperAdmin | Reports by country |
| GET | `/reports/getUrgentReports` | Admin/SuperAdmin | Urgent reports |
| GET | `/reports/count-Reports-ByType` | Admin/SuperAdmin | Count by type |
| GET | `/reports/getCountryWiseTrends` | Admin/SuperAdmin | Trend data |

---

### Visit Plannings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/visitPlannings/create` | Admin/SuperAdmin | Plan a visit |
| GET | `/visitPlannings/all` | Admin | All plannings |
| GET | `/visitPlannings/single/:id` | Admin | Single planning |
| GET | `/visitPlannings/child/:childId` | Admin | By child |
| GET | `/visitPlannings/admin/:adminId` | Admin | By mentor |
| GET | `/visitPlannings/upcoming` | Admin | Upcoming visits |
| GET | `/visitPlannings/visit-statistics` | Admin/SuperAdmin | Visit stats |
| GET | `/visitPlannings/getUpcomingVisitsByChild/:childId` | Admin | Upcoming by child |

---

### Visit Reports

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/visitReports/create` | Admin | Create visit report |
| GET | `/visitReports/getall` | Admin | All visit reports |
| GET | `/visitReports/single/:id` | Admin | Single report |
| GET | `/visitReports/child/:childId` | Admin | By child |
| GET | `/visitReports/getByAdminId/:adminId` | Admin | By mentor |
| GET | `/visitReports/getUrgentVisitReports` | Admin/SuperAdmin | Urgent |
| DELETE | `/visitReports/delete/:id` | Admin | Soft-delete |

---

### Activities

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/activity/add` | Admin/SuperAdmin | Record activity (multipart) |
| GET | `/activity/getadminId/:adminId` | Admin | By mentor |
| GET | `/activity/child/:childId` | Admin | By child |
| GET | `/activity/recent/:childId` | Admin | Recent by child |
| GET | `/activity/get-by-country` | Admin/SuperAdmin | By country |
| DELETE | `/activity/delete/:id` | Admin | Soft-delete |

---

### Journals

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/journal/create` | Admin | Create journal (multipart) |
| GET | `/journal/child/:childId` | Any auth | Journals by child |
| GET | `/journal/single/:id` | Any auth | Single journal |
| DELETE | `/journal/delete/:id` | Admin | Soft-delete |

---

### Comments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/comment/add` | Any auth | Add comment to journal |
| GET | `/comment/getbyjournal/:journalId` | Any auth | Comments on journal |
| GET | `/comment/user/:journalId` | Any auth | Comments (user view) |
| GET | `/comment/getbyId/:id` | Any auth | Single comment |
| DELETE | `/comment/delete/:id` | Any auth | Delete comment |

---

### Learning Materials (Media)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/learningmaterials/add` | Admin/SuperAdmin | Upload material (multipart) |
| GET | `/learningmaterials/all` | Admin/SuperAdmin | All materials |
| GET | `/learningmaterials/single/:id` | Admin/SuperAdmin | Single material |
| GET | `/learningmaterials/getByAdminId/:adminId` | Admin | By mentor |
| GET | `/learningmaterials/get-by-country` | Admin/SuperAdmin | By country |
| GET | `/learningmaterials/getLearningMaterialsByTag` | Admin/SuperAdmin | By tag |
| DELETE | `/learningmaterials/delete/:id` | Admin | Soft-delete |

---

### Announcements

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/announcements/add` | Admin/SuperAdmin | Create announcement |
| GET | `/announcements/all` | Admin/SuperAdmin | All announcements |
| GET | `/announcements/getbyId/:id` | Admin/SuperAdmin | Single announcement |
| PUT | `/announcements/update/:id` | Admin | Update |
| DELETE | `/announcements/delete/:id` | Admin | Soft-delete |
| GET | `/announcements/getbyadminId/:superadminId` | Admin/SuperAdmin | By SuperAdmin |

---

### Management Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/management/add` | SuperAdmin | Add management user |
| GET | `/management/getBySuperadmin/:superadminId` | SuperAdmin | List by SuperAdmin |
| DELETE | `/management/delete/:id` | SuperAdmin | Delete |

---

## 14. File Uploads

File uploads are handled by **multer-s3** and stored in the configured S3 bucket.

**Endpoints that accept file uploads:**

| Endpoint | Field name | Max files | Accepted types |
|---|---|---|---|
| `POST /child/addChild` | `profilePicture`, `upload` | 1 each | Any |
| `PUT /child/updateChild/:id` | `profilePicture`, `upload` | 1 each | Any |
| `PUT /admin/update/:id` | `profilePicture` | 1 | Any |
| `POST /activity/add` | `attachments` | 5 | Any |
| `POST /journal/create` | `uploadedFile` | 1 | Any |
| `POST /learningmaterials/add` | `file` | 1 | Any |

**Accessing uploaded files:**

Static files in the local `uploads/` directory are served at:
```
http://localhost:5000/uploads/<filename>
```

Files uploaded to S3 are accessed via the S3 public URL returned in the API response.

---

## 15. Database Schema

### Dependency diagram

```
super_admins (id, full_name, email, password, county, role, number)
     │
     ├── admins (id, full_name, email, password, phone_number, country,
     │           employment_type, years_of_experience, professional_background,
     │           maximum_case_load, preferred_age_group, special_skills,
     │           superadmin_id→super_admins, profile_picture, otp, otp_expiry,
     │           role, is_deleted)
     │       │
     │       ├── children (id, first_name, last_name, age, gender, location,
     │       │             language, guardian_name, relationship, contact_number,
     │       │             email, general_condition, current_education_level,
     │       │             school_performance, psychological_support_needs,
     │       │             financial_situation, additional_notes, profile_picture,
     │       │             password, admin_id→admins, upload, otp, otp_expiry,
     │       │             is_deleted)
     │       │       │
     │       │       ├── journals (id, title, journal_text, emotion_tags[],
     │       │       │             social_interaction, assessment_type, notes,
     │       │       │             uploaded_file, mood_rating, activities[],
     │       │       │             child_id→children, is_deleted)
     │       │       │       │
     │       │       │       └── comments (id, admin_id→admins,
     │       │       │                    journal_id→journals, text,
     │       │       │                    visible, is_deleted)
     │       │       │
     │       │       ├── tasks (id, task_title, description, child_name,
     │       │       │          child_id→children, admin_id→admins,
     │       │       │          due_date, due_time, priority, task_type,
     │       │       │          is_deleted)
     │       │       │
     │       │       ├── reports (id, admin_id→admins, child_id→children,
     │       │       │            report_type, urgency_level, general_condition,
     │       │       │            recent_doctor_visits, nutrition_status,
     │       │       │            physical_activities, academic_performance,
     │       │       │            attendance_participation, mental_state,
     │       │       │            social_integration, financial_needs,
     │       │       │            existing_support, notable_events, date, time,
     │       │       │            additional_notes, is_deleted)
     │       │       │
     │       │       ├── activities (id, activity_type, child_id→children,
     │       │       │               title, description, date, time, attachments,
     │       │       │               admin_id→admins, status, uploaded_file,
     │       │       │               is_deleted)
     │       │       │
     │       │       ├── visit_plannings (id, child_id→children,
     │       │       │                    admin_id→admins, visit_date,
     │       │       │                    visit_time, visit_type, notes,
     │       │       │                    is_deleted)
     │       │       │
     │       │       ├── visit_reports (id, child_id→children, donor_id,
     │       │       │                  visit_date, visit_time, visit_type,
     │       │       │                  notes, status, admin_id→admins,
     │       │       │                  is_deleted)
     │       │       │
     │       │       └── notifications (id, title, message, type,
     │       │                          child_id→children, admin_id→admins,
     │       │                          is_read, is_deleted)
     │       │
     │       └── learning_materials (id, title, description, related_tag,
     │                               due_date, due_time, priority, task_type,
     │                               file, admin_id→admins, file_type, is_deleted)
     │
     ├── announcements (id, title, content, priority,
     │                  superadmin_id→super_admins, is_deleted)
     │
     └── managements (id, full_name, email, phone_number, country, role,
                      superadmin_id→super_admins, is_deleted)
```

### Soft deletes

Every table has an `is_deleted BOOLEAN DEFAULT false` column. Records are never hard-deleted — all queries filter `WHERE is_deleted = false`. To "delete" a record the app sets `is_deleted = true`.

---

## 16. Troubleshooting

### Migration fails: "relation does not exist"

The migration is trying to create a table that references another table not yet created. This means you ran migrations out of order or a previous migration failed silently.

**Fix:**
```bash
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
```

---

### Migration fails: "column already exists"

You have existing tables from a previous run. The `role` column in `admins` is a common case — migration 02 and 15 both deal with it.

**Fix:**
```bash
npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

---

### Server crashes: "TOKEN_SECRET environment variable is required"

The `.env` file is missing or not loading.

**Fix:** Ensure `.env` exists in the project root (`Orphan-main/.env`) and contains `TOKEN_SECRET=...`.

---

### API returns 403: "Admin access required"

You are logged in as a SuperAdmin but hitting an endpoint that only allows `admin` role (or vice versa).

**Check:** The `role` field in your JWT. SuperAdmin token has `role: "superadmin"`, mentor token has `role: "admin"`.

---

### API returns 401: "No token provided"

The request is missing the `accessToken` header.

**Fix:** Ensure your HTTP client sends:
```
accessToken: <your_jwt>
```
Not `Authorization: Bearer <jwt>` — this API uses a custom header.

---

### File upload fails

1. Check that `OBJECT_STORAGE_KEY`, `OBJECT_STORAGE_SECRET`, and `OBJECT_STORAGE_BUCKET` are set in `.env`
2. Check S3 bucket permissions allow `PutObject` from your IAM credentials
3. Check the S3 bucket region matches what your SDK resolves to

---

### CORS error in browser

The frontend origin is not in the `ALLOWED_ORIGINS` list.

**Fix:** Add your frontend URL to `.env`:
```env
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

---

### Sequelize FK violation on insert

You are passing a SuperAdmin ID as `admin_id` in a record that has an FK to the `admins` table.

**Affected forms:** Add Task, Add Activity, Submit Report, Upload Media — when used by a SuperAdmin.

**Fix:** These forms now show an "Assign to Mentor" dropdown when the logged-in user is a SuperAdmin. Always select a mentor from that dropdown so a valid `admins.id` is used, not the SuperAdmin's ID.

---

*Last updated: 2026-05-07*
