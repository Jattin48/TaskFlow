# TaskFlow - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require JWT token in header:

```
Authorization: Bearer <token>
```

## Authentication Endpoints

### Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login User
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Get Current User
```
GET /auth/me
```

**Headers:** Requires Bearer token

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "teams": [],
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

## Project Endpoints

### List Projects
```
GET /projects
```

**Headers:** Requires Bearer token

**Response:**
```json
{
  "success": true,
  "projects": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "My Project",
      "description": "Project description",
      "owner": { "_id": "...", "name": "John Doe" },
      "members": [],
      "status": "active",
      "color": "#3b82f6",
      "icon": "📋",
      "progress": 50,
      "dueDate": "2024-12-31T00:00:00Z",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Create Project
```
POST /projects
```

**Headers:** Requires Bearer token

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "color": "#3b82f6",
  "icon": "📋"
}
```

**Response:**
```json
{
  "success": true,
  "project": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "New Project",
    "description": "Project description",
    "owner": { "_id": "...", "name": "John Doe" },
    "color": "#3b82f6",
    "icon": "📋",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### Get Project
```
GET /projects/:id
```

**Headers:** Requires Bearer token

**Response:**
```json
{
  "success": true,
  "project": { /* project object */ }
}
```

### Update Project
```
PUT /projects/:id
```

**Headers:** Requires Bearer token

**Request Body:**
```json
{
  "name": "Updated Project",
  "description": "New description",
  "status": "active",
  "progress": 60
}
```

### Delete Project
```
DELETE /projects/:id
```

**Headers:** Requires Bearer token

**Response:**
```json
{
  "success": true,
  "message": "Project deleted"
}
```

### Add Team Member
```
POST /projects/:id/members
```

**Headers:** Requires Bearer token

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439013",
  "role": "member"
}
```

## Task Endpoints

### List Tasks
```
GET /projects/:projectId/tasks
```

**Headers:** Requires Bearer token

**Response:**
```json
{
  "success": true,
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "title": "Task title",
      "description": "Task description",
      "project": "507f1f77bcf86cd799439011",
      "assignee": { "_id": "...", "name": "User" },
      "creator": { "_id": "...", "name": "Creator" },
      "status": "todo",
      "priority": "high",
      "dueDate": "2024-02-28T00:00:00Z",
      "tags": ["bug", "urgent"],
      "subtasks": [],
      "estimatedHours": 4,
      "actualHours": 2
    }
  ]
}
```

### Create Task
```
POST /projects/:projectId/tasks
```

**Headers:** Requires Bearer token

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "priority": "high",
  "dueDate": "2024-02-28",
  "tags": ["feature"]
}
```

**Response:**
```json
{
  "success": true,
  "task": { /* task object */ }
}
```

### Get Task
```
GET /projects/:projectId/tasks/:id
```

**Headers:** Requires Bearer token

### Update Task
```
PUT /projects/:projectId/tasks/:id
```

**Headers:** Requires Bearer token

**Request Body:**
```json
{
  "title": "Updated title",
  "status": "in-progress",
  "priority": "medium",
  "assignee": "507f1f77bcf86cd799439013"
}
```

### Delete Task
```
DELETE /projects/:projectId/tasks/:id
```

**Headers:** Requires Bearer token

### Add Subtask
```
POST /projects/:projectId/tasks/:id/subtasks
```

**Headers:** Requires Bearer token

**Request Body:**
```json
{
  "title": "Subtask title"
}
```

### Update Subtask
```
PUT /projects/:projectId/tasks/:id/subtasks/:subtaskId
```

**Headers:** Requires Bearer token

**Request Body:**
```json
{
  "title": "Updated subtask",
  "completed": true
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to update this project"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Project not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error message"
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'
```

### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Project","description":"Test"}'
```

## Rate Limiting

Currently no rate limiting. Recommended to add:
- 100 requests per minute per IP
- 1000 requests per hour per user

## Pagination

Future implementation:
```
GET /projects?page=1&limit=10
```

## Filtering

Future implementation:
```
GET /projects?status=active&sort=-createdAt
```
