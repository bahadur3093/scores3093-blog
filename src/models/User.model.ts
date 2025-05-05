import mongoose from 'mongoose';

const User = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "superuser"], default: "user" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', User);