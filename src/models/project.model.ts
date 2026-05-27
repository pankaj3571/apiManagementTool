import mongoose from 'mongoose';

export const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

export type ProjectDocument = mongoose.InferSchemaType<typeof projectSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Project = mongoose.model('Project', projectSchema);
