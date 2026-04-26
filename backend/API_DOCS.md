# SaaS Hierarchy API — Documentation

Base URL: `http://localhost:5000`

---

## Table of Contents
1. [Health Check](#health-check)
2. [Admins](#admins)
3. [Supervisors](#supervisors)
4. [Students](#students)
5. [Dropdown APIs](#dropdown-apis)
6. [Error Responses](#error-responses)

---

## Health Check

### `GET /`
Returns API status.

**Response**
```json
{
  "success": true,
  "message": "SaaS Hierarchy API is running 🚀",
  "version": "1.0.0",
  "endpoints": {
    "admins": "/api/admins",
    "supervisors": "/api/supervisors",
    "students": "/api/students",
    "dropdown": "/api/dropdown"
  }
}
```

---

## Admins

### `POST /api/admins` — Create Admin
**Body**
```json
{
  "name": "Alice Johnson",
  "email": "alice@saas.com"
}
```
**Response `201`**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "name": "Alice Johnson",
    "email": "alice@saas.com",
    "createdAt": "2024-05-20T10:00:00.000Z",
    "updatedAt": "2024-05-20T10:00:00.000Z"
  }
}
```

---

### `GET /api/admins` — Get All Admins
**Response `200`**
```json
{
  "success": true,
  "count": 3,
  "data": [
    { "_id": "...", "name": "Alice Johnson", "email": "alice@saas.com", "createdAt": "..." },
    { "_id": "...", "name": "Bob Martinez",  "email": "bob@saas.com",   "createdAt": "..." },
    { "_id": "...", "name": "Carol Williams","email": "carol@saas.com",  "createdAt": "..." }
  ]
}
```

---

### `GET /api/admins/:id` — Get Admin by ID
**Response `200`**
```json
{
  "success": true,
  "data": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "name": "Alice Johnson",
    "email": "alice@saas.com",
    "createdAt": "2024-05-20T10:00:00.000Z"
  }
}
```

---

### `PUT /api/admins/:id` — Update Admin
**Body** *(send only fields to change)*
```json
{
  "name": "Alice J. Updated",
  "email": "alice_new@saas.com"
}
```
**Response `200`**
```json
{
  "success": true,
  "message": "Admin updated successfully",
  "data": { "_id": "...", "name": "Alice J. Updated", "email": "alice_new@saas.com" }
}
```

---

### `DELETE /api/admins/:id` — Delete Admin
> ⚠️ **Cascades** — deletes all Supervisors under this Admin, and all Students under those Supervisors.

**Response `200`**
```json
{
  "success": true,
  "message": "Admin deleted along with 2 supervisor(s) and their students"
}
```

---

## Supervisors

### `POST /api/supervisors` — Create Supervisor
**Body**
```json
{
  "name": "John Smith",
  "email": "john@saas.com",
  "adminId": "664a1b2c3d4e5f6a7b8c9d0e"
}
```
**Response `201`**
```json
{
  "success": true,
  "message": "Supervisor created successfully",
  "data": {
    "_id": "...",
    "name": "John Smith",
    "email": "john@saas.com",
    "adminId": { "_id": "...", "name": "Alice Johnson", "email": "alice@saas.com" },
    "createdAt": "..."
  }
}
```

---

### `GET /api/supervisors` — Get All Supervisors
Optional query param: `?adminId=<id>` to filter by admin.

```
GET /api/supervisors
GET /api/supervisors?adminId=664a1b2c3d4e5f6a7b8c9d0e
```

---

### `GET /api/supervisors/by-admin/:adminId` — Get Supervisors by Admin
**Response `200`**
```json
{
  "success": true,
  "count": 2,
  "admin": { "id": "...", "name": "Alice Johnson" },
  "data": [
    { "_id": "...", "name": "John Smith",   "email": "john@saas.com",   "adminId": { ... } },
    { "_id": "...", "name": "Jane Doe",     "email": "jane@saas.com",   "adminId": { ... } }
  ]
}
```

---

### `GET /api/supervisors/:id` — Get Supervisor by ID

### `PUT /api/supervisors/:id` — Update Supervisor
**Body**
```json
{
  "name": "John Updated",
  "email": "john_new@saas.com",
  "adminId": "664a1b2c3d4e5f6a7b8c9d0f"
}
```

### `DELETE /api/supervisors/:id` — Delete Supervisor
> ⚠️ **Cascades** — deletes all Students under this Supervisor.

**Response `200`**
```json
{
  "success": true,
  "message": "Supervisor deleted along with 4 student(s)"
}
```

---

## Students

### `POST /api/students` — Create Student
**Body**
```json
{
  "name": "Sara Ahmed",
  "phone": "+1-555-0001",
  "email": "sara@example.com",
  "supervisorId": "664a1b2c3d4e5f6a7b8c9d10"
}
```
**Response `201`**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "_id": "...",
    "name": "Sara Ahmed",
    "phone": "+1-555-0001",
    "email": "sara@example.com",
    "supervisorId": {
      "_id": "...",
      "name": "John Smith",
      "email": "john@saas.com",
      "adminId": { "_id": "...", "name": "Alice Johnson", "email": "alice@saas.com" }
    },
    "createdAt": "..."
  }
}
```

---

### `GET /api/students` — Get All Students
Optional query param: `?supervisorId=<id>`

```
GET /api/students
GET /api/students?supervisorId=664a1b2c3d4e5f6a7b8c9d10
```

---

### `GET /api/students/by-supervisor/:supervisorId` — Get Students by Supervisor
**Response `200`**
```json
{
  "success": true,
  "count": 4,
  "supervisor": { "id": "...", "name": "John Smith" },
  "data": [ ... ]
}
```

---

### `GET /api/students/:id` — Get Student by ID

### `PUT /api/students/:id` — Update Student
**Body**
```json
{
  "name": "Sara Ahmed Updated",
  "phone": "+1-555-9999",
  "email": "sara_new@example.com",
  "supervisorId": "664a1b2c3d4e5f6a7b8c9d11"
}
```

### `DELETE /api/students/:id` — Delete Student
**Response `200`**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

## Dropdown APIs

Designed for cascading `<select>` dropdowns in a frontend UI.

### Step 1 — `GET /api/dropdown/admins`
Fetch list of all admins to populate the first dropdown.

**Response `200`**
```json
{
  "success": true,
  "count": 3,
  "data": [
    { "_id": "aaa", "name": "Alice Johnson",  "email": "alice@saas.com"  },
    { "_id": "bbb", "name": "Bob Martinez",   "email": "bob@saas.com"    },
    { "_id": "ccc", "name": "Carol Williams", "email": "carol@saas.com"  }
  ]
}
```

---

### Step 2 — `GET /api/dropdown/supervisors/:adminId`
When user selects an Admin, fetch supervisors under it.

```
GET /api/dropdown/supervisors/aaa
```

**Response `200`**
```json
{
  "success": true,
  "admin": { "id": "aaa", "name": "Alice Johnson" },
  "count": 2,
  "data": [
    { "_id": "s1", "name": "John Smith", "email": "john@saas.com" },
    { "_id": "s2", "name": "Jane Doe",   "email": "jane@saas.com" }
  ]
}
```

---

### Step 3 — `GET /api/dropdown/students/:supervisorId`
When user selects a Supervisor, fetch students under it.

```
GET /api/dropdown/students/s1
```

**Response `200`**
```json
{
  "success": true,
  "supervisor": { "id": "s1", "name": "John Smith" },
  "count": 4,
  "data": [
    { "_id": "st1", "name": "Sara Ahmed",   "email": "sara@example.com",   "phone": "+1-555-0001" },
    { "_id": "st2", "name": "Omar Hassan",  "email": "omar@example.com",   "phone": "+1-555-0002" },
    { "_id": "st3", "name": "Layla Nasser", "email": "layla@example.com",  "phone": "+1-555-0003" },
    { "_id": "st4", "name": "Karim Yusuf",  "email": "karim@example.com",  "phone": "+1-555-0004" }
  ]
}
```

---

## Error Responses

All errors follow a consistent shape:

```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

| Status | Meaning                          | Example trigger                    |
|--------|----------------------------------|------------------------------------|
| `400`  | Bad request / duplicate email    | Email already registered           |
| `404`  | Resource not found               | Invalid ID in URL                  |
| `500`  | Internal server error            | Unexpected exception               |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your MongoDB URI

# 3. Seed the database
npm run seed

# 4. Start the server
npm run dev        # development (nodemon)
npm start          # production
```

---

## Project Structure

```
saas-api/
├── config/
│   └── db.js                   # MongoDB connection
├── controllers/
│   ├── adminController.js      # Admin CRUD logic
│   ├── supervisorController.js # Supervisor CRUD logic
│   ├── studentController.js    # Student CRUD logic
│   └── dropdownController.js  # Cascading dropdown logic
├── models/
│   ├── Admin.js
│   ├── Supervisor.js
│   └── Student.js
├── routes/
│   ├── adminRoutes.js
│   ├── supervisorRoutes.js
│   ├── studentRoutes.js
│   └── dropdownRoutes.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── seed.js                     # Seed script (3 admins, 6 supervisors, 24 students)
└── server.js                   # Entry point
```
