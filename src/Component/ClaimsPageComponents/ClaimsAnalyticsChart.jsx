// src/components/claims/ClaimsAnalyticsChart.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const chartComponents = {
  pie: Pie,
  bar: Bar,
  line: Line,
};

const ClaimsAnalyticsChart = ({ type, data, title }) => {
  const ChartComponent = chartComponents[type] || Pie;

  const colors = ['#AAC624', '#7BBF2A', '#4F391A', '#aa783256', '#fff555']; // yellowGreen, appleGreen, brown, fadeBrown

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom height
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#4F391A', font: { size: 12 } }, // brown text
      },
      title: {
        display: true,
        text: title,
        color: '#4F391A', // brown
        font: { size: 16, weight: 'bold' },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: '#4F391A', // brown
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
      },
    },
    scales:
      type !== 'pie'
        ? {
            x: {
              ticks: { color: '#4F391A' }, // brown
              grid: { display: false },
            },
            y: {
              ticks: { color: '#4F391A' }, // brown
              grid: { borderColor: '#AAC624', borderWidth: 1 }, // yellowGreen
              beginAtZero: true,
            },
          }
        : {},
  };

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

export default ClaimsAnalyticsChart;