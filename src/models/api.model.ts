import mongoose from 'mongoose';

const apiFieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['string', 'number', 'boolean', 'email', 'text', 'date'],
      default: 'string',
    },
    required: { type: Boolean, default: false },
    description: { type: String, trim: true },
    defaultValue: { type: String, trim: true },
  },
  { _id: false }
);

const apiParamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    value: { type: String, trim: true },
  },
  { _id: false }
);

const apiFileFieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    required: { type: Boolean, default: false },
    accept: { type: String, trim: true },
    maxSizeMb: { type: Number },
    description: { type: String, trim: true },
  },
  { _id: false }
);

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
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', index: true },
    bodyType: {
      type: String,
      enum: ['json', 'multipart', 'form-data', 'none'],
      default: 'json',
    },
    pathParams: { type: [apiParamSchema], default: [] },
    queryParams: { type: [apiParamSchema], default: [] },
    bearerToken: { type: String, trim: true },
    fields: { type: [apiFieldSchema], default: [] },
    fileFields: { type: [apiFileFieldSchema], default: [] },
    lastTestResponse: {
      success: { type: Boolean, default: false },
      statusCode: { type: Number },
      statusText: { type: String, trim: true },
      responseBody: { type: String },
      responseHeaders: { type: mongoose.Schema.Types.Mixed },
      durationMs: { type: Number, default: 0 },
      testedAt: { type: Date },
      requestUrl: { type: String, trim: true },
      errorMessage: { type: String, trim: true },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type ApiDocument = mongoose.InferSchemaType<typeof apiSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Api = mongoose.model('Api', apiSchema);
