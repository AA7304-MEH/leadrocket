import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  subscription: {
    plan: 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired' | 'trial';
    stripeCustomerId?: string;
    currentPeriodEnd?: Date;
    trialEndsAt?: Date;
  };
  profile: {
    company?: string;
    website?: string;
    industry?: string;
    phone?: string;
    avatar?: string;
  };
  settings: {
    emailNotifications: boolean;
    weeklyReports: boolean;
    timezone: string;
  };
  apiKeys: {
    openai?: string;
    hubspot?: string;
    salesforce?: string;
  };
  usage: {
    leadsGenerated: number;
    leadsThisMonth: number;
    monthlyLimit: number;
  };
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
  getRefreshToken(): string;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  } as any,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['pro', 'enterprise'],
      default: 'pro'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'trial'],
      default: 'trial'
    },
    stripeCustomerId: String,
    currentPeriodEnd: Date,
    trialEndsAt: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    }
  },
  profile: {
    company: String,
    website: String,
    industry: String,
    phone: String,
    avatar: String
  },
  settings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    weeklyReports: {
      type: Boolean,
      default: true
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  apiKeys: {
    openai: String,
    hubspot: String,
    salesforce: String
  },
  usage: {
    leadsGenerated: {
      type: Number,
      default: 0
    },
    leadsThisMonth: {
      type: Number,
      default: 0
    },
    monthlyLimit: {
      type: Number,
      default: 50 // Pro plan default
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function (): string {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

// Generate refresh token
UserSchema.methods.getRefreshToken = function (): string {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update last login
UserSchema.methods.updateLastLogin = function (): Promise<void> {
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

export default mongoose.model<IUser>('User', UserSchema);