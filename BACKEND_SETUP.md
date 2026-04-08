# 🚀 Backend Setup Guide - Clinic Appointment System

**Target**: Node.js/Express backend to power the clinic appointment frontend

---

## 📋 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+
- PostgreSQL 12+ or MySQL 8+
- npm or yarn

### 1. Clone & Install
```bash
git clone <repo-url>
cd clinic/backend
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Database Setup
```bash
npm run migrate
npm run seed:demo  # Optional: seed with demo data
```

### 4. Start Server
```bash
npm run dev
# Server running on http://localhost:8080
```

### 5. Test Connection
```bash
curl http://localhost:8080/api/doctors
# Should return array of doctors
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js
│   │   ├── cors.js
│   │   └── env.js
│   ├── routes/          # API routes
│   │   ├── doctors.js
│   │   ├── patients.js
│   │   └── appointments.js
│   ├── controllers/     # Business logic
│   │   ├── doctorController.js
│   │   ├── patientController.js
│   │   └── appointmentController.js
│   ├── models/          # Database models/schema
│   │   ├── Doctor.js
│   │   ├── Patient.js
│   │   └── Appointment.js
│   ├── middleware/      # Express middleware
│   │   ├── errorHandler.js
│   │   ├── validation.js
│   │   └── auth.js
│   ├── utils/           # Helper functions
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── errors.js
│   └── app.js           # Express app setup
├── migrations/          # Database migrations
├── seeds/              # Demo data seeding
├── tests/              # Test files
├── .env.example        # Environment template
├── package.json
└── server.js           # Entry point
```

---

## 🗄️ Database Setup

### Option 1: PostgreSQL (Recommended)

```bash
# Create database
createdb clinic_db

# Install PostgreSQL driver
npm install pg
```

**.env file**:
```
DATABASE_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clinic_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### Option 2: MySQL

```bash
# Create database
mysql -u root -p
CREATE DATABASE clinic_db;

# Install MySQL driver
npm install mysql2
```

**.env file**:
```
DATABASE_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=clinic_db
DB_USER=root
DB_PASSWORD=your_password
```

### Option 3: SQLite (Easy for development)

```bash
npm install sqlite3
```

**.env file**:
```
DATABASE_TYPE=sqlite
DB_PATH=./data/clinic.db
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "joi": "^17.9.2",
    "mysql2": "^3.2.4",
    "pg": "^8.11.0",
    "sqlite3": "^5.1.6",
    "sequelize": "^6.35.1",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.5.0",
    "supertest": "^6.3.3"
  }
}
```

### Install All
```bash
npm install
```

---

## 🔧 Express Server Setup

**server.js**:
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5500',
    'http://localhost:8000'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/doctors', require('./src/routes/doctors'));
app.use('/api/patients', require('./src/routes/patients'));
app.use('/api/appointments', require('./src/routes/appointments'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Server error'
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

---

## 📚 Implementing Routes

### Example: GET /api/doctors

**src/routes/doctors.js**:
```javascript
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get('/', doctorController.getAll);
router.get('/specializations', doctorController.getSpecializations);
router.get('/:id', doctorController.getById);
router.post('/', doctorController.create);
router.put('/:id', doctorController.update);
router.delete('/:id', doctorController.delete);

module.exports = router;
```

**src/controllers/doctorController.js**:
```javascript
const Doctor = require('../models/Doctor');

const doctorController = {
  getAll: async (req, res, next) => {
    try {
      const doctors = await Doctor.findAll();
      res.json(doctors);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Doctor not found' }
        });
      }
      res.json(doctor);
    } catch (error) {
      next(error);
    }
  },

  getSpecializations: async (req, res, next) => {
    try {
      const specs = await Doctor.getSpecializations();
      res.json(specs);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { name, specialization, experience, rating } = req.body;
      
      // Validation
      if (!name || !specialization) {
        return res.status(400).json({
          success: false,
          error: { 
            code: 'VALIDATION_ERROR',
            message: 'Name and specialization required'
          }
        });
      }

      const doctor = await Doctor.create({
        name,
        specialization,
        experience,
        rating: rating || 5.0
      });

      res.status(201).json(doctor);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const doctor = await Doctor.update(req.params.id, req.body);
      if (!doctor) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Doctor not found' }
        });
      }
      res.json(doctor);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      await Doctor.delete(req.params.id);
      res.json({ success: true, message: 'Doctor deleted' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = doctorController;
```

---

## 🗂️ Database Models

### Using Sequelize (Recommended)

**src/models/Doctor.js**:
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false
  },
  experience: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 5.0
  },
  availability: DataTypes.TEXT,
  phone: DataTypes.STRING,
  bio: DataTypes.TEXT
}, {
  timestamps: true
});

module.exports = Doctor;
```

**src/models/Appointment.js**:
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Patients', key: 'id' }
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Doctors', key: 'id' }
  },
  appointment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  appointment_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  notes: DataTypes.TEXT
}, {
  timestamps: true,
  indexes: [
    {
      name: 'unique_appointment',
      fields: ['doctor_id', 'appointment_date', 'appointment_time'],
      unique: true
    }
  ]
});

module.exports = Appointment;
```

---

## ✅ Implementation Checklist

### Controllers
- [ ] `DoctorController` with CRUD operations
- [ ] `PatientController` with validation
- [ ] `AppointmentController` with conflict checking
- [ ] Validation middleware for all inputs
- [ ] Error handling middleware

### Routes
- [ ] `GET /api/doctors`
- [ ] `GET /api/doctors/specializations`
- [ ] `POST /api/patients`
- [ ] `GET /api/appointments`
- [ ] `POST /api/appointments` (with conflict checking)
- [ ] `PUT /api/appointments/:id`
- [ ] `DELETE /api/appointments/:id`
- [ ] `GET /api/appointments/available`

### Database
- [ ] Doctors table with 5+ sample doctors
- [ ] Patients table
- [ ] Appointments table with unique constraint
- [ ] Foreign key relationships
- [ ] Indexes for performance

### Features
- [ ] 2-second response time (no complex queries)
- [ ] CORS headers correct
- [ ] Pagination support (optional but recommended)
- [ ] Request validation with Joi
- [ ] Consistent error responses
- [ ] Health check endpoint: `GET /api/health`

---

## 🧪 Testing

### Jest + Supertest

**package.json scripts**:
```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "test": "jest --watch",
    "test:ci": "jest --ci",
    "migrate": "node migrations/run.js",
    "seed:demo": "node seeds/demoData.js"
  }
}
```

### Example Test

**tests/api.test.js**:
```javascript
const request = require('supertest');
const app = require('../src/app');

describe('Doctors API', () => {
  test('GET /api/doctors returns doctors array', async () => {
    const res = await request(app).get('/api/doctors');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('POST /api/patients creates new patient', async () => {
    const res = await request(app)
      .post('/api/patients')
      .send({
        name: 'Test Patient',
        email: 'test@example.com',
        phone: '1234567890'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });
});
```

---

## 📊 Sample Data

### Seed Demo Doctors

```javascript
const doctors = [
  {
    name: 'Dr. Ahmed Hassan',
    specialization: 'Cardiology',
    experience: 15,
    rating: 4.8,
    phone: '+201234567890',
    bio: 'Specialist in cardiology with 15 years experience'
  },
  {
    name: 'Dr. Fatima Al-Mansouri',
    specialization: 'Dentistry',
    experience: 10,
    rating: 4.9,
    phone: '+201234567891',
    bio: 'Expert in cosmetic dentistry'
  },
  {
    name: 'Dr. Mohamed Ibrahim',
    specialization: 'Neurology',
    experience: 12,
    rating: 4.7,
    phone: '+201234567892',
    bio: 'Neurologist with specialized training'
  }
  // ... add more doctors
];

// Insert into database during seeding
```

---

## 🔐 Production Checklist

- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] HTTPS enabled
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] Logging configured
- [ ] Error monitoring (Sentry, etc)
- [ ] Performance optimization
- [ ] API documentation updated
- [ ] Unit tests passing
- [ ] Load testing passed

---

## 📞 Support

**API not responding?**
1. Check server is running: `http://localhost:8080/api/health`
2. Check CORS headers in browser console
3. Check database connection in `.env`
4. Check Node/npm versions: `node -v`, `npm -v`

**Database issues?**
1. Verify connection string in `.env`
2. Check database is running
3. Run migrations: `npm run migrate`
4. Check for unique constraint violations

---

**Status**: Ready for Development ✅  
**Last Updated**: 2024
