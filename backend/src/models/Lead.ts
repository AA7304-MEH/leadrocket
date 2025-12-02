import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  linkedinUrl?: string;
  painPoints?: string[];
  salesPitch?: string;
  source: 'ai_generated' | 'manual' | 'import' | 'api';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  notes?: string;
  metadata: {
    confidence?: number;
    intentSignals?: string[];
    technologies?: string[];
    funding?: string;
    revenue?: string;
  };
  crmData?: {
    hubspotId?: string;
    salesforceId?: string;
    pipedriveId?: string;
  };
  outreach: {
    emailsSent: number;
    emailsOpened: number;
    emailsClicked: number;
    responses: number;
    lastContacted?: Date;
    nextFollowUp?: Date;
  };
  score: number;
  scoreReason?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name can not be more than 100 characters']
  },
  contactName: {
    type: String,
    trim: true,
    maxlength: [100, 'Contact name can not be more than 100 characters']
  },
  email: {
    type: String,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  companySize: {
    type: String,
    trim: true
  },
  location: {
    type: String,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes can not be more than 1000 characters']
  },
  metadata: {
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    intentSignals: [String],
    technologies: [String],
    funding: String,
    revenue: String
  },
  crmData: {
    hubspotId: String,
    salesforceId: String,
    pipedriveId: String
  },
  outreach: {
    emailsSent: {
      type: Number,
      default: 0
    },
    emailsOpened: {
      type: Number,
      default: 0
    },
    emailsClicked: {
      type: Number,
      default: 0
    },
    responses: {
      type: Number,
      default: 0
    },
    lastContacted: Date,
    nextFollowUp: Date
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  scoreReason: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
LeadSchema.index({ user: 1, createdAt: -1 });
LeadSchema.index({ user: 1, status: 1 });
LeadSchema.index({ user: 1, priority: 1 });
LeadSchema.index({ companyName: 'text', contactName: 'text', email: 'text' });

// Update outreach stats when status changes
LeadSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'contacted') {
    this.outreach.lastContacted = new Date();
  }
  next();
});

export default mongoose.model<ILead>('Lead', LeadSchema);