import mongoose from 'mongoose';

export const apiSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    endpoint: { type: String, required: true, trim: true },
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      required: true,
    },
    description: { type: String, trim: true },
    version: { type: String, trim: true, default: 'v1' },
    status: {
      type: String,
      enum: ['active', 'inactive', 'deprecated'],
      default: 'active',
    },
    baseUrl: { type: String, trim: true },
    tags: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type ApiDocument = mongoose.InferSchemaType<typeof apiSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Api = mongoose.model('Api', apiSchema);
