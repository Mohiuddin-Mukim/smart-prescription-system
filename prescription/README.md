# 💊 Smart Prescription and Medicine Information System
### Empowering Patients with Digital Health Management

The **Smart Prescription and Medicine Information System** is a modern web application built with **Spring Boot** that helps users manage medical prescriptions digitally. It enables users to upload prescriptions or manually input medicine details, track dosage schedules, and access intelligent insights about medications.

---

## 🚀 Features

### 🔐 User Authentication
- Secure **Signup, Login, and Logout** functionality.
- **JWT-based Authentication** with **Refresh Tokens** for enhanced security.

### 📄 Prescription Management
- **PDF Upload:** Store digital copies of your physical prescriptions.
- **Manual Entry:** Input medicine name, dosage, duration, and instructions row-by-row.
- **Digitalized Records:** Converts messy paper prescriptions into structured, easy-to-read digital data.

### 💡 Smart Insights
- **Generic Database:** Automatically provides generic medicine names.
- **Alternatives:** Suggests alternative brands for prescribed medicines.
- **Safety Info:** Displays side effects, indications, and age-specific instructions.

### ⏰ Dosage Notifications
- **Schedule Tracking:** Automatically generates dosage schedules based on prescription duration.
- **Reminders:** Tracks `PENDING`, `TAKEN`, or `SKIPPED` statuses to ensure medication adherence.

---

## 🛠️ Tech Stack

- **Backend:** Java 21, Spring Boot 3.x/4.x, Spring Security (JWT)
- **Frontend:** HTML5, Tailwind CSS, JavaScript
- **Database:** MySQL 8.x
- **Migration Tool:** Flyway (Database Versioning)
- **Build Tool:** Maven
- **IDE:** IntelliJ IDEA Ultimate

---
## 📂 Project Structure

```text
src/main/java/com/smartprescription/
├── config         # Security, JWT & Cloud Configurations
├── controllers    # REST API Endpoints (Auth, Prescription)
├── dtos          # Data Transfer Objects (Request/Response)
├── entities       # JPA Entities (MySQL Database Tables)
├── enums          # Enumerations (e.g., ScheduleStatus)
├── repositories   # Data Access Layer (Spring Data JPA)
├── services       # Business Logic & Service Layer
└── util           # Helper classes (JwtUtil, DateUtils)

```

👤 Author
Mohiuddin Mukim
🔗 GitHub: [https://github.com/Mohiuddin-Mukim]

💙 Built With
Made with passion using Java and Spring Boot.

© 2026 Mohiuddin Rahman Mukim. All rights reserved.

