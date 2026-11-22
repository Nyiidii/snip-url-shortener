const cors = require("cors");

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const urlRoutes = require("./routes/urlRoutes");
const Url = require("./models/Url");
const app = express();
const PORT = 5000;

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use("/api", urlRoutes);
// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error.message);
    });

// Home route
app.get("/", (req, res) => {
    res.send("URL Shortener Backend is Running");
});

// Start server

// Redirect short URL to original URL
app.get("/:shortCode", async (req, res) => {
    try {
        const url = await Url.findOne({
            shortCode: req.params.shortCode
        });

        if (!url) {
            return res.status(404).send("Short URL not found");
        }

        url.clicks++;
        await url.save();

        res.redirect(url.originalUrl);

    } catch (error) {
        console.error("Redirect Error:", error);
        res.status(500).send("Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
