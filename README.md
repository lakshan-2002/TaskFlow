# TaskFlow - A Mini Task Management System

## 📋 Project Overview

TaskFlow is a comprehensive task management application built with Spring Boot that enables users to efficiently manage their daily tasks. The system provides a secure, RESTful API with JWT-based authentication and role-based access control.

### Key Features

- **User Management**
  - User registration and authentication
  - Secure password storage using BCrypt encryption
  - Role-based access control (USER, ADMIN)
  - JWT token-based authentication

- **Task Management**
  - Create, read, update, and delete tasks
  - Task prioritization (HIGH, MEDIUM, LOW)
  - Task status tracking (TODO, IN_PROGRESS, DONE)
  - Due date management
  - User-specific task filtering

- **Security**
  - JWT-based stateless authentication
  - Role-based endpoint protection
  - Secure password handling
  - Protected API endpoints

- **Architecture**
  - Clean architecture with proper layer separation
  - RESTful API design principles
  - Centralized exception handling
  - Input validation using Bean Validation
  - Proper HTTP status codes

### Technology Stack

**Backend:**
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security with JWT
- **Database**: MySQL (JPA/Hibernate)
- **Build Tool**: Maven
- **Java Version**: 17+
- **Dependencies**:
  - Spring Web
  - Spring Security
  - Spring Data JPA
  - JWT (io.jsonwebtoken)
  - Lombok
  - MySQL Connector
  - Validation API

**Frontend:**
- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: CSS Modules
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Notifications**: React Toastify
- **Icons**: Lucide React
- **Node Version**: 18+

---

## 🚀 Setup Instructions

### Prerequisites

Before running the application, ensure you have the following installed:

1. **Java Development Kit (JDK) 17 or higher**
   - Download from: https://www.oracle.com/java/technologies/downloads/
   - Verify installation: `java -version`

2. **Maven 3.6 or higher**
   - Download from: https://maven.apache.org/download.cgi
   - Verify installation: `mvn -version`

3. **MySQL Server 8.0 or higher**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Ensure MySQL service is running

4. **IDE (Optional but Recommended)**
   - IntelliJ IDEA, Eclipse, or VS Code

### Installation Steps

1. **Clone or Download the Repository**
   ```bash
   cd C:\Users\LAKSHAN\TaskFlow\Backend
   ```

2. **Install Dependencies**
   ```bash
   mvn clean install
   ```

3. **Set Up Environment Variables** (see Database Configuration section below)

---

## 🗄️ Database Configuration

### Step 1: Create MySQL Database

1. Open MySQL command line or MySQL Workbench
2. Execute the following SQL commands:

```sql
CREATE DATABASE task_flow_db;

USE task_flow_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN','USER') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('TODO','IN_PROGRESS','DONE') DEFAULT 'TODO',
    priority ENUM('LOW','MEDIUM','HIGH') DEFAULT 'MEDIUM',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Note:** The tables will also be automatically created by Hibernate on first run if they don't exist, but you can use the above schema for manual setup or reference.

### Step 2: Configure Environment Variables

The application uses environment variables for sensitive configuration. **Never commit secrets directly in code!**

#### **Required Environment Variables**

| Variable Name | Description | Example Value | Required |
|--------------|-------------|---------------|----------|
| `Database_Host` | MySQL database connection URL | `jdbc:mysql://localhost:3306/task_flow_db` | Yes |
| `Database_Username` | MySQL database username | `root` or `your_username` | Yes |
| `Database_Password` | MySQL database password | `your_secure_password` | Yes |
| `JWT_Secret_Key` | Secret key for JWT token signing (min 32 characters) | `mySecureJWTSecretKeyForTaskFlowApplication2026` | Yes |

**Security Notes:**
- ⚠️ Never commit these values to version control
- ⚠️ Use different values for development and production
- ⚠️ JWT secret must be at least 256 bits (32 characters) for security
- ⚠️ Keep your database password secure and complex

#### **On Windows (PowerShell)**

```powershell
# Set environment variables for current session
$env:Database_Host="jdbc:mysql://localhost:3306/task_flow_db"
$env:Database_Username="your_mysql_username"
$env:Database_Password="your_mysql_password"
$env:JWT_Secret_Key="your_secure_jwt_secret_key_min_256_bits"
```

#### **On Windows (Command Prompt)**

```cmd
set Database_Host=jdbc:mysql://localhost:3306/task_flow_db
set Database_Username=your_mysql_username
set Database_Password=your_mysql_password
set JWT_Secret_Key=your_secure_jwt_secret_key_min_256_bits
```

#### **For Permanent Configuration (Windows)**

1. Right-click on "This PC" or "My Computer" → Properties
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "User variables" or "System variables", click "New"
5. Add each variable:
   - Variable name: `Database_Host`
   - Variable value: `jdbc:mysql://localhost:3306/task_flow_db`
   - Repeat for other variables

#### **On Linux/Mac**

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
export Database_Host="jdbc:mysql://localhost:3306/task_flow_db"
export Database_Username="your_mysql_username"
export Database_Password="your_mysql_password"
export JWT_Secret_Key="your_secure_jwt_secret_key_min_256_bits"
```

Then run: `source ~/.bashrc` or `source ~/.zshrc`

### Step 3: Verify Configuration

The `application.properties` file is already configured to use these environment variables:

```properties
spring.datasource.url=${Database_Host}
spring.datasource.username=${Database_Username}
spring.datasource.password=${Database_Password}

jwt.secret=${JWT_Secret_Key}
jwt.expiration=3600000
```

---

## ▶️ Steps to Run the Application

### Backend (Spring Boot API)

#### Method 1: Using Maven (Recommended)

1. **Navigate to the backend directory**
   ```bash
   cd C:\Users\LAKSHAN\TaskFlow\Backend
   ```

2. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

3. **Verify the backend is running**
   - You should see: `Started TaskFlowApplication in X.XXX seconds`
   - Default port: `8080`
   - API URL: `http://localhost:8080`

#### Method 2: Using Java JAR

1. **Build the JAR file**
   ```bash
   mvn clean package
   ```

2. **Run the JAR**
   ```bash
   java -jar target/TaskFlow-0.0.1-SNAPSHOT.jar
   ```

#### Method 3: Using IDE

1. **Open the project in your IDE**
2. **Locate the main application class**: `TaskFlowApplication.java`
3. **Right-click and select "Run"** or use the run button

---

### Frontend (Next.js Application)

#### Prerequisites for Frontend

1. **Node.js 18+ installed**
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **Backend must be running**
   - Ensure the Spring Boot backend is running on port 8080

#### Running the Frontend

1. **Navigate to the frontend directory**
   ```bash
   cd C:\Users\LAKSHAN\TaskFlow\Backend\Frontend
   ```

2. **Install dependencies** (first time only)
   ```bash
   npm install
   ```

3. **Create environment configuration** (if not exists)
   
   Create a `.env.local` file in the Frontend folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser and go to: `http://localhost:3000`
   - The frontend will connect to the backend API at `http://localhost:8080`

#### Frontend Build Commands

```bash
# Development mode (hot reload)
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Lint code
npm run lint
```

---

### Running Both Backend and Frontend

**Open two terminal windows:**

**Terminal 1 - Backend:**
```bash
cd C:\Users\LAKSHAN\TaskFlow\Backend
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd C:\Users\LAKSHAN\TaskFlow\Backend\Frontend
npm run dev
```

Then access:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080

---

## 🔐 Security Configuration

### Environment Variables Security

**All sensitive configuration is stored in environment variables and NEVER committed to version control.**

The following secrets are required (see Database Configuration section for setup):
- `Database_Host` - Database connection URL
- `Database_Username` - Database username  
- `Database_Password` - Database password
- `JWT_Secret_Key` - JWT signing secret (minimum 32 characters)

### Version Control Exclusions

The `.gitignore` file ensures the following are never committed:

**Build Folders:**
- `target/` - Maven compiled classes and build artifacts
- `build/` - Gradle build output
- `out/` - IDE build output

**IDE Configuration:**
- `.idea/` - IntelliJ IDEA settings
- `.vscode/` - VS Code settings
- `.settings/` - Eclipse settings

**Secrets & Environment Files:**
- `.env` and `.env.*` files
- `*.properties.local` files
- Local configuration overrides

**Other:**
- Log files (`*.log`)
- OS-specific files (`.DS_Store`, `Thumbs.db`)
- Compiled artifacts (`*.class`, `*.jar`, `*.war`)

### JWT Token

- **Expiration Time**: 1 hour (3600000 ms)
- **Algorithm**: HMAC-SHA256
- **Header Format**: `Authorization: Bearer <token>`

### Roles

- **USER**: Default role for registered users
  - Can create, read, update, and delete their own tasks
- **ADMIN**: Administrative role
  - Can view all tasks from all users
  - Additional privileges

### Password Security

- All passwords are encrypted using **BCrypt** algorithm
- Passwords are never returned in API responses

---

## 📂 Project Structure

```
TaskFlow/
├── Backend/                         # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/lakshan/task_flow/
│   │   │   │   ├── config/              # Security configuration
│   │   │   │   ├── controller/          # REST API controllers
│   │   │   │   ├── entity/              # JPA entities
│   │   │   │   ├── enums/               # Enumerations (Role, Status, Priority)
│   │   │   │   ├── exception/           # Custom exceptions & global handler
│   │   │   │   ├── model/               # DTOs (Request/Response models)
│   │   │   │   ├── repository/          # JPA repositories
│   │   │   │   ├── security/            # JWT utilities and filters
│   │   │   │   ├── service/             # Business logic layer
│   │   │   │   └── TaskFlowApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── target/                          # Compiled classes (not in git)
│   ├── pom.xml                          # Maven configuration
│   ├── README.md                        # This file
│   └── Frontend/                        # Next.js Frontend
│       ├── pages/                       # Next.js pages
│       │   ├── index.js                 # Login page
│       │   ├── signup.js                # Registration page
│       │   ├── dashboard.js             # Main dashboard
│       │   ├── all-tasks.js             # All tasks view
│       │   ├── add-task.js              # Create task page
│       │   └── completed-tasks.js       # Completed tasks
│       ├── components/                  # React components
│       ├── services/                    # API service layer
│       │   ├── api.js                   # Axios configuration
│       │   ├── authService.js           # Authentication API
│       │   └── taskService.js           # Task API
│       ├── styles/                      # CSS styles
│       ├── public/                      # Static assets
│       ├── package.json                 # Node dependencies
│       ├── next.config.js               # Next.js configuration
│       └── .env.local                   # Frontend env vars (not in git)
```

---

## 📚 API Documentation

For complete API documentation including request/response examples, authentication details, and endpoint testing, visit:

**Postman Documentation**: [https://documenter.getpostman.com/view/38623215/2sBXigKsHq](https://documenter.getpostman.com/view/38623215/2sBXigKsHq)

---

**Happy Task Managing! 🚀**
