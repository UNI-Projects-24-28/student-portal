# Student Attendance Portal - API Documentation

This document provides the API specification for the Student Attendance Portal backend. The frontend is designed to work with a RESTful API and includes a mock data layer for development.

## Base URL

```
http://localhost:5000/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## API Endpoints

### Authentication

#### POST /auth/login
Login user with email and password.

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "password"
}
```

**Response (200 OK):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "student@university.edu",
    "full_name": "Test Student",
    "student_id": "STU001",
    "department": "Computer Science",
    "role": "student",
    "phone": "+1234567890",
    "address": "123 Main St"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid email or password"
}
```

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "newstudent@university.edu",
  "password": "password123",
  "full_name": "John Doe",
  "student_id": "STU002",
  "department": "Computer Science",
  "role": "student"
}
```

**Response (201 Created):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 2,
    "email": "newstudent@university.edu",
    "full_name": "John Doe",
    "student_id": "STU002",
    "department": "Computer Science",
    "role": "student"
  }
}
```

### Classes

#### GET /classes
Get all classes.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Introduction to Computer Science",
    "code": "CS101",
    "schedule": "Mon, Wed 9:00 AM",
    "instructor": "Dr. Smith"
  }
]
```

#### POST /classes
Create a new class (admin only).

**Request Body:**
```json
{
  "name": "Advanced Algorithms",
  "code": "CS401",
  "schedule": "Tue, Thu 2:00 PM",
  "instructor": "Dr. Johnson"
}
```

**Response (201 Created):**
```json
{
  "id": 4,
  "name": "Advanced Algorithms",
  "code": "CS401",
  "schedule": "Tue, Thu 2:00 PM",
  "instructor": "Dr. Johnson"
}
```

#### GET /classes/:id
Get a specific class by ID.

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Introduction to Computer Science",
  "code": "CS101",
  "schedule": "Mon, Wed 9:00 AM",
  "instructor": "Dr. Smith"
}
```

#### PUT /classes/:id
Update a class (admin only).

**Request Body:**
```json
{
  "name": "Introduction to Computer Science",
  "code": "CS101",
  "schedule": "Mon, Wed 10:00 AM",
  "instructor": "Dr. Smith"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Introduction to Computer Science",
  "code": "CS101",
  "schedule": "Mon, Wed 10:00 AM",
  "instructor": "Dr. Smith"
}
```

#### DELETE /classes/:id
Delete a class (admin only).

**Response (204 No Content)**

### Sessions

#### GET /sessions
Get all sessions.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "class_id": 1,
    "class_name": "Introduction to Computer Science",
    "session_name": "Lecture 1",
    "date": "2024-01-15",
    "status": "present",
    "check_in_time": "2024-01-15T09:05:00"
  }
]
```

#### GET /sessions/active
Get currently active sessions.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "class_id": 1,
    "class_name": "Introduction to Computer Science",
    "session_name": "Lecture 4",
    "start_time": "2024-01-20T09:00:00",
    "end_time": "2024-01-20T10:00:00",
    "location": {
      "lat": 40.7128,
      "lng": -74.0060,
      "name": "Lecture Hall A"
    },
    "qr_code_id": "qr_001"
  }
]
```

#### POST /sessions
Create a new session (lecturer/admin only).

**Request Body:**
```json
{
  "class_id": 1,
  "session_name": "Lecture 5",
  "date": "2024-01-22",
  "start_time": "2024-01-22T09:00:00",
  "end_time": "2024-01-22T10:00:00",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "name": "Lecture Hall A"
  }
}
```

**Response (201 Created):**
```json
{
  "id": 5,
  "class_id": 1,
  "session_name": "Lecture 5",
  "date": "2024-01-22",
  "start_time": "2024-01-22T09:00:00",
  "end_time": "2024-01-22T10:00:00",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "name": "Lecture Hall A"
  }
}
```

#### GET /sessions/:id
Get a specific session by ID.

**Response (200 OK):**
```json
{
  "id": 1,
  "class_id": 1,
  "class_name": "Introduction to Computer Science",
  "session_name": "Lecture 1",
  "date": "2024-01-15",
  "status": "present",
  "check_in_time": "2024-01-15T09:05:00"
}
```

#### PUT /sessions/:id
Update a session (lecturer/admin only).

**Request Body:**
```json
{
  "session_name": "Lecture 1 Updated",
  "date": "2024-01-15"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "class_id": 1,
  "session_name": "Lecture 1 Updated",
  "date": "2024-01-15"
}
```

#### DELETE /sessions/:id
Delete a session (lecturer/admin only).

**Response (204 No Content)**

### Attendance

#### GET /attendance
Get all attendance records.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "session_id": 1,
    "student_id": "STU001",
    "status": "present",
    "check_in_time": "2024-01-15T09:05:00",
    "check_out_time": "2024-01-15T10:00:00",
    "location": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  }
]
```

#### GET /attendance/student/:studentId
Get attendance records for a specific student.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "session_id": 1,
    "student_id": "STU001",
    "status": "present",
    "check_in_time": "2024-01-15T09:05:00"
  }
]
```

#### GET /attendance/session/:sessionId
Get attendance records for a specific session.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "session_id": 1,
    "student_id": "STU001",
    "status": "present",
    "check_in_time": "2024-01-15T09:05:00"
  }
]
```

#### POST /attendance
Create a new attendance record (student check-in).

**Request Body:**
```json
{
  "session_id": 1,
  "student_id": "STU001",
  "status": "present",
  "check_in_time": "2024-01-15T09:05:00",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060
  }
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "session_id": 1,
  "student_id": "STU001",
  "status": "present",
  "check_in_time": "2024-01-15T09:05:00",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060
  }
}
```

#### PUT /attendance/:id
Update an attendance record.

**Request Body:**
```json
{
  "status": "late",
  "check_out_time": "2024-01-15T10:00:00"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "session_id": 1,
  "student_id": "STU001",
  "status": "late",
  "check_in_time": "2024-01-15T09:05:00",
  "check_out_time": "2024-01-15T10:00:00"
}
```

#### DELETE /attendance/:id
Delete an attendance record.

**Response (204 No Content)**

### User Profile

#### GET /user/profile
Get current user profile.

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "student@university.edu",
  "full_name": "Test Student",
  "student_id": "STU001",
  "department": "Computer Science",
  "role": "student",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

#### PUT /user/profile
Update current user profile.

**Request Body:**
```json
{
  "full_name": "Test Student Updated",
  "phone": "+9876543210",
  "address": "456 New St"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "student@university.edu",
  "full_name": "Test Student Updated",
  "student_id": "STU001",
  "department": "Computer Science",
  "role": "student",
  "phone": "+9876543210",
  "address": "456 New St"
}
```

#### PUT /user/password
Change user password.

**Request Body:**
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

### AI Insights

#### GET /insights
Get AI-generated insights for the current user.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "insight_type": "improvement",
    "priority": "medium",
    "insight_text": "Your attendance has improved by 5% this month. Keep up the good work!",
    "created_at": "2024-01-20T10:00:00Z"
  },
  {
    "id": 2,
    "insight_type": "warning",
    "priority": "high",
    "insight_text": "You have 3 late arrivals this month. Try to arrive 5 minutes early.",
    "created_at": "2024-01-19T10:00:00Z"
  }
]
```

#### POST /insights/generate
Generate new AI insights.

**Response (200 OK):**
```json
{
  "message": "AI insights generated successfully"
}
```

### Course Schedule

#### GET /schedules
Get all course schedules for the current user.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "course_name": "Introduction to Computer Science",
    "course_code": "CS101",
    "day_of_week": "Monday",
    "start_time": "09:00",
    "end_time": "10:30",
    "venue": "Lecture Hall A",
    "reminder_note": "Bring laptop for lab session"
  }
]
```

#### POST /schedules
Create a new course schedule.

**Request Body:**
```json
{
  "course_name": "Introduction to Computer Science",
  "course_code": "CS101",
  "day_of_week": "Monday",
  "start_time": "09:00",
  "end_time": "10:30",
  "venue": "Lecture Hall A",
  "reminder_note": "Bring laptop for lab session"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "course_name": "Introduction to Computer Science",
  "course_code": "CS101",
  "day_of_week": "Monday",
  "start_time": "09:00",
  "end_time": "10:30",
  "venue": "Lecture Hall A",
  "reminder_note": "Bring laptop for lab session"
}
```

#### GET /schedules/:id
Get a specific course schedule by ID.

**Response (200 OK):**
```json
{
  "id": 1,
  "course_name": "Introduction to Computer Science",
  "course_code": "CS101",
  "day_of_week": "Monday",
  "start_time": "09:00",
  "end_time": "10:30",
  "venue": "Lecture Hall A",
  "reminder_note": "Bring laptop for lab session"
}
```

#### PUT /schedules/:id
Update a course schedule.

**Request Body:**
```json
{
  "course_name": "Introduction to Computer Science",
  "course_code": "CS101",
  "day_of_week": "Monday",
  "start_time": "09:00",
  "end_time": "10:30",
  "venue": "Lecture Hall A",
  "reminder_note": "Bring laptop for lab session"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "course_name": "Introduction to Computer Science",
  "course_code": "CS101",
  "day_of_week": "Monday",
  "start_time": "09:00",
  "end_time": "10:30",
  "venue": "Lecture Hall A",
  "reminder_note": "Bring laptop for lab session"
}
```

#### DELETE /schedules/:id
Delete a course schedule.

**Response (204 No Content)**

## Data Models

### User
```typescript
{
  id: number;
  email: string;
  password: string; // Only for registration, never returned
  full_name: string;
  student_id: string;
  department: string;
  role: 'student' | 'lecturer' | 'admin';
  phone?: string;
  address?: string;
}
```

### Class
```typescript
{
  id: number;
  name: string;
  code: string;
  schedule: string;
  instructor: string;
}
```

### Session
```typescript
{
  id: number;
  class_id: number;
  class_name: string;
  session_name: string;
  date: string;
  start_time?: string;
  end_time?: string;
  status?: 'present' | 'absent' | 'late';
  check_in_time?: string;
  check_out_time?: string;
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  qr_code_id?: string;
}
```

### Attendance
```typescript
{
  id: number;
  session_id: number;
  student_id: string;
  status: 'present' | 'absent' | 'late';
  check_in_time: string;
  check_out_time?: string;
  location?: {
    lat: number;
    lng: number;
  };
  created_at: string;
}
```

### Insight
```typescript
{
  id: number;
  insight_type: 'improvement' | 'warning' | 'info' | 'excellent' | 'good' | 'critical' | 'streak' | 'recent';
  priority: 'high' | 'medium' | 'low';
  insight_text: string;
  created_at: string;
}
```

### CourseSchedule
```typescript
{
  id: number;
  course_name: string;
  course_code: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  venue: string;
  reminder_note?: string;
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "message": "Error description here"
}
```

Common HTTP status codes:
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Environment Variables

The frontend expects the following environment variables:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK_DATA=false
```

When `VITE_USE_MOCK_DATA` is set to `true`, the frontend will use mock data instead of making real API calls.

## Development Notes

1. **Mock Data Layer**: The frontend includes a comprehensive mock data layer in `src/utils/mockData.js` that simulates all API responses. This allows frontend development without a running backend.

2. **API Service**: All API calls go through `src/services/api.js`, which handles both real API calls and mock data based on the `VITE_USE_MOCK_DATA` environment variable.

3. **Authentication**: The frontend stores the JWT token in localStorage under the key `token` and user data under the key `user`.

4. **CORS**: Ensure your backend is configured to allow CORS requests from the frontend URL.

5. **Rate Limiting**: Consider implementing rate limiting for API endpoints to prevent abuse.

6. **Validation**: All input data should be validated on the backend before processing.

## Testing

Use the following test credentials for development:

```
Email: student@university.edu
Password: password
```

## Next Steps for Backend Implementation

1. Set up a RESTful API server (Node.js/Express, Python/FastAPI, etc.)
2. Implement JWT authentication
3. Create database models matching the data structures above
4. Implement all API endpoints as specified
5. Add proper error handling and validation
6. Configure CORS for the frontend URL
7. Test all endpoints with the frontend
