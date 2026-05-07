# TaskFlow - Deployment Guide

## Cloud Deployment Options

### Option 1: Heroku (Backend) + Vercel (Frontend)

#### Backend on Heroku

1. **Install Heroku CLI**
   ```bash
   # https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd Backend
   heroku create taskflow-backend
   ```

4. **Add MongoDB Atlas**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your_production_secret
   heroku config:set NODE_ENV=production
   ```

6. **Create Procfile**
   ```
   web: node index.js
   ```

7. **Deploy**
   ```bash
   git push heroku main
   ```

#### Frontend on Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd Frontend
   vercel
   ```

3. **Set Environment Variables**
   - `VITE_API_URL=https://taskflow-backend.herokuapp.com/api`

### Option 2: DigitalOcean App Platform

1. Connect your GitHub repository
2. Select Backend folder as service
3. Add environment variables
4. Deploy!

### Option 3: AWS

1. **Backend (Lambda + API Gateway)**
   - Package Express app
   - Upload to Lambda
   - Configure API Gateway

2. **Frontend (S3 + CloudFront)**
   - Build React app
   - Upload to S3
   - Configure CloudFront CDN

3. **Database (RDS)**
   - Use AWS RDS for MongoDB (or Atlas)

### Option 4: Google Cloud Run

```bash
# Backend
gcloud run deploy taskflow-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI=your_mongodb_uri,JWT_SECRET=your_secret

# Frontend (Firebase Hosting)
firebase deploy
```

## Environment Variables (Production)

### Backend
```env
PORT=8080
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/TaskManager
JWT_SECRET=generate_strong_random_key_here
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### Frontend
```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=TaskFlow
VITE_ENVIRONMENT=production
```

## Pre-Deployment Checklist

- [ ] Code tested locally
- [ ] All env variables set
- [ ] Database backups configured
- [ ] SSL/HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting added
- [ ] Error logging setup
- [ ] Performance optimized
- [ ] Security headers added

## Monitoring & Maintenance

### Logging
```bash
# Heroku logs
heroku logs --tail

# Vercel logs
vercel logs
```

### Monitoring Tools
- New Relic
- DataDog
- Sentry (error tracking)
- Uptime Robot (uptime monitoring)

### Performance Optimization
- Enable gzip compression
- Use CDN for static files
- Database indexing
- API caching
- Image optimization

## Scaling Strategy

1. **Initial**: Heroku free tier + MongoDB Atlas free
2. **Growth**: Upgrade Heroku dynos + dedicated MongoDB
3. **Scale**: Kubernetes (GKE/EKS) + Managed DB
4. **Enterprise**: Multi-region deployment + CDN

## Cost Estimates (Monthly)

| Service | Free | Starter | Growth |
|---------|------|---------|--------|
| Backend | $0 | $7 | $50+ |
| Frontend | $0 | $20 | $50+ |
| Database | Free | $15 | $100+ |
| **Total** | **$0** | **$42** | **$200+** |

## Support & Resources

- Heroku Docs: https://devcenter.heroku.com
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Docker Guide: https://docs.docker.com
