import mongoose from 'mongoose';

export const clientSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactName: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    notes: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type ClientDocument = mongoose.InferSchemaType<typeof clientSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Client = mongoose.model('Client', clientSchema);
