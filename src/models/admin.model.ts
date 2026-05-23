import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    name: { type: String, trim: true },
    role: { type: String, enum: ['admin', 'user'], default: 'admin' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    mobile: { type: String, trim: true },
    address: { type: Object, default: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        zip: { type: String, trim: true },
        latitude: { type: Number, default: 0 },
        longitude: { type: Number, default: 0 },
    } },
    profilePicture: { type: String, trim: true },
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

adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

adminSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export type AdminDocument = mongoose.InferSchemaType<typeof adminSchema> & {
  _id: mongoose.Types.ObjectId;
  comparePassword(candidate: string): Promise<boolean>;
};

export const Admin = mongoose.model('Admin', adminSchema);
