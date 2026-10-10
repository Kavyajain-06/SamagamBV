
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Samagam backend is running!');
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'Backend is working'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
