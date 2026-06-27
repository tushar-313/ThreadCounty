# ThreadCounty API Documentation

Base URL: `http://localhost:8000` (development) or your Railway/Render deployment URL.

## Authentication

All protected endpoints require a Bearer token from Supabase Auth:

```
Authorization: Bearer <supabase_access_token>
```

---

## Endpoints

### Health Check

```
GET /
GET /health
```

**Response:** `{ "status": "healthy" }`

---

### Uploads

#### Upload Fabric Image
```
POST /api/uploads/
Content-Type: multipart/form-data
```

**Body:** `file` (JPG, JPEG, PNG, max 10MB)

**Response:**
```json
{
  "upload": {
    "id": "uuid",
    "file_name": "fabric.jpg",
    "file_url": "https://...",
    "status": "completed"
  },
  "report": {
    "id": "uuid",
    "thread_density": 78.5,
    "warp_count": 82,
    "weft_count": 75,
    "fabric_type": "Plain Weave Cotton",
    "confidence_score": 0.94,
    "ai_suggestions": ["..."]
  }
}
```

#### List Uploads
```
GET /api/uploads/
```

#### Delete Upload
```
DELETE /api/uploads/{upload_id}
```

---

### Reports

#### List Reports
```
GET /api/reports/?search=cotton&fabric_type=Plain Weave Cotton&limit=20&offset=0
```

#### Get Report
```
GET /api/reports/{report_id}
```

#### Delete Report
```
DELETE /api/reports/{report_id}
```

#### Download Report
```
GET /api/reports/{report_id}/download
```

**Response:** `{ "content": "...", "filename": "threadcounty-report-abc123.txt" }`

---

### Users

#### Get Profile
```
GET /api/users/me
```

#### Update Profile
```
PATCH /api/users/me
```

**Body:** `{ "full_name": "John Doe", "avatar_url": "https://..." }`

#### Get Activity
```
GET /api/users/me/activity
```

#### Get Notifications
```
GET /api/users/me/notifications
```

#### Mark Notification Read
```
PATCH /api/users/me/notifications/{notification_id}/read
```

---

### Dashboard

#### Get Dashboard Stats
```
GET /api/dashboard/stats
```

**Response:**
```json
{
  "total_uploads": 5,
  "total_reports": 5,
  "storage_used_mb": 12.5,
  "storage_limit_mb": 100,
  "recent_reports": [],
  "subscription_plan": "free"
}
```

---

### Admin (requires admin role)

#### Platform Stats
```
GET /api/admin/stats
```

#### List Users
```
GET /api/admin/users
```

#### Update User Role
```
PATCH /api/admin/users/{user_id}/role?role=admin
```

#### List All Uploads
```
GET /api/admin/uploads
```

#### Delete Upload (Admin)
```
DELETE /api/admin/uploads/{upload_id}
```

#### List Contact Messages
```
GET /api/admin/messages
```

---

### Contact

#### Submit Contact Form
```
POST /api/admin/contact
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Enterprise Inquiry",
  "message": "I'd like to learn more..."
}
```

---

## Error Responses

```json
{
  "detail": "Error message"
}
```

| Status | Description |
|--------|-------------|
| 400 | Bad request / validation error |
| 401 | Unauthorized |
| 403 | Forbidden (admin required) |
| 404 | Not found |
| 500 | Server error |
