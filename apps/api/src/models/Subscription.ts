import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  plan: 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'past_due' | 'unpaid';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: Date;
  billing: {
    interval: 'month' | 'year';
    amount: number;
    currency: string;
  };
  features: {
    leadsPerWeek: number;
    crmIntegrations: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
    whiteLabel: boolean;
  };
  usage: {
    leadsThisMonth: number;
    monthlyLimit: number;
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  stripeSubscriptionId: {
    type: String,
    unique: true,
    sparse: true
  },
  stripeCustomerId: {
    type: String,
    required: true
  },
  plan: {
    type: String,
    enum: ['pro', 'enterprise'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'trial', 'past_due', 'unpaid'],
    default: 'trial'
  },
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  trialStart: Date,
  trialEnd: Date,
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  },
  cancelledAt: Date,
  billing: {
    interval: {
      type: String,
      enum: ['month', 'year'],
      default: 'month'
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'usd'
    }
  },
  features: {
    leadsPerWeek: {
      type: Number,
      default: 50
    },
    crmIntegrations: {
      type: Boolean,
      default: false
    },
    apiAccess: {
      type: Boolean,
      default: false
    },
    prioritySupport: {
      type: Boolean,
      default: false
    },
    whiteLabel: {
      type: Boolean,
      default: false
    }
  },
  usage: {
    leadsThisMonth: {
      type: Number,
      default: 0
    },
    monthlyLimit: {
      type: Number,
      default: 50
    }
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
SubscriptionSchema.index({ user: 1 });
SubscriptionSchema.index({ stripeSubscriptionId: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ currentPeriodEnd: 1 });

// Virtual for checking if subscription is active
SubscriptionSchema.virtual('isActive').get(function() {
  return ['active', 'trial'].includes(this.status as string);
});

// Virtual for checking if subscription is in trial
SubscriptionSchema.virtual('isTrial').get(function() {
  return this.status === 'trial';
});

// Virtual for checking if subscription is cancelled
SubscriptionSchema.virtual('isCancelled').get(function() {
  return this.status === 'cancelled' || this.cancelAtPeriodEnd;
});

// Method to check if user can generate more leads
SubscriptionSchema.methods.canGenerateLeads = function(): boolean {
  return this.isActive && this.usage.leadsThisMonth < this.usage.monthlyLimit;
};

// Method to increment lead count
SubscriptionSchema.methods.incrementLeadCount = function(): void {
  this.usage.leadsThisMonth += 1;
  this.save({ validateBeforeSave: false });
};

// Method to reset monthly usage
SubscriptionSchema.methods.resetMonthlyUsage = function(): void {
  this.usage.leadsThisMonth = 0;
  this.save({ validateBeforeSave: false });
};

// Set features based on plan
SubscriptionSchema.pre('save', function(next) {
  if (this.isModified('plan')) {
    switch (this.plan) {
      case 'pro':
        this.features = {
          leadsPerWeek: 50,
          crmIntegrations: true,
          apiAccess: false,
          prioritySupport: false,
          whiteLabel: false
        };
        (this.usage as any).monthlyLimit = 200; // 50 * 4 weeks
        break;
      case 'enterprise':
        this.features = {
          leadsPerWeek: 150,
          crmIntegrations: true,
          apiAccess: true,
          prioritySupport: true,
          whiteLabel: true
        };
        (this.usage as any).monthlyLimit = 600; // 150 * 4 weeks
        break;
    }
  }
  next();
});

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);