# Lead Rockets Deployment Guide

## 🚀 Quick Start

### Option 1: Railway (Recommended - Free)
1. **Create Railway Account**: Sign up at [railway.app](https://railway.app)

2. **Deploy Backend**:
   ```bash
   cd backend
   railway login
   railway link
   railway up
   ```

3. **Deploy Frontend**:
   ```bash
   cd ..
   railway up
   ```

4. **Set Environment Variables**:
   ```bash
   railway service
   # Select your backend service
   railway variables set NODE_ENV=production
   railway variables set MONGODB_URI=<your_mongodb_uri>
   railway variables set JWT_SECRET=<generate_secure_secret>
   railway variables set FRONTEND_URL=https://your-app.railway.app
   ```

### Option 2: Render (Free)
1. **Connect Repository**: Connect your GitHub repository to [render.com](https://render.com)

2. **Deploy Backend**:
   - Create new Web Service
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Add environment variables from `.env.example`

3. **Deploy Frontend**:
   - Create new Static Site
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### Option 3: Local Development
1. **Start MongoDB** (Local or MongoDB Atlas free tier)

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ..
   npm install
   npm run dev
   ```

## 🔧 Environment Configuration

### Required Environment Variables

#### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# Database (MongoDB Atlas Free Tier)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leadrockets

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_REFRESH_EXPIRE=30d

# Email Configuration (Gmail - Free)
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-gmail-app-password

# API Keys (Optional - for CRM integrations)
HUBSPOT_API_KEY=your-hubspot-api-key
PIPEDRIVE_API_KEY=your-pipedrive-api-key
```

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Free)
1. **Create Account**: [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**: Choose free tier (M0)
3. **Create Database User**
4. **Whitelist IP**: Add `0.0.0.0/0` for all access
5. **Get Connection String**: Use in `MONGODB_URI`

### Option 2: Local MongoDB
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start MongoDB
mongod
```

## 📧 Email Configuration (Gmail - Free)

1. **Enable 2FA** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Use in .env**:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   ```

## 🚀 Production Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB Atlas
- [ ] Set up Gmail SMTP
- [ ] Generate secure JWT secrets
- [ ] Configure CORS origins
- [ ] Set up health check endpoint
- [ ] Enable rate limiting
- [ ] Configure error monitoring (Sentry free tier)
- [ ] Set up domain (optional)

## 🔍 Monitoring & Analytics

### Free Options:
- **Railway Dashboard**: Built-in monitoring
- **Render Dashboard**: Performance metrics
- **MongoDB Atlas**: Database monitoring
- **Sentry**: Error tracking (free tier)

## 🔒 Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure JWT secrets
- [ ] Configure rate limiting
- [ ] Enable helmet security headers
- [ ] Use strong passwords for database
- [ ] Regular dependency updates
- [ ] Environment variable validation

## 🧪 Testing

```bash
# Run tests
cd backend
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📞 Support

### Free Resources:
- **GitHub Issues**: Bug reports and feature requests
- **Stack Overflow**: Technical questions
- **MongoDB Community**: Database help
- **Node.js Documentation**: API reference

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check MongoDB URI format
   - Verify username/password
   - Check network access

2. **Email Sending Failed**
   - Verify Gmail app password
   - Check SMTP settings
   - Enable less secure apps (if needed)

3. **Build Failed**
   - Check Node.js version (18+ required)
   - Verify all dependencies installed
   - Check environment variables

4. **CORS Errors**
   - Update FRONTEND_URL in backend
   - Check CORS configuration

## 📈 Scaling (When Needed)

### Free Scaling Options:
- **Railway**: Upgrade to paid plan for more resources
- **Render**: Upgrade for higher limits
- **MongoDB Atlas**: Upgrade cluster tier
- **Redis**: Add for caching (Redis Labs free tier)

## 🔄 CI/CD Pipeline (Free)

### GitHub Actions (Free):
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
```

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Happy Deploying! 🎉**