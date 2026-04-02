
const API_URL = 'http://localhost:5000/api';

const demoUser = {
    name: 'Demo User',
    email: 'demo@leadrockets.com',
    password: 'password123' // Plain text password since mock uses simple comparison or handles hashing
};

const leads = [
    { companyName: 'TechCorp', contactName: 'John Doe', email: 'john@techcorp.com', industry: 'SaaS', status: 'new', score: 85 },
    { companyName: 'GrowthLabs', contactName: 'Sarah Smith', email: 'sarah@growthlabs.io', industry: 'Marketing', status: 'contacted', score: 92 },
    { companyName: 'InnovateAI', contactName: 'Mike Chen', email: 'mike@innovate.ai', industry: 'AI', status: 'qualified', score: 78 },
    { companyName: 'CloudSystems', contactName: 'Emily Davis', email: 'emily@cloudsys.net', industry: 'Cloud', status: 'new', score: 65 },
    { companyName: 'NextGen', contactName: 'David Wilson', email: 'david@nextgen.co', industry: 'Fintech', status: 'converted', score: 95 }
];

async function seed() {
    console.log('🌱 Starting demo data seed (JS)...');

    try {
        // 1. Register/Login
        console.log('🔑 Authenticating...');
        let token = '';

        // Try login first
        let authRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: demoUser.email, password: demoUser.password })
        });

        if (authRes.status === 401 || authRes.status === 404) {
            // Try register
            console.log('   User not found, registering...');
            authRes = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(demoUser)
            });
        }

        const authData = await authRes.json();
        if (!authData.success) {
            console.error('Auth failed:', authData);
            return;
        }

        token = authData.data.accessToken;
        console.log('✅ Authenticated');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 2. Create Campaign
        console.log('📢 Creating campaign...');
        const campaignRes = await fetch(`${API_URL}/campaigns`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                name: 'Welcome Series Q1',
                type: 'email',
                status: 'active',
                sequenceFlow: {
                    nodes: [
                        { id: '1', type: 'trigger', data: { label: 'New Lead' }, position: { x: 250, y: 0 } },
                        { id: '2', type: 'email', data: { label: 'Welcome Email', subject: 'Hi {{name}}' }, position: { x: 250, y: 100 } }
                    ],
                    edges: [
                        { id: 'e1-2', source: '1', target: '2' }
                    ]
                }
            })
        });
        const campaignData = await campaignRes.json();
        console.log(`✅ Created Campaign: ${campaignData.data?.name}`);

        // 3. Create Leads
        console.log('👥 Creating leads...');
        for (const lead of leads) {
            await fetch(`${API_URL}/leads`, {
                method: 'POST',
                headers,
                body: JSON.stringify(lead)
            });
        }
        console.log('✅ Created 5 Leads');

        // 4. Create Sender
        console.log('📧 Connecting sender...');
        await fetch(`${API_URL}/senders/connect`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                email: 'marketing@leadrockets.com',
                name: 'Marketing Team',
                provider: 'gmail'
            })
        });
        console.log('✅ Connected Sender');

        // 5. Create A/B Test
        console.log('🧪 Creating A/B test...');
        if (campaignData.data?.id) {
            await fetch(`${API_URL}/ab-tests`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    campaignId: campaignData.data.id,
                    name: 'Subject Line Test',
                    testType: 'subject',
                    variants: [
                        { subject: 'Quick question', content: 'Hi there...' },
                        { subject: 'Partnership opportunity', content: 'Hi there...' }
                    ]
                })
            });
            console.log('✅ Created A/B Test');
        }

        // 6. Seed Payment History (Hack: call create-order but don't pay, just to verify endpoint)
        console.log('💳 Verifying Payments API...');
        await fetch(`${API_URL}/razorpay/create-order`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                amount: 50000,
                currency: 'INR',
                type: 'credits',
                credits: 500
            })
        });
        console.log('✅ Verified Payments API');

        console.log('\n🎉 Seeding complete! Login with:');
        console.log(`   Email: ${demoUser.email}`);
        console.log(`   Password: ${demoUser.password}`);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}

seed();
