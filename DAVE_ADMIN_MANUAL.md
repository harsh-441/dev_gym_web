# PARSHURAM FITNESS GYM — OWNER & ADMIN OPERATING MANUAL (FOR DAVE)

**Owner & Master Coach**: Dave  
**Platform**: Centralized Admin Dashboard (`/admin`)

Welcome Dave! This operating guide explains how you can manage your entire digital gym ecosystem — website, members, staff shifts, leave requests, workout guides, diet plans, YouTube videos, and entry QR codes — directly from your dashboard without writing a single line of code.

---

## 1. Quick Access & Logging In

1. Open your browser and visit: `http://localhost:3000/auth/login` (or your live production domain).
2. Under **"One-Click Sign-In"**, tap **Dave (Super Admin / Owner)**.
3. You will be taken immediately to your **Central Admin Overview** (`/admin`).

---

## 2. Managing the Rotating QR Attendance Code (Front Desk Turnstile)

Attendance is **100% free** for all authorized members and staff.

1. Navigate to **Attendance & QR** (`/admin/attendance`) or look at the live widget on your **Overview** page.
2. The system generates an active, rotating QR code with an expiration window (default: 60 seconds).
3. **Displaying for Check-Ins**:
   - Keep this screen visible on an iPad, tablet, or monitor at your front desk.
   - Members scan this code using their **Member Mobile App** to log their daily gym visit.
   - Employees scan this code using their **Employee Mobile App** to clock in and clock out of shifts.
4. **Preventing Fraud / Forwarded Screenshots**:
   - The QR code token rotates periodically.
   - The server strictly prevents duplicate check-ins on the same day for members.
5. **Manual Check-In Fallback**:
   - If a member forgets their phone or runs out of battery, tap **"Manual Correction"** in the Attendance table, enter the time, and record your administrative reason in the audit log.

---

## 3. Reviewing & Approving Employee Leave Requests

1. Navigate to **Leave Applications** (`/admin/leaves`).
2. You will see a list of all staff leave submissions (Pending, Approved, Rejected).
3. When an employee (such as Coach Vikram or Coach Priya) applies for leave:
   - Click **"Review Request"**.
   - Review their dates and stated reason.
   - Enter an optional note (e.g., *"Approved. Please coordinate evening shift with Vikram"*).
   - Tap **"Approve Leave"** or **"Reject Leave"**.
4. The employee receives an instant update on their mobile application with your note.

---

## 4. Managing Members (Module A)

1. Navigate to **Members** (`/admin/members`).
2. **Add a Member**: Tap **"+ Add New Member"**, enter their full name, email, phone, biometric baseline (height/weight), and fitness goal.
3. **Deactivate / Activate**: Tap the status pill (`Active` / `Inactive`) to freeze or reactivate an account.
4. **View History**: Tap **"View Logs"** to see total recorded visits and weight progression.

---

## 5. Managing Staff & Trainers (Module B)

1. Navigate to **Employees & Staff** (`/admin/employees`).
2. Tap **"+ Add Staff Member"** to create a login for a new trainer or front desk associate.
3. Assign their role (`Trainer` or `Employee/Operations`), department, and designation.
4. View shift logs and work schedules.

---

## 6. Updating Prices & Membership Plans (Module F)

1. Navigate to **Membership Plans** (`/admin/memberships`).
2. **No Developer Needed**:
   - Click **"Edit Price & Details"** on any plan (Monthly Warrior, Quarterly Discipline, Annual Divine Elite).
   - Change the price in ₹ INR, adjust the duration, or modify the feature list.
   - Tap **"Save Changes"**. The updated prices and perks update immediately across the website and apps.

---

## 7. Adding Exercises & YouTube Workout Videos (Module E)

1. Navigate to **Content & Exercises** (`/admin/content`).
2. **Add a Movement**: Tap **"Add New Exercise"**, pick the muscle group (Chest, Legs, Back, etc.), specify equipment, and enter your form checklist cues.
3. **Add a YouTube Video**: Tap **"Add YouTube URL"**, paste any YouTube link, provide a title and category (e.g., *Compound Power*, *Form & Technique*), and save. The video embed appears instantly in the public video hub.

---

## 8. Managing Prospective Member Leads (Module G)

1. Navigate to **Prospective Enquiries** (`/admin/enquiries`).
2. Every time a visitor fills out the website contact form, their contact number, email, and preferred program appear here.
3. Tap **"Update"** to mark them as `Contacted` or `Converted`, and write notes from your follow-up phone call.

---

## 9. Updating Gym Address, Phone, & Operating Hours (Module H)

1. Navigate to **System Settings** (`/admin/settings`).
2. You can update your official gym phone number, email address, physical address, and weekday/weekend operating hours at any time.
3. Hit **"Save System Settings"** to publish across the footer, contact page, and mobile apps.
