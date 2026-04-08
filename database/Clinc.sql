CREATE DATABASE clinic_db;
USE clinic_db;

-- 1. جدول الدكاترة
CREATE TABLE doctors (
    id             INT IDENTITY PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL
);

-- 2. جدول المرضى
CREATE TABLE patients (
    id    INT IDENTITY PRIMARY KEY,
    name  VARCHAR(100) NOT NULL,
    phone VARCHAR(20)  NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- 3. جدول المواعيد
CREATE TABLE appointments (
    id         INT IDENTITY PRIMARY KEY,
    date       DATE NOT NULL
);

-- 4. جدول وسيط: patients ↔ doctors (Many-to-Many)
CREATE TABLE patient_doctors (
    patient_id INT NOT NULL,
    doctor_id  INT NOT NULL,
    PRIMARY KEY (patient_id, doctor_id),
    CONSTRAINT fk_pd_patient 
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_pd_doctor  
        FOREIGN KEY (doctor_id)  REFERENCES doctors(id)  ON DELETE CASCADE
);

-- 5. جدول وسيط: appointments ↔ doctors (Many-to-Many)
CREATE TABLE appointment_doctors (
    appointment_id INT NOT NULL,
    doctor_id      INT NOT NULL,
    patient_id     INT NOT NULL,
    PRIMARY KEY (appointment_id, doctor_id),
    CONSTRAINT fk_ad_appointment 
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    CONSTRAINT fk_ad_doctor      
        FOREIGN KEY (doctor_id)      REFERENCES doctors(id)      ON DELETE CASCADE,
    CONSTRAINT fk_ad_patient     
        FOREIGN KEY (patient_id)     REFERENCES patients(id)     ON DELETE CASCADE
);

-- =================== INSERT DATA ===================

INSERT INTO doctors (name, specialization) VALUES
('Dr. Ahmed Hassan',  'Cardiology'),
('Dr. Sara Mahmoud',  'Dermatology'),
('Dr. Omar Khaled',   'Orthopedics'),
('Dr. Nadia Farouk',  'Pediatrics'),
('Dr. Youssef Nabil', 'Neurology');

INSERT INTO patients (name, phone, email) VALUES
('Mohamed Ali',   '01001234567', 'mohamed@email.com'),
('Hana Mostafa',  '01112345678', 'hana@email.com'),
('Karim Samy',    '01223456789', 'karim@email.com'),
('Laila Adel',    '01334567890', 'laila@email.com'),
('Tarek Ibrahim', '01445678901', 'tarek@email.com');

INSERT INTO appointments (date) VALUES
('2025-08-01'),
('2025-08-02'),
('2025-08-03'),
('2025-08-04'),
('2025-08-05');

-- مريض بيتعالج عند أكتر من دكتور
INSERT INTO patient_doctors (patient_id, doctor_id) VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 1),
(3, 3),
(4, 3),
(5, 4);

-- موعد فيه أكتر من دكتور
INSERT INTO appointment_doctors (appointment_id, doctor_id, patient_id) VALUES
(1, 1, 1),
(1, 2, 1),
(2, 2, 2),
(3, 1, 3),
(4, 3, 4),
(5, 4, 5);

-- =================== SELECT ===================

SELECT * FROM doctors;

SELECT * FROM patients;

SELECT 
    p.name AS patient_name,
    d.name AS doctor_name,
    d.specialization
FROM patient_doctors pd
JOIN patients p ON pd.patient_id = p.id
JOIN doctors  d ON pd.doctor_id  = d.id;

SELECT 
    a.id   AS appointment_id,
    p.name AS patient_name,
    d.name AS doctor_name,
    d.specialization,
    a.date
FROM appointment_doctors ad
JOIN appointments a ON ad.appointment_id = a.id
JOIN doctors      d ON ad.doctor_id      = d.id
JOIN patients     p ON ad.patient_id     = p.id
ORDER BY a.id;
