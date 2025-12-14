const express = require('express');
const path = require('path');
const cors = require('cors'); // Agar nahi hai to install karein, ya hata dein
const app = express();

const PORT = process.env.PORT || 3000;

// Enable CORS (Optional - Good for safety)
app.use(cors());
app.use(express.json());

// --- CRITICAL STEP: Frontend Files Serve Karna ---
// Server 'backend' folder me hai, isliye '../frontend' use karenge
app.use(express.static(path.join(__dirname, '../frontend')));

// --- API Routes (Future me yaha aayenge) ---
app.get('/api/status', (req, res) => {
    res.json({ status: 'active', message: 'Server is running!' });
});

// --- Catch-All Route (SPA Support) ---
// Koi bhi aur link open ho to index.html hi dikhaye
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

