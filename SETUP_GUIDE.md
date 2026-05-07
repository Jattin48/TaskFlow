## Setup Guide for TaskFlow

### Step 1: Clone/Setup Repository
```bash
cd "New folder"
```

### Step 2: Backend Setup

#### 2.1 Install Dependencies
```bash
cd Backend
npm install
```

#### 2.2 Configure MongoDB
- **Local MongoDB**: Ensure MongoDB is running on `localhost:27017`
- **MongoDB Atlas**: Update `MONGODB_URI` in `.env` with your connection string

#### 2.3 Update Environment Variables
Edit `Backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/TaskManager
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

#### 2.4 Start Backend Server
```bash
npm run dev
```
Expected output:
```
MongoDB Connected: localhost
Server running on port 5000
```

### Step 3: Frontend Setup

#### 3.1 Install Dependencies
```bash
cd Frontend
npm install
```

#### 3.2 Start Development Server
```bash
npm run dev
```
Expected output:
```
VITE v8.0.4  ready in 123 ms

➜  Local:   http://localhost:5173/
```

### Step 4: Access the Application

1. Open browser: `http://localhost:5173`
2. Register a new account (or login if you have one)
3. Create your first project
4. Add tasks and start managing

## Testing the Application

### Test Account 1
- Email: `test@example.com`
- Password: `password123`

### Test Workflows

**Create a Project:**
1. Click "+ New Project"
2. Enter project name and description
3. Choose icon and color
4. Click "Create Project"

**Create a Task:**
1. Open a project
2. Click "+ Add Task"
3. Enter task title and details
4. Set priority and due date
5. Click "Create Task"

**Update Task Status:**
1. Drag task between columns OR
2. Click task and update status

## Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Ensure MongoDB is installed and running
- Use MongoDB Atlas cloud version instead
- Update `MONGODB_URI` in `.env`

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Backend CORS is already configured. Ensure backend is running on port 5000.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**:
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F
```

### Node Modules Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Deployment Checklist

- [ ] Update JWT_SECRET to a strong random key
- [ ] Configure production MongoDB
- [ ] Build frontend: `npm run build` in Frontend folder
- [ ] Set NODE_ENV to 'production'
- [ ] Configure CORS for production domain
- [ ] Setup SSL/HTTPS
- [ ] Add database backups
- [ ] Setup monitoring and logging
- [ ] Add email notifications
- [ ] Create admin dashboard

## Next Steps to Sell

1. **Polish & Testing**
   - Test all features thoroughly
   - Fix any bugs
   - Optimize performance

2. **Documentation**
   - User guide
   - API documentation
   - Developer guide

3. **Marketing**
   - Create landing page
   - Write case studies
   - Set pricing tiers

4. **Infrastructure**
   - Deploy to cloud (AWS, GCP, Azure)
   - Setup CI/CD pipeline
   - Configure monitoring

5. **Legal**
   - Terms of Service
   - Privacy Policy
   - SLA agreement

## Support

For troubleshooting or questions, refer to the main README.md file.
