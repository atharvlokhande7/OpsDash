const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3001;

// Enable CORS for all origins
app.use(cors());

// Helper function to query Prometheus
const queryPrometheus = async (query) => {
  try {
    const response = await axios.get("http://prometheus:9090/api/v1/query", {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error(`Error querying Prometheus: ${error.message}`);
    throw error;
  }
};

// API routes
app.get("/api/metrics/cpu", async (req, res) => {
  try {
    const data = await queryPrometheus("rate(node_cpu_seconds_total[5m])");
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching CPU metrics");
  }
});

app.get("/api/metrics/memory", async (req, res) => {
  try {
    const data = await queryPrometheus("node_memory_Active_bytes / node_memory_MemTotal_bytes");
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching memory metrics");
  }
});

app.get("/api/metrics/disk", async (req, res) => {
  try {
    const data = await queryPrometheus("node_filesystem_avail_bytes / node_filesystem_size_bytes");
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching disk metrics");
  }
});

app.get("/api/metrics/network", async (req, res) => {
  try {
    const data = await queryPrometheus("rate(node_network_receive_bytes_total[5m])");
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching network metrics");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
