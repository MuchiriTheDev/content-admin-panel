// src/components/PremiumComponents/Premiums.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiDollarSign, FiClock, FiAlertCircle, FiList, FiPieChart } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import PageAbsorber from '../../Resources/PageAbsorber';
import { getAllPremiums, getOverduePremiums, getPremiumAnalytics } from '../../Resources/Apiservice';
import KPICard from '../../Component/HomePageComponents/KPICard';
import PremiumFilters from '../../Component/PremiumsPageComponents/PremiumFilters';
import PremiumTable from '../../Component/PremiumsPageComponents/PremiumTable';
import BulkAdjustForm from '../../Component/PremiumsPageComponents/BulkAdjustForm';
import AuditPremiumModal from '../../Component/PremiumsPageComponents/AuditPremiumModal';
import OverduePremiumsSection from '../../Component/PremiumsPageComponents/OverduePremiumsSection';
import AnalyticsChart from '../../Component/HomePageComponents/AnalyticsChart';
import InsightCard from '../../Component/HomePageComponents/InsightCard';

const Premiums = () => {
  const [tabValue, setTabValue] = useState(0);
  const [premiums, setPremiums] = useState([]);
  const [overduePremiums, setOverduePremiums] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [filters, setFilters] = useState({ status: '', startDate: '', endDate: '', userId: '' });
  const [openBulkAdjust, setOpenBulkAdjust] = useState(false);
  const [openAuditModal, setOpenAuditModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [premiumsResponse, overdueResponse, analyticsResponse] = await Promise.all([
          getAllPremiums(filters),
          getOverduePremiums(),
          getPremiumAnalytics({ startDate: filters.startDate, endDate: filters.endDate }),
        ]);
        setPremiums(premiumsResponse.data.premiums);
        setOverduePremiums(overdueResponse.data.premiums);
        setAnalytics(analyticsResponse.data.analytics);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
        toast.error('Failed to fetch premiums or analytics', {
          style: { background: '#FECACA', color: '#7F1D1D' },
        });
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const fetchPremiums = async () => {
    try {
      const response = await getAllPremiums(filters);
      setPremiums(response.data.premiums);
    } catch (err) {
      toast.error('Failed to refresh premiums', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  const fetchOverduePremiums = async () => {
    try {
      const response = await getOverduePremiums();
      setOverduePremiums(response.data.premiums);
    } catch (err) {
      toast.error('Failed to refresh overdue premiums', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  const getChartData = (type) => {
    if (!analytics) return { labels: [], datasets: [] };

    switch (type) {
      case 'statusBreakdown':
        return {
          labels: analytics.statusBreakdown.map((item) => item._id || 'Unknown'),
          datasets: [
            {
              label: 'Premiums by Status',
              data: analytics.statusBreakdown.map((item) => item.count),
            },
          ],
        };
      case 'platformBreakdown':
        return {
          labels: analytics.platformPremiums.map((item) => item._id || 'Unknown'),
          datasets: [
            {
              label: 'Premiums',
              data: analytics.platformPremiums.map((item) => item.count),
            },
            {
              label: 'Total Amount (KES)',
              data: analytics.platformPremiums.map((item) => item.totalAmount),
            },
          ],
        };
      case 'revenueTrends':
        return {
          labels: ['Total Revenue', 'Overdue Premiums', 'Discount Impact'],
          datasets: [
            {
              label: 'Values',
              data: [
                analytics.totalRevenue,
                analytics.overdueCount,
                analytics.totalDiscountImpact,
              ],
            },
          ],
        };
      default:
        return { labels: [], datasets: [] };
    }
  };

  const tabs = [
    { name: 'All Premiums', icon: <FiList className="mr-2" /> },
    { name: 'Overdue Premiums', icon: <FiClock className="mr-2" /> },
    { name: 'Analytics', icon: <FiPieChart className="mr-2" /> },
  ];

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
              Premium Management Dashboard
            </h1>
            <p className="text-xs md:text-sm lg:text-base text-gray-600 mt-2">
              Monitor premiums, adjust rates, audit with AI, and generate reports.
            </p>
          </div>
          <button
            onClick={() => setOpenReportModal(true)}
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
            <p className="text-brown mt-4 text-lg font-medium">Loading premiums...</p>
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
            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mb-6">
              {tabs.map((tab, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleTabChange(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center px-4 py-2 rounded-lg font-semibold text-sm md:text-base shadow-md transition-all duration-300 ${
                    tabValue === index
                      ? 'bg-gradient-to-r from-brown to-fadeBrown text-white '
                      : 'bg-white text-brown hover:bg-appleGreen hover:text-white'
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </motion.button>
              ))}
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <KPICard
                title="Total Premiums"
                value={analytics.totalPremiums}
                icon={<FiDollarSign />}
                secondaryText={`${analytics.statusBreakdown.find((s) => s._id === 'Paid')?.count || 0} paid`}
                color="appleGreen"
              />
              <KPICard
                title="Premium Revenue"
                value={`KES ${analytics?.totalRevenue || 0.0}`}
                icon={<FiFileText />}
                secondaryText="Total collected"
                color="yellowGreen"
              />
              <KPICard
                title="Overdue Premiums"
                value={analytics.overdueCount}
                icon={<FiClock />}
                secondaryText="Awaiting payment"
                color="appleGreen"
              />
              <KPICard
                title="Retry Success Rate"
                value={`${analytics.retrySuccessRate}%`}
                icon={<FiAlertCircle />}
                secondaryText="Payment retries"
                color="yellowGreen"
              />
            </div>

            {/* Tab Content */}
            {tabValue === 0 && (
              <div className="space-y-6">
                <PremiumFilters filters={filters} setFilters={setFilters} />
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setOpenBulkAdjust(true)}
                    className="inline-flex items-center px-6 py-3 bg-appleGreen rounded-lg font-semibold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <FiDollarSign className="mr-2" />
                    Bulk Adjust Premiums
                  </button>
                  <button
                    onClick={() => setOpenAuditModal(true)}
                    className="inline-flex items-center px-6 py-3 bg-yellowGreen rounded-lg font-semibold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <FiAlertCircle className="mr-2" />
                    Audit Premiums
                  </button>
                </div>
                <PremiumTable premiums={premiums} loading={loading} />
                <BulkAdjustForm
                  open={openBulkAdjust}
                  handleClose={() => setOpenBulkAdjust(false)}
                  premiums={premiums}
                  onSuccess={fetchPremiums}
                />
                <AuditPremiumModal
                  open={openAuditModal}
                  handleClose={() => setOpenAuditModal(false)}
                  premiums={premiums}
                  onSuccess={fetchPremiums}
                />
              </div>
            )}

            {tabValue === 1 && (
              <OverduePremiumsSection
                overduePremiums={overduePremiums}
                onSendReminders={fetchOverduePremiums}
              />
            )}

            {tabValue === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnalyticsChart
                    type="pie"
                    data={getChartData('statusBreakdown')}
                    title="Premiums by Status"
                  />
                  <AnalyticsChart
                    type="bar"
                    data={getChartData('platformBreakdown')}
                    title="Platform Breakdown"
                  />
                  <AnalyticsChart
                    type="bar"
                    data={getChartData('revenueTrends')}
                    title="Revenue and Risk Trends"
                  />
                </div>
                <h2 className="text-xl font-semibold text-brown">AI Insights</h2>
                <div className="grid grid-cols-1 2 gap-6">
                  {analytics.aiInsights.insights.map((insight, index) => (
                    <InsightCard key={index} insight={insight} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </PageAbsorber>
  );
};

export default Premiums;