
const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");
const { promisify } = require("util");

const app = express();
const PORT = 3000;

const exec = promisify(execFile);

app.use(cors({
    origin: "http://localhost:8080"
}));

app.use(express.json());

// Check backend health
app.get("/api/health", (req, res) => {
    res.json({
        status: "Online",
        message: "Infrastructure API is running"
    });
});

// Get all Docker containers
app.get("/api/containers", async (req, res) => {
    try {
        const { stdout } = await exec("docker", [
            "ps", "-a", "--format", "{{json .}}"
        ]);

        const containers = stdout.trim()
            ? stdout.trim().split("\n").map(line => JSON.parse(line))
            : [];

        res.json(containers);

    } catch (error) {
        res.status(500).json({
            error: "Unable to fetch containers"
        });
    }
});

// Get actual Docker resource statistics
app.get("/api/stats", async (req, res) => {
    try {
        const { stdout } = await exec("docker", [
            "stats", "--no-stream", "--format", "{{json .}}"
        ]);

        const stats = stdout.trim()
            ? stdout.trim().split("\n").map(line => JSON.parse(line))
            : [];

        res.json(stats);

    } catch (error) {
        res.status(500).json({
            error: "Unable to fetch Docker statistics"
        });
    }
});

// Backend homepage
app.get("/", (req, res) => {
    res.send(`
        <h1>Smart Infrastructure Management API</h1>
        <h2>Backend is Running Successfully!</h2>
        <ul>
            <li><a href="/api/health">Health API</a></li>
            <li><a href="/api/containers">Containers API</a></li>
            <li><a href="/api/stats">Statistics API</a></li>
        </ul>
    `);
});

// Start backend locally
app.listen(PORT, "127.0.0.1", () => {
    console.log(`Infrastructure API running at http://localhost:${PORT}`);
});
