require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Connected');

    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database', err.message);
    process.exit(1);
  }
}

start();
