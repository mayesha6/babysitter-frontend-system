# 🧸 BebiCare - Premium Babysitter & Childcare Platform Frontend

BebiCare is a modern, premium, and interactive web application designed to connect busy parents with qualified, verified local babysitters. The frontend is built using **Next.js (App Router)** and **Vanilla CSS** to deliver a custom, playful, and high-fidelity user interface matching the Bebicare theme aesthetics (playful pastels, rounded borders, wave dividers, and smooth micro-animations).

---

## 🚀 Key Features

### 1. 🌐 Public & Visitor Pages
*   **Aesthetic Landing Page**: Premium hero section, interactive tabs outlining "How it Works" for both parents and sitters, featured top-rated verified sitters, and parent testimonial blocks.
*   **Search Directory**: Advanced filters for location, hourly rates slider, gender, and job employment types (Full-Time, Part-Time, Weekend).
*   **Sitter Profile Details**: Deep-dive profile presenting a biological bio, years of experience, skill chips, language tags, weekly availability hours table, direct booking form, and star-rating reviews left by other parents.

### 2. 👨👩👧 Parent Dashboard
*   **Dashboard Overview**: Key counters showing active bookings, posted jobs, and recent contract lists.
*   **Create Job Post**: Custom multi-field forms to publish childcare jobs (title, budget, children age/gender, job type, skills, dates, and times).
*   **Job & Candidate Manager**: Audit applicants who applied for jobs, review their details, and accept/reject them (accepting automatically creates a booking contract).
*   **Bookings & Stripe Payments**: Complete invoices, trigger simulated Stripe card checkouts, and submit parent star-reviews.

### 3. 👶 Babysitter Dashboard
*   **Earnings Overview**: Earnings statistics track completed transactions and pending payouts.
*   **Browsing Feed**: Filterable jobs feed posted by parents with one-click applications (locked for unverified sitters).
*   **Booking Schedules**: Accept/decline direct parent hire requests and complete ongoing child care duties.
*   **Document Verification Form**: Upload NID number, front/back images, a selfie, and police clearance certificate to seek platform verification badges.

### 4. 🛡️ Admin Dashboard
*   **Admin Statistics**: Revenue commissions calculations and user counts charts.
*   **Verification requests Panel**: Preview uploaded sitter documents in high-resolution, check credentials, and approve/reject profiles.
*   **User Manager**: Full directory list of users, with one-click active actions to block or unblock accounts.
*   **Commission Audit Logs**: Transaction ledger audits displaying timestamps, payment amounts, and estimation commissions.

### 5. 💬 Real-Time Socket Chat
*   **Integrated Inbox**: Unified chat interface syncing thread listings and live messaging between parents and babysitters over Websockets.

---

## 🛠️ Technical Stack

*   **Framework**: Next.js 16 (App Router)
*   **UI Library**: React 19
*   **Styling**: Custom Vanilla CSS (centralized in `src/app/globals.css`)
*   **Icons**: Lucide React
*   **API Connection**: Axios (with local token request interceptors)
*   **Real-time sync**: Socket.io Client

---

## 📁 Project Structure

```text
babysitter-frontend/
├── src/
│   ├── app/
│   │   ├── admin-dashboard/   # Admin Control Board
│   │   ├── auth/              # Auth pages (Login, Register, OTP Verify, Forgot)
│   │   ├── chat/              # Websocket Live Chat room
│   │   ├── parent-dashboard/  # Parent job manager & bookings payments
│   │   ├── search/            # Filterable sitter directory grid
│   │   ├── sitter-dashboard/  # Sitter earnings tracker & doc verification uploads
│   │   ├── sitter-profile/    # Public profile page & booking forms
│   │   ├── globals.css        # Central Theme variables, classes & animations
│   │   ├── layout.js          # App layout wrapping the AppProvider
│   │   └── page.js            # Landing Home Page
│   │
│   ├── components/
│   │   ├── Header.jsx         # Navigation bar with notification alerts dropdown
│   │   ├── Footer.jsx         # Cloud-wave decorated footer
│   │   ├── SitterCard.jsx     # Reusable search result item card
│   │   └── PaymentModal.jsx   # Simulated Stripe card checkout pop-up
│   │
│   ├── context/
│   │   └── AppContext.jsx     # Session, Socket connections, and sandbox state
│   │
│   └── services/
│       └── api.js             # Axios client configuration
```

---

## ⚡ Setup & Installation

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org) installed on your machine.

### 2. Install dependencies
Run the installation command in your project folder:
```bash
npm install
```

### 3. Backend Alignment
This frontend connects directly to the Express/MongoDB backend. Ensure your backend server is running on **`http://localhost:5000`** so that the REST APIs and Websockets function properly.

### 4. Running the Development Server
Start the Next.js local server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) or [http://localhost:3000](http://localhost:3000) (depending on port configuration) in your browser to view the application.

---

## 🔧 Developer Sandbox Switcher

To make testing the hiring loops easy, a **Developer Sandbox Switcher** is included at the top of the header bar. You can click to log in as specific seeded test roles instantly:
*   **Admin**: Logs in as the admin (`super@gmail.com` / `12345678`) to review documents.
*   **Parent**: Logs in as the parent (`parent@gmail.com` / `Password@123`) to post jobs.
*   **Sitter**: Logs in as the sitter (`sitter@gmail.com` / `Password@123`) to apply to feeds.
