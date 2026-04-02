/**
 * PayPal Subscription Plan Creation Script
 * Run this script to generate Plan IDs for your environment variables.
 * Usage: bun scripts/createPaypalPlans.ts
 */

const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Use https://api-m.paypal.com for production
const CLIENT_ID = process.env.VITE_PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

async function getAccessToken() {
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });
    const data = await response.json();
    return data.access_token;
}

async function createPlan(accessToken, name, description, price) {
    const productResponse = await fetch(`${PAYPAL_API}/v1/catalogs/products`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: "LeadRockets Subscription",
            type: "SERVICE",
            category: "SOFTWARE",
        }),
    });
    const { id: productId } = await productResponse.json();

    const planResponse = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            product_id: productId,
            name,
            description,
            status: "ACTIVE",
            billing_cycles: [
                {
                    frequency: {
                        interval_unit: "MONTH",
                        interval_count: 1,
                    },
                    tenure_type: "REGULAR",
                    sequence: 1,
                    total_cycles: 0,
                    pricing_scheme: {
                        fixed_price: {
                            value: price.toString(),
                            currency_code: "USD",
                        },
                    },
                },
            ],
            payment_preferences: {
                auto_bill_outstanding: true,
                setup_fee_failure_action: "CONTINUE",
                payment_failure_threshold: 3,
            },
        }),
    });
    return await planResponse.json();
}

async function main() {
    console.log('--- Generating PayPal Plan IDs ---');
    try {
        const token = await getAccessToken();
        
        const plans = [
            { name: 'Starter Monthly', desc: 'Starter Plan - $99/mo', price: 99 },
            { name: 'Pro Monthly', desc: 'Pro Plan - $199/mo', price: 199 },
            { name: 'Agency Monthly', desc: 'Agency Plan - $499/mo', price: 499 },
        ];

        for (const p of plans) {
            const result = await createPlan(token, p.name, p.desc, p.price);
            console.log(`${p.name}: ${result.id}`);
        }
    } catch (error) {
        console.error('Error creating plans:', error);
    }
}

main();
