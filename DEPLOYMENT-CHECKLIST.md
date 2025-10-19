# 🚀 Lead Rockets Deployment Checklist

## ✅ PRE-DEPLOYMENT CHECKLIST

### **1. Environment Setup**
- [ ] Create production `.env` file from `.env.example`
- [ ] Set `NODE_ENV=production`
- [ ] Generate secure JWT secrets
- [ ] Configure production database URL

### **2. Database Setup (Choose One)**

#### **Option A: MongoDB Atlas (Free)**
- [ ] Create MongoDB Atlas account at https://mongodb.com/atlas
- [ ] Create free M0 cluster (512MB storage)
- [ ] Create database user with read/write permissions
- [ ] Whitelist IP: `0.0.0.0/0` (for all access)
- [ ] Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/leadrockets`

#### **Option B: Railway MongoDB (Free)**
- [ ] Deploy with `railway up` (includes free MongoDB)
- [ ] Get `MONGODB_URI` from Railway dashboard

### **3. Email Configuration (Gmail - Free)**
- [ ] Enable 2FA on Gmail account
- [ ] Generate App Password:
  - Go to Google Account → Security → 2-Step Verification → App passwords
  - Select "Mail" and generate password
- [ ] Set in `.env`:
  ```env
  SMTP_USER=your-email@gmail.com
  SMTP_PASS=your-16-character-app-password
  ```

### **4. Required API Keys & Services**

| Service | Purpose | Free Tier Available | Setup Required |
|---------|---------|-------------------|----------------|
| **MongoDB Atlas** | Database | ✅ 512MB free | Create account & cluster |
| **Gmail SMTP** | Email notifications | ✅ Free | Generate app password |
| **Railway/Render** | Hosting | ✅ Free tiers | Create account |
| **HubSpot** (Optional) | CRM Integration | ✅ Free | Get API key |
| **Pipedrive** (Optional) | CRM Integration | ✅ Free | Get API key |

## 🔑 **REQUIRED API KEYS & SECRETS**

### **Mandatory (No API Keys Needed)**
```env
# Generate these yourself:
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
```

### **Optional (For Enhanced Features)**
```env
# CRM Integrations (Free):
HUBSPOT_API_KEY=demo_or_your_hubspot_api_key
PIPEDRIVE_API_KEY=demo_or_your_pipedrive_api_key

# Email (Gmail - Free):
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-gmail-app-password

# External APIs (Optional):
OPENAI_API_KEY=your-openai-key-for-enhanced-ai
```

## 🚢 **DEPLOYMENT INSTRUCTIONS**

### **Railway Deployment (Easiest - Free)**

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy Backend:**
   ```bash
   cd backend
   railway login
   railway link
   railway up
   ```

3. **Deploy Frontend:**
   ```bash
   cd ..
   railway up
   ```

4. **Set Environment Variables:**
   ```bash
   # In Railway dashboard or CLI:
   railway variables set NODE_ENV=production
   railway variables set MONGODB_URI=mongodb+srv://...
   railway variables set JWT_SECRET=your-secret
   railway variables set FRONTEND_URL=https://your-app.railway.app
   ```

### **Render Deployment (Alternative - Free)**

1. **Connect Repository:**
   - Go to https://render.com
   - Connect your GitHub repository

2. **Deploy Backend:**
   - Create "Web Service"
   - Runtime: Node.js
   - Build Command: `npm run build`
   - Start Command: `npm start`

3. **Deploy Frontend:**
   - Create "Static Site"
   - Build Command: `npm run build`
   - Publish Directory: `dist`

## 🔧 **POST-DEPLOYMENT VERIFICATION**

### **Health Check:**
```bash
curl https://your-backend-domain.com/health
# Should return: {"status":"OK","timestamp":"...","uptime":...}
```

### **Test API Endpoints:**
```bash
# Register new user
curl -X POST https://your-backend-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST https://your-backend-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### **Test Frontend:**
- Open your deployed frontend URL
- Register a new account
- Generate some leads
- Check email notifications

## 🛠️ **PRODUCTION OPTIMIZATIONS**

### **Performance:**
- [ ] Enable gzip compression (already configured)
- [ ] Set up database indexes (already configured)
- [ ] Configure rate limiting (already configured)
- [ ] Enable CORS for production domain

### **Security:**
- [ ] Use HTTPS (automatic with Railway/Render)
- [ ] Set secure cookies
- [ ] Enable helmet security headers (already configured)
- [ ] Configure rate limiting (already configured)

### **Monitoring:**
- [ ] Set up error logging
- [ ] Monitor database performance
- [ ] Track API usage
- [ ] Set up health checks

## 🔍 **TROUBLESHOOTING**

### **Common Issues:**

1. **Database Connection Failed:**
   ```bash
   # Check MongoDB connection string format
   # Verify username/password in Atlas
   # Check network access settings
   ```

2. **Email Not Sending:**
   ```bash
   # Verify Gmail app password
   # Check SMTP settings in .env
   # Test with: railway logs (for Railway deployment)
   ```

3. **Build Failed:**
   ```bash
   # Check Node.js version (needs 18+)
   # Verify all dependencies installed
   # Check environment variables
   ```

## 📊 **MONITORING & ANALYTICS**

### **Free Monitoring Options:**
- **Railway Dashboard** - Built-in metrics
- **Render Dashboard** - Performance monitoring
- **MongoDB Atlas** - Database metrics
- **Application Logs** - Error tracking

## 🚨 **IMPORTANT SECURITY NOTES**

1. **Never commit `.env` files** to Git
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Rotate secrets regularly** in production
4. **Monitor for suspicious activity**
5. **Keep dependencies updated**

## 🎯 **NEXT STEPS AFTER DEPLOYMENT**

1. **Test Core Functionality:**
   - User registration/login
   - Lead generation
   - Email notifications
   - Dashboard access

2. **Set Up CRM Integrations:**
   - Connect HubSpot/Pipedrive accounts
   - Test lead syncing
   - Configure webhooks

3. **Monitor Performance:**
   - Check database usage
   - Monitor API response times
   - Track error rates

4. **Scale When Needed:**
   - Upgrade MongoDB cluster if needed
   - Add Redis for caching (free tiers available)
   - Consider CDN for static assets

## 📞 **SUPPORT & RESOURCES**

- **Railway Documentation:** https://docs.railway.app
- **Render Documentation:** https://render.com/docs
- **MongoDB Atlas Guide:** https://docs.atlas.mongodb.com
- **Gmail SMTP Setup:** https://support.google.com/mail/answer/185833

---

## ✅ **DEPLOYMENT STATUS**

- [ ] Database configured
- [ ] Email service set up
- [ ] Environment variables configured
- [ ] Application deployed
- [ ] Health check passing
- [ ] Core features tested

**🎉 Ready for Production Deployment!**