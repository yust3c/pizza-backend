const express = require("express");
const apiRouter = require("./index");

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRouter);

// Health check
app.get("/healthCheck", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// CORRECTED: 404 handler - use app.use after all routes, no wildcard
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
