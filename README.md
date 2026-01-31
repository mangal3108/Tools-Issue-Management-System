Here is a comprehensive **README.md** file tailored for your project submission to Varsha Tiwari. It highlights the futuristic UI, the full-stack implementation, and how you met every specific requirement.

---

# Tools Issue Management System (Tools OS v2.0)

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

**Developed by Mangal**

Would you like me to help you generate a list of sample "Tools Category" data to populate your inventory for the demo?
