// backend/routes/admin.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// POST: /api/admin/login
router.post('/login', (req, res) => {
    try {
        const { password } = req.body;

        // Check if the password matches the one in your .env file
        if (password === process.env.ADMIN_PASSWORD) {
            // Create a secure token that expires in 1 day
            const token = jwt.sign({ role: 'admin' },
                process.env.JWT_SECRET, { expiresIn: '1d' }
            );

            res.status(200).json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: 'Invalid password' });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;