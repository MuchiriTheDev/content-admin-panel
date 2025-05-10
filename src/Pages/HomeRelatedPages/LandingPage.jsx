// src/components/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiClock, FiAlertCircle, FiFileText } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import PageAbsorber from '../../Resources/PageAbsorber';
import { getAnalytics } from '../../Resources/Apiservice';
import KPICard from '../../Component/HomePageComponents/KPICard';
import AnalyticsChart from '../../Component/HomePageComponents/AnalyticsChart';
import InsightCard from '../../Component/HomePageComponents/InsightCard';
import ReportForm from '../../Component/HomePageComponents/ReportForm';
import UserTable from '../../Component/HomePageComponents/UserTable';

const LandingPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await getAnalytics();
        setAnalytics(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch analytics');
        toast.error('Failed to fetch analytics', {
          style: { background: '#FECACA', color: '#7F1D1D' },
        });
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const getChartData = (type) => {
    if (!analytics) return { labels: [], datasets: [] };

    switch (type) {
      case 'statusBreakdown':
        return {
          labels: analytics.analytics.statusBreakdown.map((item) => item._id || 'Unknown'),
          datasets: [
            {
              label: 'Users by Status',
              data: analytics.analytics.statusBreakdown.map((item) => item.count),
            },
          ],
        };
      case 'platformBreakdown':
        return {
          labels: analytics.analytics.platformBreakdown.map((item) => item._id || 'Unknown'),
          datasets: [
            { label: 'Users', data: analytics.analytics.platformBreakdown.map((item) => item.userCount) },
            { label: 'Content', data: analytics.analytics.contentByPlatform.map((item) => item.count || 0) },
            { label: 'Claims', data: analytics.analytics.claimsByPlatform.map((item) => item.count || 0) },
          ],
        };
      case 'userGrowth':
        return {
          labels: analytics.analytics.userGrowth.map((item) => item._id),
          datasets: [
            { label: 'New Users', data: analytics.analytics.userGrowth.map((item) => item.newUsers) },
            { label: 'Applications', data: analytics.analytics.applicationTrends.map((item) => item.applications || 0) },
            { label: 'Content Reviews', data: analytics.analytics.contentReviewTrends.map((item) => item.reviews || 0) },
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
              Admin Dashboard
            </h1>
            <p className="text-xs md:text-sm lg:text-base text-gray-600 mt-2">
              Monitor user activity, analytics, and generate reports.
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
            <p className="text-brown mt-4 text-lg font-medium">Loading analytics...</p>
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
                title="Total Users"
                value={analytics.analytics.totalUsers}
                icon={<FiUsers className="mr-1" />}
                secondaryText={`${analytics.analytics.verifiedUsers} verified`}
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
                title="Processing Time"
                value={`${analytics.analytics.avgApplicationProcessingTime} days`}
                icon={<FiClock className="mr-1" />}
                secondaryText="Avg application processing"
                color="yellowGreen"
              />
              <KPICard
                title="Resolution Rate"
                value={`${analytics.analytics.claimResolutionRate.resolvedOnTime}/${analytics.analytics.claimResolutionRate.totalResolved}`}
                icon={<FiClock className="mr-1" />}
                secondaryText="Claims resolved on time"
                color="appleGreen"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnalyticsChart
                type="pie"
                data={getChartData('statusBreakdown')}
                title="Users by Insurance Status"
              />
              <AnalyticsChart
                type="bar"
                data={getChartData('platformBreakdown')}
                title="Platform Breakdown"
              />
              <AnalyticsChart
                type="line"
                data={getChartData('userGrowth')}
                title="Activity Trends (Last 12 Months)"
              />
            </div>

            {/* User Table */}
            <UserTable />

            {/* High-Risk Users */}
            {analytics.analytics.highRiskUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl shadow-md p-6 border border-appleGreen"
              >
                <h2 className="text-xl font-semibold text-brown mb-4">High-Risk Users</h2>
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-appleGreen/50 scrollbar-track-gray-100">
                  <table className="w-full min-w-[600px] text-left table-auto">
                    <thead>
                      <tr className="text-xs md:text-sm text-gray-500 bg-gray-50 sticky top-0 z-10">
                        <th className="p-4 font-medium">User ID</th>
                        <th className="p-4 font-medium">Email</th>
                        <th className="p-4 font-medium">High-Risk Content</th>
                        <th className="p-4 font-medium">Claims</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.analytics.highRiskUsers.map((user, index) => (
                        <motion.tr
                          key={user.userId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.1 }}
                          className="border-t border-gray-100 hover:bg-appleGreen/10 transition-all duration-200"
                        >
                          <td className="p-4 text-xs md:text-sm text-brown">
                            <Link to={`/user/${user.userId}`} className="hover:underline">
                              {user.userId.slice(-6)}
                            </Link>
                          </td>
                          <td className="p-4 text-xs md:text-sm text-brown">{user.email}</td>
                          <td className="p-4 text-xs md:text-sm text-brown">{user.highRiskContentCount}</td>
                          <td className="p-4 text-xs md:text-sm text-brown">{user.claimCount}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

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
        <ReportForm isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} />
      </motion.div>
    </PageAbsorber>
  );
};

export default LandingPage;