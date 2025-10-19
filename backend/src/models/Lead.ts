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
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  location: {
    type: String,
    trim: true
  },
  linkedinUrl: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    enum: ['ai_generated', 'manual', 'import', 'api'],
    default: 'ai_generated'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'converted', 'rejected'],
    default: 'new'
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

// Virtual for lead score calculation
LeadSchema.virtual('score').get(function() {
  let score = 0;

  // Base score from metadata confidence
  if (this.metadata?.confidence) {
    score += this.metadata.confidence * 0.4;
  }

  // Priority multiplier
  switch (this.priority) {
    case 'high': score *= 1.3; break;
    case 'medium': score *= 1.1; break;
    case 'low': score *= 0.9; break;
  }

  // Status multiplier
  switch (this.status) {
    case 'converted': score *= 1.5; break;
    case 'qualified': score *= 1.2; break;
    case 'contacted': score *= 1.1; break;
    case 'new': score *= 1.0; break;
    case 'rejected': score *= 0.5; break;
  }

  return Math.round(score);
});

// Update outreach stats when status changes
LeadSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'contacted') {
    this.outreach.lastContacted = new Date();
  }
  next();
});

export default mongoose.model<ILead>('Lead', LeadSchema);