-- 1. Medicine Master Data
CREATE TABLE medicines (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           brand_name VARCHAR(255) NOT NULL,
                           generic_name VARCHAR(255) NOT NULL,
                           medicine_type VARCHAR(50), -- e.g., Tablet, Capsule
                           strength VARCHAR(50),
                           side_effects TEXT,
                           indications TEXT,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           INDEX idx_generic (generic_name)
);

-- 2. User Table
CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       full_name VARCHAR(100) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       phone_number VARCHAR(20),
                       password_hash VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Prescription Header
CREATE TABLE prescriptions (
                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               user_id BIGINT NOT NULL,
                               doctor_name VARCHAR(255),
                               prescription_date DATE,
                               pdf_file_path VARCHAR(512),
                               is_manual_entry BOOLEAN DEFAULT FALSE,
                               version INT DEFAULT 1, -- Incremented if the user re-uploads or majorly changes
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               CONSTRAINT fk_prescription_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Prescription Items
CREATE TABLE prescription_items (
                                    id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                    prescription_id BIGINT NOT NULL,
                                    medicine_id BIGINT,
                                    manual_medicine_name VARCHAR(255),
                                    dosage_instruction VARCHAR(255),
                                    duration_days INT,
                                    start_date DATE,
                                    end_date DATE,
                                    is_active BOOLEAN DEFAULT TRUE,
                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                    CONSTRAINT fk_item_prescription FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
                                    CONSTRAINT fk_item_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id)
);

-- 5. Dosage Schedules
CREATE TABLE dosage_schedules (
                                  id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                  prescription_item_id BIGINT NOT NULL,
                                  scheduled_time TIME NOT NULL,
                                  status ENUM('PENDING', 'TAKEN', 'SKIPPED', 'RESCHEDULED') DEFAULT 'PENDING',
                                  last_notified_at TIMESTAMP NULL,
                                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                  CONSTRAINT fk_schedule_item FOREIGN KEY (prescription_item_id) REFERENCES prescription_items(id) ON DELETE CASCADE
);

