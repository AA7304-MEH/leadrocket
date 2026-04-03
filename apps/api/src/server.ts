import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import * as Sentry from '@sentry/node';
import { connectDB } from './utils/database';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import leadRoutes from './routes/leads';
import subscriptionRoutes from './routes/subscriptions';
import leadGenerationRoutes from './routes/leadGeneration';
import crmRoutes from './routes/crm';
import paymentRoutes from './routes/payments';
import emailRoutes from './routes/emails';
import adminRoutes from './routes/admin';
import analyticsRoutes from './routes/analytics';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
// @ts-ignore
import xss from 'xss-clean';
import hpp from 'hpp';
import aiRoutes from './routes/aiRoutes';
import deliverabilityRoutes from './routes/deliverabilityRoutes';
import verifyRoutes from './routes/verifyRoutes';
import campaignRoutes from './routes/campaignRoutes';
import replyRoutes from './routes/replyRoutes';
import doctorRoutes from './routes/doctorRoutes';
import coachingRoutes from './routes/coachingRoutes';
import integrationRoutes from './routes/integrationRoutes';
import complianceRoutes from './routes/complianceRoutes';
import razorpayRoutes from './routes/razorpayRoutes';
import abTestRoutes from './routes/abTestRoutes';
import senderRoutes from './routes/senderRoutes';
import growthRoutes from './routes/growthRoutes';
import gamificationRoutes from './routes/gamificationRoutes';

dotenv.config();

// Initialize Sentry for error monitoring
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'development',
    enabled: process.env.NODE_ENV === 'production',
  });
  console.log('✅ Sentry error monitoring initialized');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Data sanitization against XSS
app.use(xss());

// Prevent HTTP parameter pollution
app.use(hpp());

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/lead-generation', leadGenerationRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/deliverability', deliverabilityRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/analyze', replyRoutes);
app.use('/api/ai/doctor', doctorRoutes);
app.use('/api/coaching', coachingRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use('/api/ab-tests', abTestRoutes);
app.use('/api/senders', senderRoutes);
app.use('/api/growth', growthRoutes);
app.use('/api/gamification', gamificationRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    // Try to connect to database but don't fail if it's not available
    try {
      await connectDB();
    } catch (dbError: any) {
      console.warn('⚠️ Database connection failed, running without database:', dbError.message);
      console.log('💡 To enable database features, please check Supabase connection');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log('🔗 API endpoints available:');
      console.log('   - Health check: http://localhost:5000/health');
      console.log('   - API base: http://localhost:5000/api');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

startServer();

export default app;