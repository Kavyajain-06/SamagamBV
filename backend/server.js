
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./database');
const authRoutes = require('./auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
    res.send('Samagam backend is running!');
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'Backend is working'
    });
});

// Authentication routes
app.use('/api/auth', authRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
