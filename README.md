# 🚀 ZigTask – A Task Management Web App (Zigvy Interview Homework)
`ZigTask` is a full-stack task management web application built as part of the Zigvy interview homework. It features modern authentication, intuitive task organization with drag-and-drop interaction, a responsive dark/light mode UI, and enhanced UX with real-time filtering and a reset password system.

![ZigTask Demo](https://img.shields.io/badge/Status-Completed-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![NestJS](https://img.shields.io/badge/NestJS-10.x-e0234e)

----
# 📋 The project includes:

- A NestJS + TypeORM backend (PostgreSQL) with complete authentication, CRUD operations for tasks, class-validator integration, and Swagger API docs.

- A React + TypeScript frontend styled with TailwindCSS, implementing a Kanban-style dashboard with drag-and-drop (using DnD Kit), mobile responsiveness, dark mode toggle, and real-time search with date filtering.


# Extra features including:

🔒 JWT-based sign-up/sign-in.

✅ "Remember Me" login persistence.

🔁 Reset password via email using Nodemailer.

⚙️ A reusable modal form for task creation/editing.

🔍 Search tasks by keyword or due date.

🎨 Optimistic drag-and-drop task movement across status columns.

🌓 Dark mode toggle (remembered in local storage).


# 🧰 Tech Stack
| Layer    | Tech Used                                             |
| -------- | ----------------------------------------------------- |
| Backend  | NestJS, TypeORM, PostgreSQL, JWT, Nodemailer          |
| Frontend | React, TypeScript, TailwindCSS, React Router, DnD Kit |
| Tools    | Swagger, Axios, Prettier, ESLint                      |



# 🛠️ Setup Instructions
## 📦 Backend (NestJS)

#### **Environment Configuration**
```env
# Database
DB_HOST=localhost

# JWT Secret (generate a secure random string)
JWT_SECRET=zigtask-secret

# Email Configuration (optional - forget password)
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password

# Server Configuration
PORT=3000
```
#### **Start Backend Server**
```bash
# Navigate to right folder
cd zigtask-api

# Install all dependencies
npm install

# Run server
npm run start:dev
```

**✅ Backend will be running on:** `http://localhost:3000`

## 💻 Frontend (React + TS)
#### **Start Frontend Development Server**
```bash
# Navigate to the right folder
cd zigtask-client

# Install all dependencies
npm install

# Run server
npm run dev
```

**✅ Frontend will be running on:** `http://localhost:5173`

---

# 📚 API Documentation

### **🔗 Swagger UI**

You can explore and test the API live at: `http://localhost:3000/api`

The API is documented using **Swagger (OpenAPI 3.0)** and includes:
-🧾 Detailed endpoint definitions

-🔐 JWT Authentication support

-📥 Request & response schemas

-⚙️ Try-it-out support for real-time testing

### **🧭 Available Endpoints**

#### **🔐 Authentication**
```
| Method | Endpoint                | Description                            |
| ------ | ----------------------- | -------------------------------------- |
| `POST` | `/auth/signup`          | Register a new user                    |
| `POST` | `/auth/signin`          | Authenticate and receive a JWT token   |
| `POST` | `/auth/forgot-password` | Send a reset password email            |
| `POST` | `/auth/reset-password`  | Reset password using the emailed token |

```

#### **🙋‍♂️ Users**
```
| Method | Endpoint     | Description                 |
| ------ | ------------ | --------------------------- |
| `GET`  | `/users/:id` | Retrieve user details by ID |

```

#### **✅ Tasks**
```
| Method   | Endpoint     | Description                                |
| -------- | ------------ | ------------------------------------------ |
| `POST`   | `/tasks`     | Create a new task                          |
| `GET`    | `/tasks`     | Get all tasks (with search/filter support) |
| `PATCH`  | `/tasks/:id` | Update a task (title, desc, status, etc.)  |
| `DELETE` | `/tasks/:id` | Delete a task by ID                        |

```
---

# 🔐 Auth Flow
- Sign up, login with JWT

- "Remember Me" stores the email

- Reset password sends link to email via nodemailer

- Link redirects user to /reset-password?token=... with validation and password update


# 💡 Design Decisions & Trade-Offs
- State Management: Local state was sufficient; avoided Redux for simplicity.

- Drag-and-Drop: Used @dnd-kit for customizable and mobile-friendly interaction.

- Dark Mode: Managed with Tailwind’s dark class and localStorage.

- Reusable Modal: Task form modal is shared for both create and edit actions.

- Validation: Used class-validator on backend DTOs and manual form validation on frontend.

# 📌 Submission Notes
- Commit history reflects step-by-step progress and features (June 20–23).

- All features tested locally.

- PR submitted to original repository as required.


## ✅ Completed Features
 - Sign-up / Sign-in

 - JWT Auth with validation

 - Task CRUD (Title, Desc, Due Date, Status)

- Drag-and-drop status update

 - Filter by title and date

- Dark mode toggle

 - Forgot/reset password via email

 - Mobile responsive UI

- Swagger API docs

---
# 🙋‍♂️ Author

Le Hoang Tuan - [@tuannho0802](https://github.com/tuannho0802)

