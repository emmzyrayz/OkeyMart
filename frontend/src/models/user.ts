import mongoose, { Document, Schema, CallbackError, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Enums
export enum UserRole {
  Buyer = 'Buyer',
  Seller = 'Seller',
  VerifiedSeller = 'Verified Seller',
  PremiumSeller = 'Premium Seller'
}

export enum VerificationStatus {
  NotVerified = 'Not Verified',
  Pending = 'Pending',
  Verified = 'Verified',
  Rejected = 'Rejected'
}

export enum UserStatus {
  Active = 'active',
  Suspended = 'suspended',
  Banned = 'banned'
}

export enum VerificationBadgeType {
  None = 'none',
  Verified = 'verified',
  Premium = 'premium',
  Trusted = 'trusted'
}

// Interfaces
interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

interface IPasswordHistory {
  password: string;
  changedAt: Date;
}

interface IVerificationBadge {
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  badge: VerificationBadgeType;
}

interface IEmailVerification {
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  verifiedAt?: Date;
}

interface IResetPassword {
  code?: string;
  expires?: Date;
  used: boolean;
  attempts: number;
}

// Main User Interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  authProvider: string;
  password: string;
  emailVerification: IEmailVerification;
  resetPassword: IResetPassword;
  role: UserRole;
  verificationStatus: VerificationStatus;
  isPremiumSeller: boolean;
  verificationBadge: IVerificationBadge;
  profileCompletion: number;
  lastLogin?: Date;
  lastActive?: Date;
  preferences: Record<string, any>;
  address?: IAddress;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordCode?: string;
  resetPasswordExpires?: Date;
  resetPasswordUsed?: boolean;
  resetPasswordAttempts: number;
  passwordHistory: IPasswordHistory[];

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateVerificationToken(): string;
  verifyEmail(): void;
  generateResetToken(): string;
  isPasswordInHistory(newPassword: string): Promise<boolean>;
}

// Schema Definitions
const verificationBadgeSchema = new Schema<IVerificationBadge>({
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: Date,
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  badge: {
    type: String,
    enum: Object.values(VerificationBadgeType),
    default: VerificationBadgeType.None,
  },
});

const emailVerificationSchema = new Schema<IEmailVerification>({
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  verifiedAt: Date,
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    profileImage: String,
    authProvider: {
      type: String,
      required: true,
      default: 'email',
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    emailVerification: emailVerificationSchema,
    resetPassword: {
      code: String,
      expires: Date,
      used: { type: Boolean, default: false },
      attempts: { type: Number, default: 0 },
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Buyer,
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.NotVerified,
    },
    isPremiumSeller: {
      type: Boolean,
      default: false,
    },
    verificationBadge: verificationBadgeSchema,
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastLogin: Date,
    lastActive: Date,
    preferences: {
      type: Schema.Types.Mixed,
      default: {},
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.Active,
    },
    createdAt: { type: Date, default: Date.now },
    resetPasswordCode: String,
    resetPasswordExpires: Date,
    resetPasswordUsed: Boolean,
    resetPasswordAttempts: {
      type: Number,
      default: 0,
    },
    passwordHistory: [
      {
        password: String,
        changedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ verificationStatus: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ 'emailVerification.verificationToken': 1 });

// Password hashing middleware
UserSchema.pre(
  "save",
  async function (this: IUser, next: (err?: CallbackError) => void) {
    if (!this.isModified("password")) return next();

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);

      if (!this.passwordHistory) {
        this.passwordHistory = [];
      }

      this.passwordHistory.push({
        password: hashedPassword,
        changedAt: new Date(),
      });

      if (this.passwordHistory.length > 5) {
        this.passwordHistory = this.passwordHistory.slice(-5);
      }

      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error as CallbackError);
    }
  }
);

// Instance methods
UserSchema.methods.comparePassword = async function(
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateVerificationToken = function(this: IUser): string {
  const verificationToken = crypto.randomBytes(32).toString('hex');

  this.emailVerification.verificationToken = verificationToken;
  this.emailVerification.verificationTokenExpires = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  return verificationToken;
};

UserSchema.methods.verifyEmail = function(this: IUser): void {
  this.emailVerification.isVerified = true;
  this.emailVerification.verificationToken = undefined;
  this.emailVerification.verificationTokenExpires = undefined;
  this.emailVerification.verifiedAt = new Date();
};

UserSchema.methods.generateResetToken = function(this: IUser): string {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  this.resetPassword = {
    code: resetCode,
    expires: new Date(Date.now() + 30 * 60 * 1000),
    used: false,
    attempts: 0,
  };

  return resetCode;
};

UserSchema.methods.isPasswordInHistory = async function(
  this: IUser,
  newPassword: string
): Promise<boolean> {
  for (let historical of this.passwordHistory) {
    if (await bcrypt.compare(newPassword, historical.password)) {
      return true;
    }
  }
  return false;
};

// Export the model and its interface
const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;