# TaskFlow - Task Management Application

A modern task management application built with Next.js, featuring task tracking, analytics, and user profiles.

## Features

- 📝 **Task Management**: Create, edit, and delete tasks
- 📊 **Dashboard**: View analytics with interactive charts
- ✅ **Task Tracking**: Monitor task completion and progress
- 🔍 **Search & Filter**: Find tasks quickly
- 👤 **User Profile**: Manage user information
- 🔐 **Authentication**: Secure JWT-based login and registration
- 🎨 **Responsive Design**: Clean UI that works on all devices
- 🔔 **Notifications**: Toast notifications for user actions

## Tech Stack

- **Framework**: Next.js 14
- **UI**: React 18
- **Styling**: CSS Modules
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Notifications**: React Toastify
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- **Node.js 18+** installed
  - Download from: https://nodejs.org/
  - Verify: `node --version` and `npm --version`
- **Backend API** running on port 8080
  - The Spring Boot backend must be running before starting the frontend

### Installation

1. **Navigate to the Frontend directory**
   ```bash
   cd C:\Users\LAKSHAN\TaskFlow\Backend\Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Environment Variables

**Required:** Create a `.env.local` file in the Frontend root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Important Notes:**
- ⚠️ Environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- ⚠️ Never commit `.env.local` to version control (already in .gitignore)
- ⚠️ Restart the dev server after changing environment variables

### Running the Application

**Development Mode (with hot reload):**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

**Production Build:**
```bash
# Build the application
npm run build

# Run the production build
npm run start
```

**Run on Different Port:**
```bash
npm run dev -- -p 3001
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run lint` | Run ESLint to check code quality |

## Project Structure

```
Frontend/
├── pages/                      # Next.js pages (file-based routing)
│   ├── index.js               # Login page (/)
│   ├── signup.js              # Registration page (/signup)
│   ├── dashboard.js           # Main dashboard (/dashboard)
│   ├── all-tasks.js           # All tasks view (/all-tasks)
│   ├── add-task.js            # Create task page (/add-task)
│   ├── completed-tasks.js     # Completed tasks (/completed-tasks)
│   ├── _app.js                # Custom App component
│   └── _document.js           # Custom Document component
├── components/                 # Reusable React components
├── services/                   # API service layer
│   ├── api.js                 # Axios instance with interceptors
│   ├── authService.js         # Authentication API calls
│   └── taskService.js         # Task CRUD API calls
├── styles/                     # CSS modules and global styles
├── public/                     # Static assets (images, icons)
├── .env.local                 # Environment variables (not in git)
├── .gitignore                 # Git ignore rules
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## API Integration

The frontend communicates with the Spring Boot backend through axios services:

### Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User login (returns JWT token)

### Tasks
- `POST /tasks` - Create new task
- `GET /tasks` - Get all tasks for logged-in user
- `PUT /tasks` - Update task
- `DELETE /tasks/{id}` - Delete task

**JWT Token Handling:**
- Token is stored in `localStorage` after login
- Automatically added to request headers via axios interceptor
- Token expires after 1 hour (backend setting)

## Pages Overview

| Page | Route | Route | Description | Auth Required |
|------|-------|-------------|---------------|
| Login | `/` | User login | No |
| Sign Up | `/signup` | User registration | No |
| Dashboard | `/dashboard` | Analytics and overview | Yes |
| All Tasks | `/all-tasks` | View and manage all tasks | Yes |
| Add Task | `/add-task` | Create a new task | Yes |
| Completed Tasks | `/completed-tasks` | View completed tasks | Yes |

## How to Use

1. **Start the Backend** (Spring Boot API must be running)
   ```bash
   cd C:\Users\LAKSHAN\TaskFlow\Backend
   mvn spring-boot:run
   ```

2. **Start the Frontend**
   ```bash
   cd C:\Users\LAKSHAN\TaskFlow\Backend\Frontend
   npm run dev
   ```

3. **Access the Application**
   - Open browser to `http://localhost:3000`
   - Sign up for a new account
   - Login with your credentials
   - Start managing your tasks!

## Troubleshooting

### Frontend Won't Start

**Problem**: `Error: Port 3000 is already in use`
```bash
# Solution 1: Stop the process on port 3000
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Solution 2: Use a different port
npm run dev -- -p 3001
```

### Cannot Connect to Backend

**Problem**: `Network Error` or API requests failing

**Solutions**:
1. Verify backend is running: `http://localhost:8080`
2. Check `.env.local` file exists with:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```
3. Restart frontend server after creating/editing `.env.local`
4. Check browser console for specific error messages

### Login/Registration Not Working

**Problem**: Authentication fails

**Solutions**:
1. Check backend logs for errors
2. Verify database is running and connected
3. Check browser Network tab to see API response
4. Ensure JWT_Secret_Key is set in backend environment variables

### Module Not Found

**Problem**: `Cannot find module 'axios'` or other dependencies

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json  # Linux/Mac
# or
rmdir /s node_modules ; del package-lock.json  # Windows CMD

npm install
```

### Environment Variable Not Working

**Problem**: API calls go to wrong URL

**Solutions**:
1. Ensure `.env.local` file is in Frontend root directory
2. Variable must be `NEXT_PUBLIC_API_URL` (exact name)
3. Restart dev server (Ctrl+C then `npm run dev`)
4. Check console: `console.log(process.env.NEXT_PUBLIC_API_URL)`

### Build Errors

**Problem**: `npm run build` fails

**Solutions**:
```bash
# Clear Next.js cache
rm -rf .next  # Linux/Mac
rmdir /s .next  # Windows CMD

# Reinstall dependencies
npm install

# Try building again
npm run build
```

## Dependencies

### Core
- **next**: ^14.2.0 - React framework for production
- **react**: ^18.3.0 - JavaScript library for building UI
- **react-dom**: ^18.3.0 - React DOM renderer

### HTTP & State
- **axios**: ^1.12.2 - Promise-based HTTP client

### UI & UX
- **lucide-react**: ^0.553.0 - Beautiful icon set
- **react-toastify**: ^11.0.5 - Notification system
- **recharts**: ^3.3.0 - Charting library

### Development
- **eslint**: ^8.57.0 - Code linting
- **eslint-config-next**: ^14.2.0 - ESLint config for Next.js

## Learn More

### Next.js Documentation
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features
- [Learn Next.js](https://nextjs.org/learn) - Interactive tutorial
- [Next.js GitHub](https://github.com/vercel/next.js) - Source code

### Deployment
- Deploy on [Vercel](https://vercel.com/new) - Zero-config deployment
- Deploy on [Netlify](https://www.netlify.com/) - Alternative platform
- Deploy on custom server - Use `npm run build && npm run start`

## Support

For issues or questions:
1. Check this README troubleshooting section
2. Verify backend is running and accessible
3. Check browser console for error messages
4. Review backend README for API documentation

---

**Built with ❤️ using Next.js and React**
├── services/          # API service layer
├── styles/            # CSS Modules
└── public/            # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features Overview

### Authentication
- User login and signup
- Session management with localStorage

### Task Management
- Create, read, update, delete tasks
- Set priority levels (High, Medium, Low)
- Set due dates
- Mark tasks as completed

### Dashboard
- Overview cards with task statistics
- Daily completion trend chart
- Task distribution pie chart

### Filtering & Search
- Filter by priority
- Filter by date (Overdue, Today, Upcoming)
- Search tasks by title or description

## License

This project is private and proprietary.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
