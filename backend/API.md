# Lead Rockets API Documentation

## Overview
Lead Rockets is a SaaS platform for AI-powered lead generation and management. This API provides endpoints for user authentication, lead management, CRM integration, payments, and analytics.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All API endpoints (except authentication endpoints) require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Lead Management

#### Get Leads
```http
GET /leads?status=new&priority=high&page=1&limit=10
Authorization: Bearer <token>
```

#### Create Lead
```http
POST /leads
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "Acme Corp",
  "contactName": "Jane Smith",
  "email": "jane@acme.com",
  "industry": "Technology",
  "companySize": "51-200"
}
```

#### Update Lead
```http
PUT /leads/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "qualified",
  "notes": "Great potential lead"
}
```

#### Delete Lead
```http
DELETE /leads/:id
Authorization: Bearer <token>
```

### Lead Generation

#### Generate Leads
```http
POST /lead-generation/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "count": 5
}
```

#### Get Lead Statistics
```http
GET /lead-generation/stats
Authorization: Bearer <token>
```

### CRM Integration

#### Sync Lead to CRM
```http
POST /crm/sync/:leadId
Authorization: Bearer <token>
```

#### Configure CRM Integration
```http
POST /crm/configure
Authorization: Bearer <token>
Content-Type: application/json

{
  "crmType": "hubspot",
  "config": {
    "apiKey": "your_hubspot_api_key"
  }
}
```

### Payments

#### Create Payment Intent
```http
POST /payments/create-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan": "pro",
  "interval": "month"
}
```

#### Process Payment
```http
POST /payments/process
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan": "pro",
  "interval": "month"
}
```

### Email Notifications

#### Send Test Email
```http
POST /emails/test
Authorization: Bearer <token>
```

#### Send Welcome Email
```http
POST /emails/welcome
Authorization: Bearer <token>
```

### Analytics

#### Get User Analytics
```http
GET /analytics/user?period=30d
Authorization: Bearer <token>
```

#### Get Admin Analytics
```http
GET /analytics/admin?period=30d
Authorization: Bearer <token>
```

#### Export Analytics
```http
GET /analytics/export?format=csv
Authorization: Bearer <token>
```

### Admin Panel

#### Get Admin Statistics
```http
GET /admin/stats
Authorization: Bearer <token>
```

#### Get All Users
```http
GET /admin/users?page=1&limit=10
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per 15-minute window per IP address.

## Webhooks

### Payment Webhook
```http
POST /payments/webhook
Content-Type: application/json

{
  "type": "payment_intent.succeeded",
  "data": {
    "paymentId": "pi_123",
    "amount": 997,
    "currency": "usd"
  }
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/leadrockets

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRE=30d

# Email Configuration (Gmail)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# API Keys (for CRM integrations)
HUBSPOT_API_KEY=your-hubspot-api-key
PIPEDRIVE_API_KEY=your-pipedrive-api-key
```

## Getting Started

1. **Start the server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Register a new user:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
   ```

3. **Login to get token:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"password123"}'
   ```

4. **Use the token for authenticated requests:**
   ```bash
   curl -X GET http://localhost:5000/api/leads \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## Support

For API support or questions, please contact the development team or check the help documentation.