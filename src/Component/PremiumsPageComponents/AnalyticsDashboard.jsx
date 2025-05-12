// src/components/PremiumComponents/AnalyticsDashboard.jsx
import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = ({ analytics, error }) => {
  if (!analytics) {
    return <Typography>Loading analytics...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Pie chart for status breakdown
  const statusPieData = {
    labels: analytics.statusBreakdown.map((s) => s._id),
    datasets: [
      {
        data: analytics.statusBreakdown.map((s) => s.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  // Bar chart for platform premiums
  const platformBarData = {
    labels: analytics.platformPremiums.map((p) => p._id),
    datasets: [
      {
        label: 'Total Amount (KES)',
        data: analytics.platformPremiums.map((p) => p.totalAmount),
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Average Percentage',
        data: analytics.platformPremiums.map((p) => p.avgPercentage),
        backgroundColor: '#FFCE56',
      },
    ],
  };

  // Line chart for revenue over time (mock data for demonstration)
  const revenueLineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], // Replace with actual dates
    datasets: [
      {
        label: 'Revenue (KES)',
        data: [analytics.totalRevenue * 0.2, analytics.totalRevenue * 0.4, analytics.totalRevenue * 0.6, analytics.totalRevenue * 0.8, analytics.totalRevenue],
        borderColor: '#FF6384',
        fill: false,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Premium Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Payment Status Breakdown</Typography>
            <Pie data={statusPieData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Platform Premiums</Typography>
            <Bar data={platformBarData} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Revenue Over Time</Typography>
            <Line data={revenueLineData} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">AI Insights</Typography>
            {analytics.aiInsights.insights.map((insight, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2">{insight.title}</Typography>
                <Typography>{insight.description}</Typography>
                <Typography color="primary">Action: {insight.action}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Total Premiums: {analytics.totalPremiums}
      </Typography>
      <Typography variant="subtitle1">
        Average Premium: {analytics.averagePremium.percentage}% (KES {analytics.averagePremium.amount})
      </Typography>
      <Typography variant="subtitle1">
        Total Revenue: KES {analytics.totalRevenue}
      </Typography>
      <Typography variant="subtitle1">
        Overdue Premiums: {analytics.overdueCount}
      </Typography>
      <Typography variant="subtitle1">
        Retry Success Rate: {analytics.retrySuccessRate}%
      </Typography>
    </Box>
  );
};

export default AnalyticsDashboard;