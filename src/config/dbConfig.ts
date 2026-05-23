import 'dotenv/config';

export const dbConfig = {
  dev: {
    url: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/',
    dbName: process.env.DB_NAME ?? 'apiManagementTool',
  },
  prod: {
    url: process.env.MONGODB_URI_PROD ?? '',
    dbName: process.env.DB_NAME_PROD ?? '',
  },
  test: {
    url: process.env.MONGODB_URI_TEST ?? '',
    dbName: process.env.DB_NAME_TEST ?? '',
  },
};
