import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Box,
} from "@mui/material";

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/metrics/cpu") 
      .then((res) => {
        if (res.data && res.data.data && res.data.data.result) {
          setData(res.data.data.result);
        } else {
          console.error("Invalid data format:", res.data);
          setData([]);
        }
      })
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const chartData = {
    labels: data.map((d) => d.metric.instance || "Unknown Instance"),
    datasets: [
      {
        label: "CPU Usage",
        data: data.map((d) => parseFloat(d.value[1]) || 0),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div>
      {/* Navigation Bar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DevOps Monitoring Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Real-Time CPU Metrics
            </Typography>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
              >
                <CircularProgress />
              </Box>
            ) : data.length === 0 ? (
              <Typography color="error">No data available</Typography>
            ) : (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true, position: "top" },
                  },
                  scales: {
                    x: { title: { display: true, text: "Instance" } },
                    y: {
                      title: { display: true, text: "CPU Usage (rate)" },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default App;
