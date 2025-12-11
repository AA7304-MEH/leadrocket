
import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkflow extends Document {
    user: mongoose.Types.ObjectId;
    name: string;
    trigger: string; // e.g., 'new_lead', 'reply_received'
    nodes: any[];
    edges: any[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const WorkflowSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    trigger: {
        type: String,
        required: true,
        enum: ['new_lead', 'reply_received', 'deal_stage_change']
    },
    nodes: {
        type: [Schema.Types.Mixed],
        default: []
    },
    edges: {
        type: [Schema.Types.Mixed],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model<IWorkflow>('Workflow', WorkflowSchema);
