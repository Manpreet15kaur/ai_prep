const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/database')
const errorHandler = require('./middleware/error.middleware')

// Load env vars
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files
app.use('/uploads', express.static('uploads'))

// Routes
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/questions', require('./routes/question.routes'))
app.use('/api/vault', require('./routes/vault.routes'))
app.use('/api/resume', require('./routes/resume.routes'))
app.use('/api/profile', require('./routes/profile.routes'))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handler (must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
