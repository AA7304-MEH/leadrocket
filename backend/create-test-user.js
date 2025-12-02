const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error("MONGODB_URI is missing in .env");
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing in .env");
    process.exit(1);
}

mongoose.connect(uri)
    .then(async () => {
        console.log("Connected to DB");

        // Define a simple User schema to create a user
        // Note: This must match the actual User model collection name
        const UserSchema = new mongoose.Schema({
            name: String,
            email: String,
            password: String,
            role: { type: String, default: 'user' },
            isActive: { type: Boolean, default: true }
        });

        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // Create or find a test user
        let user = await User.findOne({ email: 'test@example.com' });
        if (!user) {
            user = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedpassword123',
                role: 'user'
            });
            console.log("Created new test user:", user._id);
        } else {
            console.log("Found existing test user:", user._id);
        }

        // Generate Token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        console.log(token); // Only output the token for easy capture
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
