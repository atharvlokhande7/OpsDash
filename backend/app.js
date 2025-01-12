const express = require('express');
const app = express();
const port = 3001;

app.get('/api/metrics/cpu', (req, res) => {
  // Placeholder CPU usage data
  res.json([
    { time: '2025-01-11 10:00', usage: 20 },
    { time: '2025-01-11 10:05', usage: 30 },
    { time: '2025-01-11 10:10', usage: 45 },
    { time: '2025-01-11 10:15', usage: 25 },
  ]);
});

app.listen(port, () => {
  console.log(`Back-end is running on http://localhost:${port}`);
});