const mysql = require("mysql2/promise");

class DBConnector {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  // Legacy method - supports raw queries and simple arrays for params
  async performAsyncQuery(sql, params = []) {
    try {
      const [result] = await this.pool.execute(sql, params);
      return result;
    } catch (err) {
      console.error("DB Error:", err);
      throw err;
    }
  }

  // New method with explicit placeholders support
  async query(sql, params = []) {
    try {
      const [result] = await this.pool.execute(sql, params);
      return result;
    } catch (err) {
      console.error("DB Error:", err);
      throw err;
    }
  }

  // Close pool when done (call in server shutdown)
  async close() {
    await this.pool.end();
  }
}

module.exports = DBConnector;
