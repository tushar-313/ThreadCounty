# ThreadCounty Database Schema

## Overview

ThreadCounty uses Supabase (PostgreSQL) with Row Level Security (RLS) for data protection.

## Entity Relationship Diagram

```
auth.users (Supabase Auth)
    │
    └── profiles (1:1)
            │
            ├── uploads (1:N)
            │       │
            │       └── reports (1:1)
            │
            ├── subscriptions (1:N)
            ├── notifications (1:N)
            └── activity_logs (1:N)

contact_messages (standalone, public insert)
```

## Tables

### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK, FK → auth.users) | User ID |
| email | TEXT | User email |
| full_name | TEXT | Display name |
| avatar_url | TEXT | Profile picture URL |
| role | TEXT | `user` or `admin` |
| subscription_plan | TEXT | `free`, `student`, `professional`, `enterprise` |
| storage_used_mb | DECIMAL | Storage consumed |
| storage_limit_mb | DECIMAL | Storage limit based on plan |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### uploads
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Upload ID |
| user_id | UUID (FK → profiles) | Owner |
| file_name | TEXT | Original filename |
| file_url | TEXT | Storage URL |
| file_size_kb | INTEGER | File size in KB |
| mime_type | TEXT | MIME type |
| status | TEXT | `pending`, `processing`, `completed`, `failed` |
| created_at | TIMESTAMPTZ | Upload timestamp |

### reports
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Report ID |
| upload_id | UUID (FK → uploads) | Source upload |
| user_id | UUID (FK → profiles) | Owner |
| thread_density | DECIMAL | Threads per inch |
| warp_count | INTEGER | Warp thread count |
| weft_count | INTEGER | Weft thread count |
| fabric_type | TEXT | Detected fabric type |
| confidence_score | DECIMAL | AI confidence (0-1) |
| ai_suggestions | JSONB | Array of suggestions |
| raw_analysis | JSONB | Full AI output |
| created_at | TIMESTAMPTZ | Analysis timestamp |

### subscriptions
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Subscription ID |
| user_id | UUID (FK → profiles) | Subscriber |
| plan | TEXT | Plan tier |
| status | TEXT | `active`, `cancelled`, `expired` |
| started_at | TIMESTAMPTZ | Start date |
| expires_at | TIMESTAMPTZ | Expiration date |

### contact_messages
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Message ID |
| name | TEXT | Sender name |
| email | TEXT | Sender email |
| subject | TEXT | Message subject |
| message | TEXT | Message body |
| status | TEXT | `new`, `read`, `replied` |
| created_at | TIMESTAMPTZ | Submission timestamp |

### notifications
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Notification ID |
| user_id | UUID (FK → profiles) | Recipient |
| title | TEXT | Notification title |
| message | TEXT | Notification body |
| type | TEXT | `info`, `success`, `warning`, `error` |
| read | BOOLEAN | Read status |
| created_at | TIMESTAMPTZ | Creation timestamp |

### activity_logs
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Log ID |
| user_id | UUID (FK → profiles) | User |
| action | TEXT | Action performed |
| details | JSONB | Additional context |
| created_at | TIMESTAMPTZ | Timestamp |

## Storage

- **Bucket:** `fabric-images`
- **Path pattern:** `{user_id}/{upload_id}/{filename}`
- **Access:** User-scoped upload/delete, public read

## Setup

Run the migration in Supabase SQL Editor:

```bash
# File: supabase/migrations/001_initial_schema.sql
```

## Making a User Admin

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```
