# UPSC Cloud Portal

A comprehensive, full-featured web portal for UPSC Civil Services Examination preparation — built with **HTML, CSS, JavaScript** and powered by **Supabase** (Auth, Database, Storage).

---

## 🌟 Features

### Student Portal
- **Dashboard** — Personalized welcome, quick access cards, study progress overview
- **Prelims & Mains Pages** — Subject-wise syllabus breakdowns, strategy guides
- **Interview Tips** — Personality test preparation resources
- **Previous Year Questions (PYQs)** — Downloadable PDFs with year & stage filters
- **Study Materials** — Category-wise downloadable notes and reference PDFs
- **Video Lectures** — YouTube video gallery embedded dynamically from database
- **Exam Calendar** — Official UPSC timeline with important dates
- **Book Recommendations** — Curated reference book lists by subject
- **Profile Management** — Dynamic avatar upload, personal details, download history
- **Current Affairs** — Daily news and analysis

### Admin Panel
- **Admin Dashboard** — Statistics (users, PYQs, materials, videos, downloads)
- **Upload Resources** — Publish PYQs (PDF), Study Materials (PDF), Video Lectures (YouTube URL)
- **Catalog Management** — View, search, and delete published resources
- **User Download Audit Trail** — Track who downloaded what and when

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage, RLS) |
| **Fonts** | Google Fonts (Poppins) |
| **Icons** | Font Awesome 6 |
| **Hosting** | Static — deploy anywhere (Netlify, Vercel, GitHub Pages) |

---

## 📁 Project Structure

```
UPSC CLOUD PROJECT/
├── index.html                  # Landing page
├── assets/
│   └── images/                 # Hero images, avatars, backgrounds
├── css/
│   ├── style.css               # Landing page styles
│   ├── auth.css                # Login & Register styles
│   ├── dashboard.css           # Student dashboard styles
│   ├── admin.css               # Admin panel styles
│   ├── profile.css             # Profile page styles
│   ├── resources.css           # Study materials, PYQs, videos, books
│   ├── prelims.css             # Prelims page styles
│   ├── mains.css               # Mains page styles
│   ├── interview.css           # Interview page styles
│   ├── pyq.css                 # PYQ page styles
│   └── exam-calendar.css       # Exam calendar styles
├── js/
│   ├── supabaseClient.js       # Supabase initialization (URL + Anon Key)
│   ├── app.js                  # Landing page logic
│   ├── auth.js                 # Login & Register authentication
│   ├── dashboard.js            # Dashboard dynamic rendering
│   ├── profile.js              # Profile management & avatar upload
│   ├── admin.js                # Admin panel (upload, catalog, stats, audit)
│   ├── pyq.js                  # PYQ filtering, rendering & downloads
│   ├── studyMaterials.js       # Study materials catalog & downloads
│   ├── videoResources.js       # Dynamic YouTube video gallery
│   ├── prelims.js              # Prelims page interactions
│   ├── mains.js                # Mains page interactions
│   ├── interview.js            # Interview page interactions
│   └── examCalendar.js         # Exam calendar logic
├── pages/
│   ├── login.html              # Login page
│   ├── register.html           # Registration page
│   ├── dashboard.html          # Student dashboard
│   ├── profile.html            # Profile management
│   ├── admin-dashboard.html    # Admin panel
│   ├── pyq.html                # Previous Year Questions
│   ├── study-materials.html    # Study Materials
│   ├── video-resources.html    # Video Lectures
│   ├── prelims.html            # Prelims preparation
│   ├── mains.html              # Mains preparation
│   ├── interview.html          # Interview preparation
│   ├── exam-calendar.html      # UPSC Exam Calendar
│   ├── book-recommendations.html # Book recommendations
│   └── interview-tips.html     # Interview tips
├── backend/
│   ├── database-schema/        # SQL schema files for all Supabase tables
│   └── documentation/          # Additional project documentation
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- A [Supabase](https://supabase.com) account (free tier works)
- A modern web browser
- (Optional) A local HTTP server like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/upsc-cloud-portal.git
cd upsc-cloud-portal
```

### 2. Set Up Supabase
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run all SQL files from `backend/database-schema/` in your Supabase SQL Editor:
   - `users.sql` — Profiles table & triggers
   - `pyqs.sql` — Previous Year Questions table
   - `study_materials.sql` — Study Materials table
   - `videos.sql` — Video Lectures table
   - `download_history.sql` — Download audit log
   - `current_affairs.sql` — Current Affairs table
3. Create the following **Storage Buckets** (set to Public):
   - `avatars` — Profile pictures
   - `pyqs` — Question paper PDFs
   - `study-materials` — Study material PDFs
4. Configure **Row Level Security (RLS)** policies on each bucket as needed

### 3. Configure Supabase Credentials
Edit `js/supabaseClient.js` and replace with your own project credentials:
```javascript
const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";
```

### 4. Run Locally
Open `index.html` with a local server (e.g., VS Code Live Server extension) or simply open it in a browser.

---

## 🗄️ Database Schema

| Table | Description |
|-------|------------|
| `profiles` | User profiles (name, email, avatar, role) |
| `pyqs` | Previous year question papers (year, subject, paper_type, file_url) |
| `study_materials` | Study material PDFs (title, subject, category, file_url) |
| `videos` | YouTube video lectures (title, subject, youtube_id, duration) |
| `download_history` | Audit log of all resource downloads |
| `current_affairs` | Daily current affairs articles |

---

## 🚀 Deployment

This is a **static site** — no build step required. Deploy to:
- **GitHub Pages** — Push and enable Pages in repo settings
- **Netlify** — Drag & drop the project folder
- **Vercel** — Import the GitHub repo

> **Important:** Before deploying, ensure your Supabase credentials in `supabaseClient.js` are correct and your RLS policies are configured.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.
