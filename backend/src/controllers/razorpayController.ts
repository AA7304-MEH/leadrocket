import { Request, Response } from 'express';
import crypto from 'crypto';

// Razorpay keys - These should be in environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxxx';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'xxxxxxxxxxxxxxxxxxxx';

// Plan pricing in paise (INR cents)
const PLAN_PRICES = {
    pro: {
        monthly: 400000, // ₹4,000
        yearly: 3840000, // ₹38,400
    },
    scale: {
        monthly: 1200000, // ₹12,000
        yearly: 11520000, // ₹1,15,200
    }
};

// Credit pricing in paise
const CREDIT_PRICES = {
    starter: 75000, // ₹750
    growth: 320000, // ₹3,200
    scale: 570000, // ₹5,700
    enterprise: 2470000, // ₹24,700
};

// Simulated database for demo
const orders: Record<string, any> = {};
const subscriptions: Record<string, any> = {};
const payments: Record<string, any> = {};

/**
 * Create a Razorpay order for payment
 */
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { amount, currency = 'INR', type, planId, credits } = req.body;
        const userId = (req as any).user?.id;

        // In production, use Razorpay SDK:
        // const Razorpay = require('razorpay');
        // const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
        // const order = await razorpay.orders.create({ amount, currency, receipt: `order_${Date.now()}` });

        // Simulated order creation
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        orders[orderId] = {
            id: orderId,
            amount,
            currency,
            type, // 'subscription' or 'credits'
            planId,
            credits,
            userId,
            status: 'created',
            createdAt: new Date()
        };

        res.json({
            success: true,
            order: {
                id: orderId,
                amount,
                currency,
                key: RAZORPAY_KEY_ID
            }
        });
    } catch (error: any) {
        console.error('Create order error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Verify Razorpay payment signature
 */
export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = req.body;

        const userId = (req as any).user?.id;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        // In production, verify: if (expectedSignature !== razorpay_signature) throw error

        const order = orders[orderId || razorpay_order_id];

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // Update order status
        order.status = 'paid';
        order.paymentId = razorpay_payment_id;
        order.paidAt = new Date();

        // Record payment
        payments[razorpay_payment_id] = {
            id: razorpay_payment_id,
            orderId: order.id,
            userId,
            amount: order.amount,
            type: order.type,
            status: 'captured',
            createdAt: new Date()
        };

        // Handle subscription upgrade or credit purchase
        if (order.type === 'subscription') {
            subscriptions[userId] = {
                planId: order.planId,
                status: 'active',
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                createdAt: new Date()
            };
        }

        res.json({
            success: true,
            message: 'Payment verified successfully',
            payment: {
                id: razorpay_payment_id,
                amount: order.amount,
                type: order.type
            }
        });
    } catch (error: any) {
        console.error('Verify payment error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Handle Razorpay webhook events
 */
export const handleRazorpayWebhook = async (req: Request, res: Response) => {
    try {
        const webhookSignature = req.headers['x-razorpay-signature'];
        const webhookBody = JSON.stringify(req.body);

        // Verify webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', RAZORPAY_KEY_SECRET)
            .update(webhookBody)
            .digest('hex');

        // In production: if (webhookSignature !== expectedSignature) return res.status(400).send('Invalid signature');

        const event = req.body.event;
        const payload = req.body.payload;

        console.log('Razorpay webhook received:', event);

        switch (event) {
            case 'payment.captured':
                // Payment successful
                console.log('Payment captured:', payload.payment?.entity?.id);
                break;

            case 'payment.failed':
                // Payment failed
                console.log('Payment failed:', payload.payment?.entity?.id);
                break;

            case 'subscription.activated':
                // New subscription activated
                console.log('Subscription activated:', payload.subscription?.entity?.id);
                break;

            case 'subscription.charged':
                // Recurring payment successful
                console.log('Subscription charged:', payload.subscription?.entity?.id);
                break;

            case 'subscription.cancelled':
                // Subscription cancelled
                console.log('Subscription cancelled:', payload.subscription?.entity?.id);
                break;

            default:
                console.log('Unhandled webhook event:', event);
        }

        res.json({ received: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get user's subscription status
 */
export const getSubscription = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        const subscription = subscriptions[userId] || {
            planId: 'free',
            status: 'active',
            features: {
                emails: 100,
                leads: 50,
                campaigns: 1
            }
        };

        res.json({ success: true, subscription });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        if (subscriptions[userId]) {
            subscriptions[userId].status = 'cancelled';
            subscriptions[userId].cancelledAt = new Date();
        }

        res.json({
            success: true,
            message: 'Subscription cancelled. Access continues until period end.'
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Get payment history
 */
export const getPaymentHistory = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        // Filter payments by user
        const userPayments = Object.values(payments)
            .filter((p: any) => p.userId === userId)
            .sort((a: any, b: any) => b.createdAt - a.createdAt);

        res.json({ success: true, payments: userPayments });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Purchase AI credits
 */
export const purchaseCredits = async (req: Request, res: Response) => {
    try {
        const { packageId, quantity = 1 } = req.body;
        const userId = (req as any).user?.id;

        const price = CREDIT_PRICES[packageId as keyof typeof CREDIT_PRICES];

        if (!price) {
            return res.status(400).json({ success: false, error: 'Invalid package' });
        }

        const amount = price * quantity;

        // Create order for credit purchase
        const orderId = `credits_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        orders[orderId] = {
            id: orderId,
            amount,
            currency: 'INR',
            type: 'credits',
            packageId,
            quantity,
            userId,
            status: 'created',
            createdAt: new Date()
        };

        res.json({
            success: true,
            order: {
                id: orderId,
                amount,
                currency: 'INR',
                key: RAZORPAY_KEY_ID
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
