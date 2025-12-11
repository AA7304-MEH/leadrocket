
import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a campaign name']
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'paused', 'completed'],
        default: 'draft'
    },
    type: {
        type: String,
        default: 'email'
    },
    sequenceFlow: {
        type: mongoose.Schema.Types.Mixed, // Stores the JSON flow data from React Flow
        default: null
    },
    metrics: {
        sent: { type: Number, default: 0 },
        opened: { type: Number, default: 0 },
        replied: { type: Number, default: 0 },
        converted: { type: Number, default: 0 }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Campaign', CampaignSchema);
