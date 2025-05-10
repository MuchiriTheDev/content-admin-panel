// src/components/common/AnalyticsChart.jsx
import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsChart = ({ type, data, title }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom height
    plugins: {
      legend: { position: 'top', labels: { color: '#4F391A' } },
      title: { display: true, text: title, color: '#4F391A', font: { size: 16 } },
    },
    scales:
      type !== 'pie'
        ? {
            x: { ticks: { color: '#4F391A' }, grid: { display: false } },
            y: {
              ticks: { color: '#4F391A' },
              grid: { borderColor: '#AAC624', borderWidth: 1 },
              beginAtZero: true,
            },
          }
        : {},
  };

  const colors = ['#AAC624', '#7BBF2A', '#4F391A', '#aa783256'];

  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: type === 'pie' ? colors : colors[index % colors.length],
      borderColor: type !== 'pie' ? colors[index % colors.length] : '#FFFFFF',
      borderWidth: 2,
      fill: type === 'line' ? false : true,
    })),
  };

  const ChartComponent = type === 'bar' ? Bar : type === 'line' ? Line : Pie;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen"
    >
      <div className="h-64">
        <ChartComponent data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  );
};

export default AnalyticsChart;