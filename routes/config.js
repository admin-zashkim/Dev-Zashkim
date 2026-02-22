const express = require('express');
const router = express.Router();

// Get public configuration
router.get('/', (req, res) => {
    // Only expose necessary public data
    const publicConfig = {
        github: process.env.GITHUB_URL || null,
        linkedin: process.env.LINKEDIN_URL || null,
        whatsapp: process.env.WHATSAPP_COMMUNITY || null,
        email: process.env.EMAIL_ADDRESS || null,
        twitter: process.env.INSTAGRAM_URL || null,
        phone: process.env.PHONE_NUMBER || null  // Added phone field
    };

    // Remove null values
    Object.keys(publicConfig).forEach(key => 
        publicConfig[key] === null && delete publicConfig[key]
    );

    // Log available config (optional, for debugging)
    console.log('Config served:', Object.keys(publicConfig));

    res.json(publicConfig);
});

module.exports = router;