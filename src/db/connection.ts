import mongoose from 'mongoose';
import { dbConfig } from '../config/dbConfig';

async function connectDB(){
try {
    switch(process.env.NODE_ENV){
        case 'development':
            await mongoose.connect(dbConfig.dev.url, { dbName: dbConfig.dev.dbName });
            break;
        case 'production':
            await mongoose.connect(dbConfig.prod.url, { dbName: dbConfig.prod.dbName });
            break;
        case 'test':
            await mongoose.connect(dbConfig.test.url, { dbName: dbConfig.test.dbName });
            break;
        default:
            throw new Error('Invalid NODE_ENV');
    }
    console.log('Connecting to Mongodb',(process.env.NODE_ENV));
} catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
export default connectDB;