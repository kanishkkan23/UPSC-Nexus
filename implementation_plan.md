# UPSC Cloud Project Completion Plan

This document provides an analysis of the current state of the UPSC Cloud Project (UPSC Hub) and presents a detailed, phased implementation plan to bring the project to 100% completion.

## Current Project Status Analysis

### What is Finished (Frontend UI & Basic Logic)
1. **Core Landing Page**: [index.html](file:///D:/UPSC%20CLOUD%20PROJECT/index.html) is complete with smooth scroll, statistic counters, and links.
2. **Standard CSS Styling**: Visual foundations in `css/` are established with variables, a unified font (Poppins), and custom styling files (e.g., `style.css`, `dashboard.css`, `prelims.css`, `mains.css`, `interview.css`, `pyq.css`, `resources.css`).
3. **Core Preparation Sub-pages (UI Only)**:
   - [prelims.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/prelims.html)
   - [mains.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/mains.html)
   - [interview.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/interview.html)
   - [pyq.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/pyq.html)
   - [study-materials.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/study-materials.html)
   - [exam-calendar.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/exam-calendar.html)
4. **Basic Client-Side JavaScript Logic**:
   - Validation & UI responsiveness in [auth.js](file:///D:/UPSC%20CLOUD%20PROJECT/js/auth.js).
   - Local storage checks for study checklists in [dashboard.js](file:///D:/UPSC%20CLOUD%20PROJECT/js/dashboard.js).
   - Interactive local searches in dashboards and lists.
5. **Supabase SDK Integration Setup**:
   - [supabaseClient.js](file:///D:/UPSC%20CLOUD%20PROJECT/js/supabaseClient.js) is configured with credentials and initialized on `window.supabaseClient`.
   - Script tags loading `@supabase/supabase-js@2` CDN are embedded in auth files.

### What is Empty or Missing (0-byte Placeholders)
1. **Database Schema SQL Files**:
   - `backend/database-schema/users.sql`, `study_materials.sql`, `pyqs.sql`, `current_affairs.sql`, `videos.sql`, and `download_history.sql` are empty.
2. **Key User Features**:
   - `pages/profile.html`, `css/profile.css`, and `js/profile.js` are empty.
   - User profile data is not saved in any profile tables upon registration.
3. **Admin Controls & Management Panels**:
   - `pages/admin-dashboard.html`, `css/admin.css`, and `js/admin.js` are empty.
   - Admin management forms (`manage-users.html`, `manage-materials.html`, `manage-pyq.html`, `manage-current-affairs.html`, `manage-videos.html`) and their JS scripts are empty.
4. **Dynamic Data Strategy (Supabase Integration)**:
   - Data displayed in PYQs, study materials, exam calendar, and countdowns is currently hardcoded in HTML.
   - Learning progress values (e.g. "70% Prelims") are static placeholders.
   - PDF downloads show placeholders/alert warnings instead of downloading files.
5. **Session Security & Routing**:
   - Users can access internal dashboard files without being logged in.
   - Admin pages lack role protection.

---

## User Review Required

> [!IMPORTANT]
> **Authentication Flow:** Currently, registration requests directly trigger `supabase.auth.signUp()`, but do not insert the extra meta profile information (full name, phone, attempt number, preferred language, state, qualification) into a custom profiles database table. We will need to implement a PostgreSQL trigger/function in Supabase or handle this in client-side code on registration success.
>
> **Supabase Storage Buckets:** Downloading PYQ PDFs and study materials will require storage buckets (e.g., `pyqs`, `materials`) configured in Supabase. The client will fetch signed URLs or public URLs from these buckets.

> [!WARNING]
> **Local Testing Server:** To ensure secure script execution (specifically Supabase API communication and module loading), files must be served over a local host or a secure HTTP server instead of directly opening them via the `file://` protocol in browsers. We can use a simple node package or standard VS Code extension.

---

## Open Questions

> [!NOTE]
> 1. **User Profile Trigger:** Do you prefer using a Supabase PostgreSQL Trigger to automatically create user records in the `profiles` table when a user registers, or should we handle the insertion of profile details (like Full Name, DOB, Attempt) from the frontend JS? *(Trigger method is safer and recommended).*
> 2. **Admin Authentication:** How should we identify admins? Should we add an `is_admin` boolean flag to the user profile table, or use a role table?
> 3. **Hosting Files:** Do you already have PDFs to upload for PYQs and study materials, or should we seed mock PDF links (e.g., sample documents) for now?

---

## Proposed Changes

We will work in sequential phases to implement the backend database, secure sessions, build the missing pages, and bind dynamic content.

### Component 1: Database Setup & Schemas (Supabase Setup)
We will define SQL code to build the tables, Row Level Security (RLS) policies, and triggers in Supabase.

#### [MODIFY] [users.sql](file:///D:/UPSC%20CLOUD%20PROJECT/backend/database-schema/users.sql)
- Design the `profiles` table to store extra metadata (name, DOB, mobile, gender, language, state, qualification, attempt) synced to the Supabase Auth `users` uuid.
- Write a PostgreSQL trigger function to insert new users from `auth.users` automatically.

#### [MODIFY] [study_materials.sql](file:///D:/UPSC%20CLOUD%20PROJECT/backend/database-schema/study_materials.sql)
- Schema for study materials including fields: `id`, `title`, `subject`, `description`, `file_url`, `created_at`, `uploaded_by`.

#### [MODIFY] [pyqs.sql](file:///D:/UPSC%20CLOUD%20PROJECT/backend/database-schema/pyqs.sql)
- Schema for PYQ records: `id`, `year`, `subject`, `paper_type` (General Studies I, CSAT, Mains GS, Essay, etc.), `file_url`, `created_at`.

#### [MODIFY] [current_affairs.sql](file:///D:/UPSC%20CLOUD%20PROJECT/backend/database-schema/current_affairs.sql)
- Schema for updates: `id`, `title`, `content_summary`, `category` (National, International, Scheme), `article_url`, `published_date`.

#### [MODIFY] [videos.sql](file:///D:/UPSC%20CLOUD%20PROJECT/backend/database-schema/videos.sql)
- Schema for videos: `id`, `title`, `youtube_id` or video URL, `subject`, `duration`, `published_date`.

#### [MODIFY] [download_history.sql](file:///D:/UPSC%20CLOUD%20PROJECT/backend/database-schema/download_history.sql)
- Schema to log user resource downloads: `id`, `user_id`, `resource_id`, `resource_type` (PYQ/Material), `downloaded_at`.

---

### Component 2: Auth Validation, Route Security & Navigation Alignment
Adjust the registration form to submit fields correctly, ensure dashboard pages require authenticated sessions, and align topbars.

#### [MODIFY] [auth.js](file:///D:/UPSC%20CLOUD%20PROJECT/js/auth.js)
- Modify registration call to send user metadata.
- Implement session checking: if user is logged in, redirect them away from login/register to dashboard.

#### [MODIFY] [dashboard.js](file:///D:/UPSC%20CLOUD%20PROJECT/js/dashboard.js)
- Guard page: Check session. If no session, redirect to `login.html`.
- Dynamically display logged-in user name and last visited timestamp.
- Sync today's study plan checks to Supabase instead of local storage.

#### [MODIFY] [prelims.js](file:///D:/UPSC%20CLOUD%20PROJECT/js/prelims.js) / [mains.js](file:///D:/UPSC%20CLOUD%20PROJECT/js/mains.js) / [interview.js](file:///D:/UPSC%20CLOUD%20PROJECT/js/interview.js)
- Check session. Redirect users if they are not authenticated.

---

### Component 3: Build Missing Strategy & User Interface Pages (HTML, CSS, JS)
Complete the 0-byte placeholders for user profile dashboards, tips pages, and strategy components.

#### [MODIFY] [profile.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/profile.html)
- User profile page UI: shows user details, statistics, registered attempt, language, state, and option to edit fields.

#### [MODIFY] [profile.css](file:///D:/UPSC%20CLOUD%20PROJECT/css/profile.css)
- Custom card grid, premium edit forms, stats widgets, and save button transitions.

#### [MODIFY] [profile.js](file:///D:/UPSC%20CLOUD%20PROJECT/js/profile.js)
- Fetch active profile from `profiles` table in Supabase.
- Validate and update fields via Supabase client when editing.

#### [NEW] [prelims-strategy.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/prelims-strategy.html) / [mains-strategy.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/mains-strategy.html) / [interview-tips.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/interview-tips.html) / [book-recommendations.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/book-recommendations.html) / [video-resources.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/video-resources.html)
- Add structured guidelines, NCERT check-sheets, subject-wise sources, syllabus weightage charts, topper secrets, and YouTube embed panels.

---

### Component 4: dynamic data integration (PYQ & Study Materials)
Connect database queries to load listing content dynamically in the frontend rather than using hardcoded placeholders.

#### [MODIFY] [pyq.js](file:///D:/UPSC%20CLOUD%20PROJECT/js/pyq.js)
- Query `pyqs` table. Dynamically generate the `<tbody>` table rows.
- Hook download button to request file download from Supabase Storage and log in `download_history`.

#### [MODIFY] [studyMaterials.js](file:///D:/UPSC%20CLOUD%20PROJECT/js/studyMaterials.js)
- Query `study_materials` table. Populate subject category lists.
- Hook download buttons to storage URLs.

---

### Component 5: Admin Panel & CRUD Dashboards
Build the admin area to upload PYQs, study materials, and manage users.

#### [MODIFY] [admin-dashboard.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/admin-dashboard.html)
- Layout displaying admin counters (total users, downloads, uploaded materials) and sidebar shortcuts to management pages.

#### [MODIFY] [admin.css](file:///D:/UPSC%20CLOUD%20PROJECT/css/admin.css) / [admin.js](file:///D:/UPSC%20CLOUD%20PROJECT/js/admin.js)
- Route protection checking if user profile role is 'admin'.
- CRUD management scripts.

#### [NEW] [manage-users.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/manage-users.html) / [manage-materials.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/manage-materials.html) / [manage-pyq.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/manage-pyq.html) / [manage-current-affairs.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/manage-current-affairs.html) / [manage-videos.html](file:///D:/UPSC%20CLOUD%20PROJECT/pages/manage-videos.html)
- Specific tables and upload forms to insert/update/delete records dynamically in the corresponding Supabase tables.

---

## Verification Plan

### Automated Tests
- We will test connection parameters in `js/supabaseClient.js`.
- Test validation logic on forms by mocking inputs and capturing success/failure responses.

### Manual Verification
1. **User Sign Up & Profile Integration**:
   - Register a new account on `register.html`.
   - Verify that credentials populate in Supabase Auth and metadata successfully writes to the custom database profiles table.
2. **Protected Route Check**:
   - Attempt to navigate directly to `/pages/dashboard.html` without logging in. Verify redirection to `login.html`.
3. **Admin Access Restrictions**:
   - Attempt to load `/pages/admin-dashboard.html` using a normal user account. Verify that access is blocked and redirects to the standard dashboard.
4. **Download Action Logging**:
   - Click "Download PDF" on `pyq.html`. Verify that a file begins download and a entry is correctly logged to `download_history`.
