// server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
    cors({
        origin: "*", // Allow all origins for development; restrict in production
    }),
);
app.use(bodyParser.json());

// API Endpoint to verify certificates
app.post("/verify", async (req, res) => {
    const uniqueId = req.body.uniqueId;

    if (!uniqueId) {
        return res.status(400).json({ message: "Certificate ID is required." });
    }

    // Fetch data from SheetDB API
    try {
        const response = await axios.get(`${process.env.SHEETDB_API_URL}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${process.env.SHEETDB_USERNAME}:${process.env.SHEETDB_PASSWORD}`).toString("base64")}`,
            },
        });

        // Search for the certificate ID
        const certificateDetails = response.data.find(
            (record) => record["Certificate ID"] === uniqueId,
        );

        if (certificateDetails) {
            res.json(certificateDetails);
        } else {
            res.status(404).json({ message: "Certificate ID not found." });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Error fetching data." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
