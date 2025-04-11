import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  lastLoginIp?: string;
  twoFactorEnabled: boolean;
  twoFactorVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByCredentials(email: string, password: string): Promise<IUser | null>;
  createUser(userData: { name: string; email: string; password: string }): Promise<IUser>;
}

const UserSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  lastLoginIp: { 
    type: String 
  },
  twoFactorEnabled: { 
    type: Boolean, 
    default: true 
  },
  twoFactorVerified: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    return next(error);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find user by email
UserSchema.statics.findByEmail = async function(email: string): Promise<IUser | null> {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find user by credentials (for login)
UserSchema.statics.findByCredentials = async function(email: string, password: string): Promise<IUser | null> {
  const user = await this.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    return null;
  }
  
  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    return null;
  }
  
  return user;
};

// Static method to create a new user with validation
UserSchema.statics.createUser = async function(userData: { name: string; email: string; password: string }): Promise<IUser> {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    throw new Error('Invalid email format');
  }
  
  // Validate password strength
  if (userData.password.length < 8 || 
      !/[A-Z]/.test(userData.password) || 
      !/[a-z]/.test(userData.password) || 
      !/[0-9]/.test(userData.password)) {
    throw new Error('Password must be at least 8 characters and include uppercase, lowercase, and numbers');
  }
  
  // Check if email already exists
  const existingUser = await this.findOne({ email: userData.email.toLowerCase() });
  if (existingUser) {
    throw new Error('Email already in use');
  }
  
  // Create and save new user
  const newUser = new this({
    name: userData.name,
    email: userData.email.toLowerCase(),
    password: userData.password
  });
  
  await newUser.save();
  return newUser;
};

// Use mongoose.models to check if model exists to prevent duplicate model error in development
const User = (mongoose.models.User as IUserModel) || 
  mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;