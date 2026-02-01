
# Tools Issue Management System

A futuristic, high-fidelity web application built to streamline the registration of mechanics and the management of industrial tool inventories. This system features a dual-role architecture for administrators and technical personnel.

## 🚀 Key Features

### Admin Console (Root_Admin)

* **Personnel Sync**: Register mechanics with full profile details: Name, Email, Mobile, Password, Level, and Profile Picture.
* **Strict Validation**:
* Unique Email and 10-digit Mobile Number verification.
* Alphanumeric password enforcement with special character validation.
* Classification by expertise: Expert, Medium, New Recruit, and Trainee.


* **Asset Matrix**: Manage tool inventory including title, category (Wrench, Hammer, etc.), image, and stock quantity.
* **Deployment Interface**: Issue specific tool quantities to mechanics in real-time.
* **Intelligence Report**: A user-wise report showing the total number of tools issued to each individual.

### Mechanic Hub (User_Portal)

* **Inventory Matrix**: View the live global inventory of available tools.
* **Active Custody**: View all assets currently issued to the logged-in mechanic.
* **Recovery Interface**: Return issued tools to the system, which automatically restores global inventory stock.

### Common Features

* **Access Control**: Futuristic login portal with role-based routing.
* **Session Termination**: Secure logout functionality for both roles.

## 🛠️ Tech Stack

* **Frontend**: Vue.js 3, Bootstrap 5, Orbitron Typography.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB Atlas (Cloud).
* **Security**: Bcrypt.js for password hashing.

## ⚙️ Installation & Setup

1. **Clone the Repository**:
```bash
git clone <repository-url>
cd tool-system

```


2. **Install Dependencies**:
```bash
npm install

```


3. **Environment Configuration**:
Create a `.env` file in the root directory and add your MongoDB Atlas URI:
```text
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/tool_management

```


4. **Seed the Initial Admin**:
Because the system starts with an empty database, run the seed script to create your first Admin account:
```bash
node seedAdmin.js

```


5. **Run the Server**:
```bash
node server.js

```


The system will be live at `http://localhost:5000`.

## 🛡️ Default Credentials (Post-Seeding)

* **Role**: Admin
* **Email**: `admin@system.com`
* **Password**: `Admin@123`

---
## 📦 Deployment (Netlify) ✅

This repository includes a `netlify.toml` that publishes the static frontend from `tool-system/public`. No build step is required because the frontend is a static site using CDN assets.

**Netlify (UI)**
1. Go to https://app.netlify.com, sign in and click **Add new site → Import an existing project**.
2. Connect to GitHub and select repository `mangal3108/Tools-Issue-Management-System`, branch `main`.
3. Before deploying, add the required environment variable (Site settings → Build & deploy → Environment):
   - `MONGO_URI` — your MongoDB connection string (e.g. `mongodb+srv://<user>:<pw>@cluster...`)
4. Confirm:
   - **Build command:** leave blank or use `echo 'No build required'`
   - **Publish directory:** `tool-system/public`
5. Click **Deploy** and open your site when complete.

**Netlify CLI**
- Install: `npm install -g netlify-cli`
- Login: `netlify login`
- Deploy (production): `netlify deploy --prod --dir=tool-system/public`

**Note on API routing**
- The repo includes a Netlify Function at `netlify/functions/server.js` that wraps the Express API and a redirect so frontend calls to `/api/*` are proxied to the function.
- Ensure `MONGO_URI` is set on Netlify (Site settings → Build & deploy → Environment) so the API can connect to your database.

**Badge (placeholder)**
[![Netlify Status](https://api.netlify.com/api/v1/badges/<YOUR_BADGE_ID>/deploy-status)](https://app.netlify.com/sites/<YOUR_SITE>/deploys)

---

## 🧪 Deploy verification (quick checks)
After deploying, run these commands to verify the frontend and backend are healthy:

```bash
# 1) Check the static site
curl -I https://<YOUR_SITE>.netlify.app

# 2) Health endpoint (Netlify Function)
curl https://<YOUR_SITE>.netlify.app/api/health

# 3) Check tools API
curl https://<YOUR_SITE>.netlify.app/api/admin/tools
```

If any command returns a 5xx or a connection error, check **Site → Functions → server → Logs** in the Netlify UI for error details.

---
**Developed by Mangal**

