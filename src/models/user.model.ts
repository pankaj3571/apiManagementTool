import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    name: { type: String, trim: true },
    role: { type: String, enum: ['admin', 'user'], default: 'admin' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    mobile: { type: Number, required: true, unique: true },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      zip: { type: String, default: '' },
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
    },
    profilePicture: { type: String, default: '' },
    tokens:{
      accessToken: { type: String, default: '' },
      refreshToken: { type: String, default: '' },
    },
    lastLogin: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    isExpired: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

  userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

userSchema.methods.comparePassword = function (candidate: string) {
  if (!candidate || !this.password) {
    return Promise.resolve(false);
  }
  return bcrypt.compare(candidate, this.password);
};

export type UserDocument = mongoose.InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
  comparePassword(candidate: string): Promise<boolean>;
};

  export const User = mongoose.model('users', userSchema);
