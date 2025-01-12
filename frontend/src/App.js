import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://backend:3001/api/metrics/cpu")
      .then((res) => setData(res.data.data.result))
      .catch((err) => console.error(err));
  }, []);

  const chartData = {
    labels: data.map((d) => d.metric.instance),
    datasets: [
      {
        label: "CPU Usage",
        data: data.map((d) => parseFloat(d.value[1])),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };

  return (
    <div className="App">
      <h1>DevOps Monitoring Dashboard</h1>
      <Line data={chartData} />
    </div>
  );
};

export default App;
