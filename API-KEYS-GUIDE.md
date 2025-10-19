# 🔑 Lead Rockets API Keys Guide

## 📋 **API KEYS OVERVIEW**

Here's exactly what API keys and services you need to run Lead Rockets SaaS:

---

## **🚨 MANDATORY (No API Keys Required)**

### **1. JWT Secrets (Generate Yourself)**
```env
JWT_SECRET=your-super-secure-jwt-secret-here-minimum-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-here-minimum-32-characters
```

**How to Generate:**
```bash
# Generate secure random strings (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Cost:** ✅ **FREE** (you generate these)

---

## **📧 EMAIL SERVICE (Gmail - Free)**

### **Gmail SMTP Configuration**
```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-gmail-app-password
```

### **Setup Instructions:**

1. **Enable 2-Factor Authentication:**
   - Go to https://myaccount.google.com
   - Security → 2-Step Verification → Turn ON

2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (custom name)"
   - Enter "Lead Rockets"
   - Copy the 16-character password

3. **Add to .env:**
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=abcd-efgh-ijkl-mnop
   ```

**Cost:** ✅ **FREE**
**Limit:** 500 emails/day (more than enough for SaaS)

---

## **🗄️ DATABASE (MongoDB Atlas - Free)**

### **MongoDB Atlas Configuration**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leadrockets
```

### **Setup Instructions:**

1. **Create Account:** https://mongodb.com/atlas

2. **Create Free Cluster:**
   - Choose "M0 Sandbox" (FREE)
   - Region: Choose closest to your users
   - Cluster Name: "leadrockets"

3. **Create Database User:**
   - Username: `leadrockets_user`
   - Password: Generate secure password
   - Role: "Read and write"

4. **Network Access:**
   - Add IP: `0.0.0.0/0` (allow all - for development)
   - For production: Add specific IP ranges

5. **Get Connection String:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

**Cost:** ✅ **FREE** (512MB storage, shared cluster)
**Limit:** 512MB storage, suitable for thousands of users

---

## **🔗 CRM INTEGRATIONS (Optional - Free)**

### **HubSpot (Free Tier)**
```env
HUBSPOT_API_KEY=6bbd1422-ebc5-4240-813a-a7bfe2d00455
```

**Setup:**
1. Create account: https://hubspot.com
2. Go to Settings → Integrations → API Key
3. Generate API Key
4. **Free Limit:** 1,000 contacts, 2 users

---

### **Pipedrive (Free Tier)**
```env
PIPEDRIVE_API_KEY=demo_or_your_pipedrive_api_key
```

**Setup:**
1. Create account: https://pipedrive.com
2. Go to Settings → Personal → API
3. Generate API Key
4. **Free Limit:** 300 deals, 1 user

---

## **🤖 AI ENHANCEMENT (Optional)**

### **Google AI API (For Enhanced Lead Generation)**
```env
GOOGLE_AI_API_KEY=AIza_your_google_ai_api_key
```

**Setup:**
1. Create account: https://aistudio.google.com
2. Click "Get API key" in the left sidebar
3. Create API key and copy it
4. **Cost:** ✅ **FREE** (No usage limits for basic requests)

**Note:** The app works without this - uses simulated AI

---

### **OpenAI API (Alternative AI Provider)**
```env
OPENAI_API_KEY=sk-your-openai-api-key
```

**Setup:**
1. Create account: https://platform.openai.com
2. Generate API Key in dashboard
3. **Free Limit:** $5 free credit for new accounts

**Note:** Alternative to Google AI - app works without either

---

## **💳 PAYMENT PROCESSING (Optional)**

### **Stripe (For Real Payments)**
```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**Setup:**
1. Create account: https://stripe.com
2. Get test API keys from dashboard
3. **Note:** App includes simulated payment system

---

## **📊 ANALYTICS (Optional)**

### **Google Analytics (Free)**
```javascript
// Add to frontend
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

---

## **🚨 PRODUCTION SECURITY NOTES**

### **Environment Variables Security:**
```bash
# ✅ DO THIS:
echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")" >> .env

# ❌ DON'T DO THIS:
echo "JWT_SECRET=123456" >> .env
```

### **Secret Management:**
- **Railway:** Variables are encrypted automatically
- **Render:** Use built-in secret management
- **Never commit** `.env` files to Git

---

## **🎯 MINIMAL SETUP (Works Immediately)**

### **For Basic Functionality (No External APIs):**
```env
# Generate these:
JWT_SECRET=your-32-char-secret-here
JWT_REFRESH_SECRET=your-32-char-refresh-secret

# Database (MongoDB Atlas Free):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leadrockets

# Email (Gmail Free):
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-gmail-app-password

# Server Config:
NODE_ENV=production
FRONTEND_URL=https://your-deployed-domain.com
PORT=5000
```

**✅ This basic setup provides:**
- User registration/login
- Lead generation (simulated AI)
- Email notifications
- Dashboard functionality
- Subscription management

---

## **🚀 ENHANCED SETUP (With CRM Integration):**

### **Add After Basic Setup Works:**
```env
# HubSpot Integration:
HUBSPOT_API_KEY=demo_your_hubspot_key

# Pipedrive Integration:
PIPEDRIVE_API_KEY=demo_your_pipedrive_key

# Google AI (Recommended - Free):
GOOGLE_AI_API_KEY=AIza_your_google_ai_key

# OpenAI (Alternative):
OPENAI_API_KEY=sk_your_openai_key
```

---

## **💰 COST SUMMARY**

| Service | Cost | Limit | Purpose |
|---------|------|-------|---------|
| **MongoDB Atlas** | $0 | 512MB | Database |
| **Gmail SMTP** | $0 | 500/day | Emails |
| **Railway/Render** | $0 | Hobby tier | Hosting |
| **HubSpot** | $0 | 1,000 contacts | CRM |
| **Pipedrive** | $0 | 300 deals | CRM |
| **Google AI** | $0 | Unlimited | Enhanced AI |
| **OpenAI** | $0 | $5 free credit | Enhanced AI |

**Total Cost:** ✅ **$0/month** for basic functionality

---

## **🔧 SETUP ORDER**

### **Phase 1: Basic Setup (15 minutes)**
1. ✅ Generate JWT secrets
2. ✅ Set up MongoDB Atlas (free)
3. ✅ Configure Gmail SMTP (free)
4. ✅ Deploy to Railway (free)
5. ✅ Test basic functionality

### **Phase 2: Enhanced Features (Optional)**
1. 🔄 Add Google AI API key (free - recommended)
2. 🔄 Add HubSpot API key (free)
3. 🔄 Add Pipedrive API key (free)
4. 🔄 Add OpenAI key (optional alternative)
5. 🔄 Test AI-enhanced lead generation
6. 🔄 Test CRM integrations

---

## **🛠️ TESTING YOUR SETUP**

### **Test Database:**
```bash
# Should return OK
curl https://your-backend.com/health
```

### **Test Email:**
```bash
# Send test email via API
curl -X POST https://your-backend.com/api/emails/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Test Lead Generation:**
```bash
# Generate test leads
curl -X POST https://your-backend.com/api/lead-generation/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"count": 5}'
```

---

## **🔍 TROUBLESHOOTING API KEYS**

### **Common Issues:**

1. **"Database connection failed"**
   - Check MongoDB connection string format
   - Verify username/password in Atlas
   - Check if IP is whitelisted

2. **"Email sending failed"**
   - Verify Gmail app password (not regular password)
   - Check if 2FA is enabled on Gmail
   - Try sending test email

3. **"CRM sync failed"**
   - Verify API keys are correct
   - Check CRM account permissions
   - Test API keys in CRM dashboard

---

## **📞 GETTING HELP**

### **Free Resources:**
- **MongoDB Community:** https://community.mongodb.com
- **Gmail SMTP Issues:** https://support.google.com/mail
- **Railway Support:** https://docs.railway.app
- **Stack Overflow:** Ask technical questions

---

## **✅ READY TO DEPLOY CHECKLIST**

- [ ] JWT secrets generated (32+ characters)
- [ ] MongoDB Atlas cluster created (free)
- [ ] Gmail app password generated
- [ ] Environment variables configured
- [ ] Application deployed successfully
- [ ] Health check passing
- [ ] Test user registration working
- [ ] Email notifications working

**🎉 You're ready to deploy!**

---

## **🚨 IMPORTANT NOTES**

1. **No Credit Card Required** for any of these services
2. **All Services Have Free Tiers** sufficient for SaaS launch
3. **Scale Up Later** when you have paying customers
4. **Start Simple** - basic setup works immediately
5. **Add Complexity** only when needed

**Your Lead Rockets SaaS is ready for deployment with $0/month cost!** 🚀