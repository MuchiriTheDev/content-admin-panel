// src/components/pages/Contracts.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiUsers, FiClock, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import PageAbsorber from '../../Resources/PageAbsorber';
import {
  getAllInsuranceContracts,
  getInsuranceAnalytics,
  generateContractReport,
} from '../../Resources/Apiservice';
import KPICard from '../../Component/HomePageComponents/KPICard';
import InsightCard from '../../Component/HomePageComponents/InsightCard';
import ContractReportForm from '../../Component/ContractsPageComponents/ContractReportForm';
import ContractTable from '../../Component/ContractsPageComponents/ContractTable';
import AnalyticsChart from '../../Component/HomePageComponents/AnalyticsChart';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [contractsResponse, analyticsResponse] = await Promise.all([
          getAllInsuranceContracts(),
          getInsuranceAnalytics(),
        ]);
        setContracts(contractsResponse.data.data);
        setAnalytics(analyticsResponse.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
        toast.error('Failed to fetch contracts or analytics', {
          style: { background: '#FECACA', color: '#7F1D1D' },
        });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getChartData = (type) => {
    if (!analytics) return { labels: [], datasets: [] };

    switch (type) {
      case 'statusBreakdown':
        return {
          labels: ['Pending', 'Approved', 'Rejected', 'Surrendered'],
          datasets: [
            {
              label: 'Contracts by Status',
              data: [
                analytics.analytics.pendingApplications,
                analytics.analytics.approvedApplications,
                analytics.analytics.rejectedApplications,
                analytics.analytics.totalApplications -
                  (analytics.analytics.pendingApplications +
                    analytics.analytics.approvedApplications +
                    analytics.analytics.rejectedApplications),
              ],
            },
          ],
        };
      case 'platformBreakdown':
        return {
          labels: analytics.analytics.platformBreakdown.map((item) => item._id || 'Unknown'),
          datasets: [
            {
              label: 'Contracts',
              data: analytics.analytics.platformBreakdown.map((item) => item.count),
            },
            {
              label: 'Avg Audience Size',
              data: analytics.analytics.platformBreakdown.map((item) => item.avgAudienceSize),
            },
          ],
        };
      case 'premiumTrends':
        return {
          labels: ['Total Premium', 'High-Risk Content', 'Claims'],
          datasets: [
            {
              label: 'Values',
              data: [
                analytics.analytics.totalPremiumRevenue,
                analytics.analytics.highRiskContent,
                analytics.analytics.totalClaims,
              ],
            },
          ],
        };
      default:
        return { labels: [], datasets: [] };
    }
  };

  return (
    <PageAbsorber>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="p-6 md:p-10 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl border border-appleGreen mx-auto my-8 max-w-6xl"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brown tracking-tight">
              Insurance Contracts Dashboard
            </h1>
            <p className="text-xs md:text-sm lg:text-base text-gray-600 mt-2">
              Manage insurance contracts, view analytics, and generate reports.
            </p>
          </div>
          <button
            onClick={() => setReportModalOpen(true)}
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-brown to-fadeBrown rounded-lg font-semibold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <FiFileText className="mr-2" />
            Generate Report
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block h-12 w-12 border-4 border-appleGreen border-t-transparent rounded-full"
            ></motion.div>
            <p className="text-brown mt-4 text-lg font-medium">Loading contracts...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 text-red-900 p-5 rounded-lg mb-6 flex items-center"
          >
            <FiAlertCircle className="mr-3 text-xl" />
            {error}
          </motion.div>
        )}

        {/* Main Content */}
        {!loading && !error && analytics && (
          <div className="space-y-10">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <KPICard
                title="Total Contracts"
                value={analytics.analytics.totalApplications}
                icon={<FiUsers className="mr-1" />}
                secondaryText={`${analytics.analytics.activeContracts} active`}
                color="yellowGreen"
              />
              <KPICard
                title="Total Claims"
                value={analytics.analytics.totalClaims}
                icon={<FiAlertCircle className="mr-1" />}
                secondaryText={`${analytics.analytics.approvedClaims} approved`}
                color="appleGreen"
              />
              <KPICard
                title="Pending Applications"
                value={analytics.analytics.pendingApplications}
                icon={<FiClock className="mr-1" />}
                secondaryText="Awaiting review"
                color="yellowGreen"
              />
              <KPICard
                title="Premium Revenue"
                value={`KES ${analytics.analytics.totalPremiumRevenue.toFixed(2)}`}
                icon={<FiFileText className="mr-1" />}
                secondaryText="Total collected"
                color="appleGreen"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnalyticsChart
                type="pie"
                data={getChartData('statusBreakdown')}
                title="Contracts by Status"
              />
              <AnalyticsChart
                type="bar"
                data={getChartData('platformBreakdown')}
                title="Platform Breakdown"
              />
              <AnalyticsChart
                type="bar"
                data={getChartData('premiumTrends')}
                title="Premium and Risk Trends"
              />
            </div>

            {/* Contract Table */}
            <ContractTable contracts={contracts} />

            {/* AI Insights */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-brown">AI Insights</h2>
              {analytics.aiInsights.insights.map((insight, index) => (
                <InsightCard key={index} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* Report Modal */}
        <ContractReportForm isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} />
      </motion.div>
    </PageAbsorber>
  );
};

export default Contracts;