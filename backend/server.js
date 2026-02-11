import dotenv from 'dotenv';

// 🔴 CRITICAL: Load env variables FIRST
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import questionRoutes from './routes/question.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// ======================
// DATABASE
// ======================
connectDB();

// ======================
// MIDDLEWARE
// ======================
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ======================
// ROUTES
// ======================
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/resume', resumeRoutes);

// ======================
// HEALTH CHECK
// ======================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'PrepWise AI Backend is running 🚀'
  });
});

// ======================
// ERROR HANDLER
// ======================
app.use(errorHandler);

// ======================
// ENV VALIDATION
// ======================
const PORT = process.env.PORT || 5000;

if (!process.env.GROQ_API_KEY) {
  console.error('❌ ERROR: GROQ_API_KEY is missing');
  console.error('👉 Add GROQ_API_KEY to backend/.env');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully');
console.log('✅ Using Groq AI (llama3-8b-8192)');

// ======================
// SERVER START
// ======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
