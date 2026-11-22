
const express = require("express");
const router = express.Router();

const Url = require("../models/Url");
const generateShortCode = require("../utils/generateShortCode");

// Create a short URL
router.post("/shorten", async (req, res) => {
    try {
        console.log("SHORTEN ROUTE HIT");
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({
                error: "Please provide a URL"
            });
        }

        // Validate URL
        let parsedUrl;

        try {
            parsedUrl = new URL(originalUrl);
        } catch {
            return res.status(400).json({
                error: "Invalid URL"
            });
        }

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return res.status(400).json({
                error: "Only HTTP and HTTPS URLs are allowed"
            });
        }

        // Generate a unique short code
        let shortCode;
        let existingUrl;

        do {
            shortCode = generateShortCode();
            existingUrl = await Url.findOne({ shortCode });
        } while (existingUrl);

        // Save URL in MongoDB
        const newUrl = new Url({
            originalUrl: parsedUrl.href,
            shortCode
        });

        await newUrl.save();

        res.status(201).json({
            originalUrl: newUrl.originalUrl,
            shortCode: newUrl.shortCode,
            shortUrl: `http://localhost:5000/${newUrl.shortCode}`
        });

   } catch (error) {
    console.error("SHORTEN ERROR:", error);

    res.status(500).json({
        error: error.message
    });
}
});

module.exports = router;
