const express = require("express");
const axios = require("axios");
const app = express();
const port = 3001;

app.get("/api/metrics/cpu", async (req, res) => {
  try {
    const response = await axios.get("http://prometheus:9090/api/v1/query", {
      params: { query: 'rate(node_cpu_seconds_total[5m])' },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching metrics:", error.message);
    res.status(500).send("Error fetching metrics");
  }
});

app.listen(port, () => console.log(`Back-end running on http://localhost:${port}`));
