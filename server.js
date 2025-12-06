/**
 * Node.js Backend for NotifyHub
 * Dependencies: express, mysql2, cors, body-parser, dotenv
 * Install: npm install express mysql2 cors body-parser dotenv
 * Run: node server.js
 */

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection Configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',      // Change to your MySQL username
  password: '',      // Change to your MySQL password
  database: 'notifyhub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create Pool
const pool = mysql.createPool(dbConfig);

// --- Routes ---

// 1. Get All Notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notifications ORDER BY scheduled_time DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Create Notification
app.post('/api/notifications', async (req, res) => {
  const { title, content, channel, group, scheduledTime, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO notifications (title, content, channel_type, group_name, scheduled_time, status) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content, channel, group, scheduledTime, status]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get All Channels
app.get('/api/channels', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM channels');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Toggle Channel Status
app.patch('/api/channels/:id/toggle', async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    await pool.query('UPDATE channels SET is_active = ? WHERE id = ?', [isActive, id]);
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Get Groups
app.get('/api/groups', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM recipient_groups');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Get Templates
app.get('/api/templates', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM templates');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
