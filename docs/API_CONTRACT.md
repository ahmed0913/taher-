# 📋 API CONTRACT - Expected Backend Endpoints

## Base Configuration

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
const API_TIMEOUT = 2000; // milliseconds
```

## CORS Configuration Required
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 1. AUTHENTICATION ENDPOINTS

### POST /auth/login
Login user (optional for now - demo mode)

**Request:**
```json
{
  "email": "patient@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Mohamed Ali",
    "email": "patient@example.com",
    "phone": "01001234567",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "error": null,
  "timestamp": "2025-08-01T10:30:00Z"
}
```

---

## 2. DOCTORS ENDPOINTS

### GET /doctors
Get all doctors with optional filtering

**Query Parameters:**
- `specialization` (optional): Filter by specialization (e.g., "Cardiology")
- `available_date` (optional): Filter by availability (YYYY-MM-DD)
- `sort` (optional): Sort by "rating" or "name" (default: "name")
- `limit` (optional): Pagination limit (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Dr. Ahmed Hassan",
      "specialization": "Cardiology",
      "image": "https://images.unsplash.com/...",
      "rating": 4.9,
      "reviews": 187,
      "nextAvailable": "2025-08-01",
      "price": 500,
      "bio": "Expert cardiologist with 15+ years of experience",
      "availability": {
        "monday": ["09:00", "10:30", "14:00", "15:30"],
        "tuesday": ["09:00", "10:30", "14:00", "15:30"]
      }
    }
  ],
  "error": null,
  "timestamp": "2025-08-01T10:30:00Z"
}
```

**Error (500 Internal Server Error):**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "Failed to fetch doctors",
    "details": null
  },
  "timestamp": "2025-08-01T10:30:00Z"
}
```

---

### GET /doctors/:id
Get single doctor details

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Dr. Ahmed Hassan",
    "specialization": "Cardiology",
    "image": "https://images.unsplash.com/...",
    "rating": 4.9,
    "reviews": 187,
    "bio": "Expert cardiologist with 15+ years of experience",
    "price": 500,
    "phone": "+20 1001234567",
    "email": "dr.ahmed@clinic.com"
  },
  "error": null,
  "timestamp": "2025-08-01T10:30:00Z"
}
```

---

### GET /doctors/:id/availability
Get doctor availability for specific date

**Query Parameters:**
- `date` (required): Date (YYYY-MM-DD)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "doctorId": 1,
    "date": "2025-08-01",
    "availableSlots": [
      {
        "time": "09:00",
        "available": true
      },
      {
        "time": "10:30",
        "available": true
      },
      {
        "time": "14:00",
        "available": false
      }
    ]
  },
  "error": null,
  "timestamp": "2025-08-01T10:30:00Z"
}
```

---

## 3. PATIENTS ENDPOINTS

### GET /patients
Get all patients (admin only)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Mohamed Ali",
      "email": "mohamed@email.com",
      "phone": "01001234567",
      "age": 35,
      "gender": "M",
      "bloodType": "O+",
      "allergies": "None"
    }
  ],
  "error": null,
  "timestamp": "2025-08-01T10:30:00Z"
}
```

---

### POST /patients
Create new patient

**Request:**
```json
{
  "name": "Mohamed Ali",
  "email": "mohamed@email.com",
  "phone": "01001234567",
  "age": 35,
  "gender": "M",
  "bloodType": "O+",
  "allergies": "None"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Mohamed Ali",
    "email": "mohamed@email.com",
    "phone": "01001234567",
    "age": 35,
    "gender": "M",
    "bloodType": "O+",
    "allergies": "None"
  },
  "error": null,
  "timestamp": "2025-08-01T10:30:00Z"
}
```

**Error (400 Bad Request - Validation):**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Email is already registered",
      "phone": "Invalid phone format"
    }
  },
  "timestamp": "2025-08-01T10:30:00Z"
}
```

---

### GET /patients/:id
Get patient details

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Mohamed Ali",
    "email": "mohamed@email.com",
    "phone": "01001234567",
    "appointments": 5,
    "lastAppointment": "2025-07-28T10:30:00Z"
  },
  "error": null,
  "timestamp": "2025-08-01T10:30:00Z"
}
```

---

### PATCH /patients/:id
Update patient

**Request:**
```json
{
  "name": "Mohamed Ahmed Ali",
  "phone": "01001234568"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Mohamed Ahmed Ali",
    "phone": "01001234568"
  },
  "error": null,
  "timestamp": "2025-08-01T10:30:00Z"
}
```

---

## 4. APPOINTMENTS ENDPOINTS

### POST /appointments
Create new appointment

**Request:**
```json
{
  "patient_id": 1,
  "doctor_id": 1,
  "date": "2025-08-01",
  "time": "09:00",
  "notes": "I have a history of heart disease"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "patient_id": 1,
    "doctor_id": 1,
    "date": "2025-08-01",
    "time": "09:00",
    "status": "scheduled",
    "doctor": {
      "id": 1,
      "name": "Dr. Ahmed Hassan",
      "specialization": "Cardiology"
    },
    "patient": {
      "id": 1,
      "name": "Mohamed Ali"
    }
  },
  "error": null,
  "timestamp": "2025-08-01T10:30:00Z"
}
```

**Error (409 Conflict - Time slot taken):**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "TIME_SLOT_UNAVAILABLE",
    "message": "This time slot is already booked",
    "details": {
      "availableAlternatives": ["09:30", "10:30", "14:00"]
    }
  },
  "timestamp": "2025-08-01T10:30:00Z"
}
```

**Error (400 Bad Request - Validation):**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "date": "Cannot book appointment in the past",
      "patient_id": "Patient not found"
    }
  },
  "timestamp": "2025-08-01T10:30:00Z"
}
```

---

### GET /appointments
Get all appointments (with filtering)

**Query Parameters:**
- `patient_id` (optional): Filter by patient
- `doctor_id` (optional): Filter by doctor
- `status` (optional): Filter by status (scheduled, completed, cancelled)
- `date_from` (optional): Start date (YYYY-MM-DD)
- `date_to` (optional): End date (YYYY-MM-DD)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patient_id": 1,
      "doctor_id": 1,
      "date": "2025-08-01",
      "time": "09:00",
      "status": "scheduled",
      "doctor": {
        "name": "Dr. Ahmed Hassan",
        "specialization": "Cardiology"
      },
      "patient": {
        "name": "Mohamed Ali"
      }
    }
  ],
  "total": 1,
  "error": null,
  "timestamp": "2025-08-01T10:30:00Z"
}
```

---

### GET /appointments/:id
Get appointment details

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "patient_id": 1,
    "doctor_id": 1,
    "date": "2025-08-01",
    "time": "09:00",
    "status": "scheduled",
    "notes": "I have a history of heart disease",
    "doctor": {
      "name": "Dr. Ahmed Hassan",
      "specialization": "Cardiology",
      "phone": "+20 1001234567"
    },
    "patient": {
      "name": "Mohamed Ali",
      "phone": "01001234567"
    }
  },
  "error": null,
  "timestamp": "2025-08-01T10:30:00Z"
}
```

---

### PATCH /appointments/:id/cancel
Cancel appointment

**Request:**
```json
{
  "reason": "Doctor is unavailable"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "cancelled",
    "cancellation_reason": "Doctor is unavailable",
    "cancelled_at": "2025-08-01T10:30:00Z"
  },
  "error": null,
  "timestamp": "2025-08-01T10:30:00Z"
}
```

---

### PATCH /appointments/:id/reschedule
Reschedule appointment

**Request:**
```json
{
  "date": "2025-08-05",
  "time": "14:00"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "date": "2025-08-05",
    "time": "14:00",
    "status": "scheduled"
  },
  "error": null,
  "timestamp": "2025-08-01T10:30:00Z"
}
```

---

## 5. HEALTH CHECK ENDPOINT

### GET /health
For monitoring and deployment checks

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-01T10:30:00Z",
  "uptime": 3600000,
  "database": "connected"
}
```

---

## Error Codes Reference

| Code | HTTP | Meaning |
|------|------|---------|
| VALIDATION_ERROR | 400 | Form validation failed |
| TIME_SLOT_UNAVAILABLE | 409 | Doctor already has appointment |
| NOT_FOUND | 404 | Resource doesn't exist |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Access denied |
| RATE_LIMITED | 429 | Too many requests |
| DATABASE_ERROR | 500 | Database operation failed |
| SERVER_ERROR | 500 | Internal server error |

---

## Testing Examples (cURL)

### Get all doctors with Cardiology specialization
```bash
curl -X GET "http://localhost:8080/api/doctors?specialization=Cardiology" \
  -H "Content-Type: application/json"
```

### Create appointment
```bash
curl -X POST "http://localhost:8080/api/appointments" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": 1,
    "doctor_id": 1,
    "date": "2025-08-01",
    "time": "09:00",
    "notes": "First visit"
  }'
```

### Cancel appointment
```bash
curl -X PATCH "http://localhost:8080/api/appointments/1/cancel" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Cannot attend"}'
```

---

**Version**: 1.0.0  
**Last Updated**: 2025-08-01  
**Status**: Ready for Implementation
