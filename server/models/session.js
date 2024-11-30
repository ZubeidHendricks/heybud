const db = require('../db');

class Session {
  static async create(sessionId, shopDomain) {
    const query = `
      INSERT INTO sessions (session_id, shop_domain)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [sessionId, shopDomain];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async addParticipant(sessionId, userId, userName) {
    const query = `
      INSERT INTO participants (session_id, user_id, user_name)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [sessionId, userId, userName];
    return db.query(query, values);
  }

  static async getParticipants(sessionId) {
    const query = `
      SELECT * FROM participants
      WHERE session_id = $1
      ORDER BY joined_at ASC
    `;
    const result = await db.query(query, [sessionId]);
    return result.rows;
  }

  static async addMessage(sessionId, userId, userName, content) {
    const query = `
      INSERT INTO messages (session_id, user_id, user_name, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [sessionId, userId, userName, content];
    return db.query(query, values);
  }

  static async getMessages(sessionId) {
    const query = `
      SELECT * FROM messages
      WHERE session_id = $1
      ORDER BY created_at ASC
    `;
    const result = await db.query(query, [sessionId]);
    return result.rows;
  }
};

module.exports = Session;