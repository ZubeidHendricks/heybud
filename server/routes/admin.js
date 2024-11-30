const express = require('express');
const router = express.Router();
const db = require('../db');

// Get active sessions
router.get('/sessions', async (req, res) => {
  try {
    const query = `
      SELECT 
        s.session_id,
        s.shop_domain,
        COUNT(DISTINCT p.id) as participant_count,
        CASE WHEN MAX(p.last_active) > NOW() - INTERVAL '5 minutes' THEN true ELSE false END as active
      FROM sessions s
      LEFT JOIN participants p ON s.session_id = p.session_id
      WHERE s.created_at > NOW() - INTERVAL '24 hours'
      GROUP BY s.session_id, s.shop_domain
      ORDER BY s.created_at DESC;
    `;
    
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get participants
router.get('/participants', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        CASE WHEN p.last_active > NOW() - INTERVAL '5 minutes' 
          THEN jsonb_build_object('online', true)
          ELSE jsonb_build_object('online', false)
        END as status
      FROM participants p
      WHERE p.joined_at > NOW() - INTERVAL '24 hours'
      ORDER BY p.last_active DESC;
    `;
    
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages
router.get('/messages', async (req, res) => {
  try {
    const query = `
      SELECT * FROM messages
      WHERE created_at > NOW() - INTERVAL '24 hours'
      ORDER BY created_at DESC
      LIMIT 100;
    `;
    
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product views
router.get('/products', async (req, res) => {
  try {
    const query = `
      SELECT 
        product_id,
        session_id,
        product_data,
        COUNT(*) as view_count,
        MAX(viewed_at) as last_viewed_at
      FROM viewed_products
      WHERE viewed_at > NOW() - INTERVAL '24 hours'
      GROUP BY product_id, session_id, product_data
      ORDER BY view_count DESC;
    `;
    
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics
router.get('/analytics', async (req, res) => {
  try {
    const statsQueries = {
      sessions: `
        SELECT 
          COUNT(*) as total_today,
          COUNT(*) FILTER (WHERE EXISTS (
            SELECT 1 FROM participants p 
            WHERE p.session_id = s.session_id 
            AND p.last_active > NOW() - INTERVAL '5 minutes'
          )) as active_count,
          AVG(EXTRACT(EPOCH FROM (NOW() - s.created_at))/60) as avg_duration
        FROM sessions s
        WHERE s.created_at > NOW() - INTERVAL '24 hours';
      `,
      engagement: `
        SELECT
          ROUND(AVG(message_count), 2) as avg_messages,
          ROUND(AVG(product_count), 2) as avg_products,
          ROUND(AVG(participant_count), 2) as avg_participants
        FROM (
          SELECT 
            s.session_id,
            COUNT(DISTINCT m.id) as message_count,
            COUNT(DISTINCT vp.id) as product_count,
            COUNT(DISTINCT p.id) as participant_count
          FROM sessions s
          LEFT JOIN messages m ON s.session_id = m.session_id
          LEFT JOIN viewed_products vp ON s.session_id = vp.session_id
          LEFT JOIN participants p ON s.session_id = p.session_id
          WHERE s.created_at > NOW() - INTERVAL '24 hours'
          GROUP BY s.session_id
        ) stats;
      `
    };

    const [sessions, engagement] = await Promise.all([
      db.query(statsQueries.sessions),
      db.query(statsQueries.engagement)
    ]);

    res.json({
      sessions: sessions.rows[0],
      engagement: engagement.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;