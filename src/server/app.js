require("dotenv").config();

const app = require("./server");
const DBConnector = require("../config/DBConnector.js");

async function initializeApp() {
  try {
    // Test DB connection
    const db = new DBConnector();
    await db.performAsyncQuery("SELECT 1");
    console.log("✅ Database connected successfully");

    // Start server
    const port = process.env.PORT || 80;
    const host = "0.0.0.0";

    const server = app.listen(port, host, () => {
      console.log(`🚀 Server running on http://${host}:${port}`);
      console.log(`📊 Health check: http://${host}:${port}/healthCheck`);
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("🛑 SIGTERM received, shutting down gracefully");
      server.close(() => {
        console.log("📴 Server closed");
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("💥 Failed to start server:", error);
    process.exit(1);
  }
}

initializeApp();
