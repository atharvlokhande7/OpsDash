import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Container, CircularProgress, Alert } from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const App = () => {
  const [tabValue, setTabValue] = useState(0);
  const [cpuData, setCpuData] = useState([]);
  const [memoryData, setMemoryData] = useState([]);
  const [diskData, setDiskData] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (endpoint, setData) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/metrics/${endpoint}`);
      setData(response.data.data.result);
    } catch (error) {
      if (error.message === "Network Error") {
        setError(`Network Error: Unable to reach the server. Please check if the API server is running.`);
      } else if (error.message.includes("ERR_CONNECTION_REFUSED")) {
        setError(`Connection Refused: Could not connect to the API server. Please ensure it's running.`);
      } else {
        setError(`Error fetching ${endpoint} data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true); // Reset loading state when fetching data again
    setError(null); // Reset error state
    fetchData("cpu", setCpuData);
    fetchData("memory", setMemoryData);
    fetchData("disk", setDiskData);
    fetchData("network", setNetworkData);
  }, []);

  const generateChartData = (data, label) => ({
    labels: data.map((d) => d.metric.instance),
    datasets: [
      {
        label,
        data: data.map((d) => parseFloat(d.value[1])),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OpsDash
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="CPU Usage" />
          <Tab label="Memory Usage" />
          <Tab label="Disk Usage" />
          <Tab label="Network Traffic" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom>
            CPU Usage
          </Typography>
          {cpuData.length > 0 ? (
            <Line data={generateChartData(cpuData, "CPU Usage")} />
          ) : (
            <Typography>No CPU data available</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            Memory Usage
          </Typography>
          {memoryData.length > 0 ? (
            <Line data={generateChartData(memoryData, "Memory Usage")} />
          ) : (
            <Typography>No Memory data available</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            Disk Usage
          </Typography>
          {diskData.length > 0 ? (
            <Line data={generateChartData(diskData, "Disk Usage")} />
          ) : (
            <Typography>No Disk data available</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>
            Network Traffic
          </Typography>
          {networkData.length > 0 ? (
            <Line data={generateChartData(networkData, "Network Traffic")} />
          ) : (
            <Typography>No Network data available</Typography>
          )}
        </TabPanel>
      </Container>
    </div>
  );
};

export default App;
