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
CREATE DATABASE taskflow;
USE taskflow;
```

### Step 2: Configure Environment Variables

The application uses environment variables for sensitive configuration. **Never commit secrets directly in code!**

#### **Required Environment Variables**

| Variable Name | Description | Example Value | Required |
|--------------|-------------|---------------|----------|
| `Database_Host` | MySQL database connection URL | `jdbc:mysql://localhost:3306/taskflow` | Yes |
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
$env:Database_Host="jdbc:mysql://localhost:3306/taskflow"
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

### Step 3: JWT Secret Key

Generate a secure JWT secret key (minimum 256 bits / 32 characters):

```bash
# Example secure key (generate your own)
JWT_Secret_Key=mySecureJWTSecretKeyForTaskFlowApplication2026
```

**Important**: Use a strong, unique secret key in production!

### Step 4: Verify Configuration

The `application.properties` file is already configured to use these environment variables:

```properties
spring.datasource.url=${Database_Host}
spring.datasource.username=${Database_Username}
spring.datasource.password=${Database_Password}

jwt.secret=${JWT_Secret_Key}
jwt.expiration=3600000
```

### Database Schema

The application uses Hibernate with `spring.jpa.hibernate.ddl-auto=update`, which means:
- Tables will be **automatically created** on first run if they don't exist
- Schema updates will be applied automatically

**Tables Created:**

#### Users Table
- `id` - Primary key (BIGINT, auto-increment)
- `username` - User's display name (VARCHAR 100)
- `email` - Unique email address (VARCHAR 150, unique)
- `password` - BCrypt encrypted password (VARCHAR 255)
- `role` - User role: ADMIN or USER (ENUM, default: USER)
- `created_at` - Account creation timestamp

#### Tasks Table
- `id` - Primary key (BIGINT, auto-increment)
- `title` - Task title (VARCHAR 200)
- `description` - Task description (TEXT)
- `status` - Task status: TODO, IN_PROGRESS, DONE (ENUM, default: TODO)
- `priority` - Task priority: LOW, MEDIUM, HIGH (ENUM, default: MEDIUM)
- `due_date` - Task due date (DATE)
- `created_at` - Task creation timestamp
- `updated_at` - Last update timestamp (auto-updated)
- `user_id` - Foreign key to users table (CASCADE delete)

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

## 🔌 API Endpoints

### Authentication Endpoints (Public)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users/register` | Register a new user | No |
| POST | `/users/login` | Login and get JWT token | No |

### User Endpoints (Protected)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users?role=USER` | Get all users by role | Yes |
| PUT | `/users` | Update user information | Yes |

### Task Endpoints (Protected)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/tasks` | Create a new task | Yes (USER) |
| GET | `/tasks` | Get all tasks (user's own or all if ADMIN) | Yes (USER/ADMIN) |
| PUT | `/tasks` | Update an existing task | Yes (USER) |
| DELETE | `/tasks/{id}` | Delete a task by ID | Yes (USER) |

---

## 📝 API Usage Examples

### 1. Register a New User

**Request:**
```http
POST http://localhost:8080/users/register
Content-Type: application/json

{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "username": "John Doe",
  "email": "john@example.com"
}
```

### 2. Login

**Request:**
```http
POST http://localhost:8080/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}
```

### 3. Create a Task

**Request:**
```http
POST http://localhost:8080/tasks
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README file",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-03-20"
}
```

**Response (201 Created):**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README file",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-03-20"
}
```

### 4. Get All Tasks

**Request:**
```http
GET http://localhost:8080/tasks
Authorization: Bearer <your_jwt_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive README file",
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2026-03-20",
    "user": {
      "id": 1,
      "username": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  }
]
```

### 5. Update a Task

**Request:**
```http
PUT http://localhost:8080/tasks
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive README file",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2026-03-20"
}
```

### 6. Delete a Task

**Request:**
```http
DELETE http://localhost:8080/tasks/1
Authorization: Bearer <your_jwt_token>
```

**Response (200 OK):**
```
Task deleted successfully.
```

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

## 🛠️ Troubleshooting

### Backend Issues

1. **Port Already in Use**
   ```
   Error: Web server failed to start. Port 8080 was already in use.
   ```
   **Solution**: Change the port in `application.properties`:
   ```properties
   server.port=8081
   ```

2. **Database Connection Error**
   ```
   Error: Unable to connect to database
   ```
   **Solution**:
   - Verify MySQL is running
   - Check database credentials in environment variables
   - Ensure database `taskflow` exists

3. **JWT Secret Key Error**
   ```
   Error: The specified key byte array is X bits which is not secure enough
   ```
   **Solution**: Use a longer secret key (minimum 256 bits / 32 characters)

4. **Environment Variables Not Found**
   ```
   Error: Could not resolve placeholder 'Database_Host'
   ```
   **Solution**:
   - Set environment variables before running the application
   - Restart your terminal/IDE after setting variables
   - Verify variables with: `echo $Database_Host` (Linux/Mac) or `echo %Database_Host%` (Windows CMD)

### Frontend Issues

1. **Port 3000 Already in Use**
   ```
   Error: Port 3000 is already in use
   ```
   **Solution**: Either:
   - Stop the process using port 3000
   - Run on different port: `npm run dev -- -p 3001`

2. **Cannot Connect to Backend API**
   ```
   Error: Network Error or API request failed
   ```
   **Solution**:
   - Verify backend is running on `http://localhost:8080`
   - Check `.env.local` has correct `NEXT_PUBLIC_API_URL=http://localhost:8080`
   - Check browser console for CORS errors
   - Restart both frontend and backend

3. **Module Not Found Error**
   ```
   Error: Cannot find module 'axios' or other dependencies
   ```
   **Solution**: Install dependencies:
   ```bash
   cd Frontend
   npm install
   ```

4. **Environment Variable Not Working**
   ```
   Error: API URL is undefined
   ```
   **Solution**:
   - Create `.env.local` file in Frontend folder
   - Add: `NEXT_PUBLIC_API_URL=http://localhost:8080`
   - Restart dev server (Ctrl+C then `npm run dev`)
   - Environment variables must start with `NEXT_PUBLIC_` to be accessible in browser

5. **Node.js Version Error**
   ```
   Error: The engine "node" is incompatible
   ```
   **Solution**: Install Node.js 18 or higher from https://nodejs.org/

6. **Build Fails**
   ```
   Error: Build failed
   ```
   **Solution**:
   - Clear Next.js cache: `rm -rf .next` (Linux/Mac) or `rmdir /s .next` (Windows)
   - Delete node_modules: `rm -rf node_modules` then `npm install`
   - Check for syntax errors in your code

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

## 📚 Additional Documentation

- **Security Guide**: `SECURITY_GUIDE.md` - Environment variables and secrets management
- **JWT Implementation Guide**: `JWT_IMPLEMENTATION_SUMMARY.md`
- **Global Exception Handler Guide**: `GLOBAL_EXCEPTION_HANDLER_GUIDE.md`
- **Postman Testing Guide**: `POSTMAN_TESTING_GUIDE.md`
- **Quick Start Guide**: `QUICK_START.md`

---

## 🤝 Contributing

1. Follow clean architecture principles
2. Maintain proper layer separation
3. Add appropriate validation and error handling
4. Update documentation for new features

---

## 📄 License

This project is created for educational purposes.

---

## 👨‍💻 Developer

**Lakshan**
TaskFlow - A Mini Task Management System
Version: 1.0.0
Last Updated: March 13, 2026

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the additional documentation files
3. Verify all environment variables are set correctly

---

**Happy Task Managing! 🚀**
