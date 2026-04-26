# Admin Panel - Complete Features Guide

## Overview

The admin panel provides full control over the PCD platform. Once an admin account is set up, you have access to powerful management tools for users, courses, lessons, and spacecraft builds.

---

## ✅ What's New for Admins

### 1. **Dashboard Overview Tab**
- Real-time statistics: total users, builds, learning sessions, completed modules
- User role distribution (admin/student breakdown with visual chart)
- Latest spacecraft builds preview
- One-click refresh to update all data

### 2. **User Management Tab**
- **View all users** with their activity metrics (builds, progress sessions)
- **Promote/Demote** users between student and admin roles
- **Delete users** (with safety confirmation)
- **Reset passwords** for users who forget theirs
- Sort by creation date (newest first)

### 3. **Spacecraft Builds Tab**
- View all user-created spacecraft builds
- See who created each build and when
- Display component tags (e.g., "engine", "solar_panel", "antenna")
- Delete invalid or test builds

### 4. **Modules (Courses) Tab** ⭐ NEW
- **Create new courses** with title, description, level, duration, and image
- **View all modules** with lesson count
- **Edit module details**
- **Delete modules** (and all associated lessons/progress)
- Manage complete learning hierarchy

### 5. **Lessons Tab** ⭐ NEW
- **Select a module** to manage its lessons
- **Create lessons** within a module with:
  - Title and content
  - Video URL (optional)
  - Order number (for sequencing)
- **Delete lessons**
- Full control over course content

---

## 🚀 Getting Started as Admin

### Step 1: Set Your Role to Admin in Database

In your Neon console, run:
```sql
SELECT email, role FROM users WHERE email = 'your@email.com';
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### Step 2: Log Out and Log Back In
- Log out from the platform
- Log in with your admin account
- You should now see a **Shield icon** in the navigation

### Step 3: Access Admin Panel
- Click the **Shield icon** in the top navigation
- You'll be redirected to `/admin` with full dashboard access

---

## 📋 API Endpoints (Backend)

All admin endpoints require:
- `Authorization: Bearer {JWT_TOKEN}` header
- User role must be `"admin"` in the database

### **Stats**
```
GET /api/admin/stats
```
Returns total users, builds, progress, role distribution.

### **Users Management**
```
GET    /api/admin/users                          # Get all users
PUT    /api/admin/users/{id}/role                # Update user role
PUT    /api/admin/users/{id}/password            # Reset user password
DELETE /api/admin/users/{id}                     # Delete user
```

### **Modules**
```
GET    /api/admin/modules                        # Get all modules
POST   /api/admin/modules                        # Create module
PUT    /api/admin/modules/{id}                   # Update module
DELETE /api/admin/modules/{id}                   # Delete module
```

### **Lessons**
```
GET    /api/admin/modules/{module_id}/lessons    # Get lessons
POST   /api/admin/modules/{module_id}/lessons    # Create lesson
PUT    /api/admin/lessons/{id}                   # Update lesson
DELETE /api/admin/lessons/{id}                   # Delete lesson
```

### **Builds**
```
GET    /api/admin/builds                         # Get all builds
DELETE /api/admin/builds/{id}                    # Delete build
```

---

## 🎨 Frontend API Functions (TypeScript)

In your frontend code (`api.js`), use these functions:

```typescript
// Stats
api.adminGetStats()

// Users
api.adminGetUsers()
api.adminUpdateRole(userId, role)
api.adminResetPassword(userId, password)
api.adminDeleteUser(userId)

// Modules
api.adminGetModules()
api.adminCreateModule({title, description, level, duration, image_url})
api.adminUpdateModule(moduleId, data)
api.adminDeleteModule(moduleId)

// Lessons
api.adminGetLessons(moduleId)
api.adminCreateLesson(moduleId, {title, content, video_url, order})
api.adminUpdateLesson(lessonId, data)
api.adminDeleteLesson(lessonId)

// Builds
api.adminGetBuilds()
api.adminDeleteBuild(buildId)
```

---

## 🔐 Security Features

- ✅ Admin guard: all endpoints require `role === "admin"`
- ✅ Cannot delete your own account (prevent accidental lockout)
- ✅ Password changes use secure hashing
- ✅ Cascade delete: deleting a module removes its lessons and progress records
- ✅ JWT token validation on all requests

---

## 🎯 Common Admin Tasks

### Promote a Student to Admin
1. Go to Admin Panel → Users tab
2. Find the user in the table
3. Click "Promote" button
4. User is now an admin

### Create a New Course
1. Go to Admin Panel → Modules tab
2. Click "+ New Module"
3. Fill in the form:
   - Title: "Advanced Orbital Mechanics"
   - Description: Course overview
   - Level: "Advanced"
   - Duration: "4 hours"
   - Image URL: (optional)
4. Click "Create"

### Add Lessons to a Course
1. Go to Modules tab
2. Find your course and click "Manage"
3. Lessons tab will load with your module selected
4. Click "+ New Lesson"
5. Enter lesson details (title, content, video URL, order)
6. Click "Create"

### Delete a User and Their Data
1. Go to Admin Panel → Users tab
2. Find the user
3. Click the trash icon
4. Confirm deletion
5. User and all their builds/progress are removed

---

## ⚠️ Important Notes

- **Backup your database** before bulk deletes
- **Deleting modules cascades** to all lessons and student progress
- **Password resets** require you to know or generate a new password
- **Role changes are immediate** (user needs to log out/in to see changes)
- **All timestamps use UTC** in the database

---

## 📞 Troubleshooting

### Admin Button Not Showing?
1. Verify your role is `"admin"` in the database
2. Refresh the page (Ctrl+F5) to clear cache
3. Check browser console for JWT errors

### Can't Create Modules?
1. Ensure you're logged in as admin
2. Check that required fields aren't empty
3. Verify backend is running (`python run.py`)

### Lesson Creation Fails?
1. Make sure you've selected a module first
2. Module must exist in the database
3. Check backend console for SQL errors

---

## 🎓 Example: Create a Complete Course

```
1. Create Module: "Introduction to Space Flight"
   - Level: Beginner
   - Duration: 3 hours

2. Add Lessons (in order):
   - Lesson 1: "What is Orbital Mechanics?"
   - Lesson 2: "Newton's Laws in Space"
   - Lesson 3: "Launch Windows and Trajectories"
   - Lesson 4: "Quiz: Test Your Knowledge"

3. Each lesson has:
   - Title, content, optional video
   - Order (determines sequence)
   - Can be edited or deleted anytime
```

---

## 🚀 Next Steps

- Invite other team members as admins
- Build out your course library
- Monitor student progress from the Overview tab
- Create backups regularly
- Establish admin team guidelines

Enjoy your platform! 🎉
