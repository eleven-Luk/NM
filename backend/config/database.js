import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
        return connection;
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        console.log('⚠️ Retrying in 5 seconds...');
        setTimeout(() => connectDB(), 5000);
    }
};

export default connectDB;