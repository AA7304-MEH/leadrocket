import dotenv from 'dotenv';
// import fetch from 'node-fetch'; // Using built-in fetch

dotenv.config();

const apiKey = process.env.GOOGLE_AI_API_KEY;

async function testDraftEmail() {
    console.log('Testing Email Draft Generation...');
    console.log('API Key present:', !!apiKey);

    const prompt = `
    Write a personalized cold email to John Doe at Tech Corp.
    
    Context:
    - Industry: Technology
    - Location: San Francisco, CA
    - Pain Points: Scaling infrastructure, cost management
    - Sales Pitch: We help companies scale efficiently.
    
    The email should be professional, persuasive, and concise.
    
    Return ONLY a JSON object with "subject" and "body" fields. Do not include markdown formatting.
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            console.error(`API Error Status: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error('API Error Body:', errorText);
            return;
        }

        const data = await response.json();
        console.log('Success! Response data:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testDraftEmail();
