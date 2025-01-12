import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import './App.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:3001/api/metrics/cpu')
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  
    }, []);

    const chartData = {
        labels: data.map((d) => d.time),
        datasets: [{
            label: 'CPU Usage',
            data: data.map((d) => d.usage),
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
        }],
    };

    return (
        <div className="App">
            <h1>CPU Usage Monitoring</h1>
            <Line data={chartData} />
        </div>
    );
}

export default App;
