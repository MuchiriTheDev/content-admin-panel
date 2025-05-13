// src/pages/Claims.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiAlertCircle, FiDollarSign, FiXCircle, FiCpu } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import PageAbsorber from '../../Resources/PageAbsorber';
import {
  getAllClaims,
  getPendingDeadlineClaims,
  getClaimAnalytics,
  flagHighRiskCreators,
  bulkReviewClaims,
} from '../../Resources/Apiservice';
import ClaimsKPICard from '../../Component/ClaimsPageComponents/ClaimsKPICard';
import UrgentClaimsCard from '../../Component/ClaimsPageComponents/UrgentClaimsCard';
import ClaimsAnalyticsChart from '../../Component/ClaimsPageComponents/ClaimsAnalyticsChart';
import ClaimsTable from '../../Component/ClaimsPageComponents/ClaimsTable';
import HighRiskCreatorsCard from '../../Component/ClaimsPageComponents/HighRiskCreatorsCard';
import ClaimInsightCard from '../../Component/ClaimsPageComponents/ClaimInsightCard';
import ClaimReportForm from '../../Component/ClaimsPageComponents/ClaimReportForm';
import InsightCard from '../../Component/HomePageComponents/InsightCard';
import KPICard from '../../Component/HomePageComponents/KPICard';

const Claims = () => {
  const [analytics, setAnalytics] = useState(null);
  const [claims, setClaims] = useState([]);
  const [urgentClaims, setUrgentClaims] = useState([]);
  const [highRiskCreators, setHighRiskCreators] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [filters, setFilters] = useState({ status: '', platform: '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [analyticsRes, claimsRes, urgentRes, highRiskRes] = await Promise.all([
          getClaimAnalytics(filters),
          getAllClaims({ ...filters, page: pagination.page, limit: pagination.limit }),
          getPendingDeadlineClaims(),
          flagHighRiskCreators(filters),
        ]);
        setAnalytics(analyticsRes.data.analytics);
        setClaims(claimsRes.data.claims);
        setPagination(claimsRes.data.pagination);
        setUrgentClaims(urgentRes.data.claims);
        setHighRiskCreators(highRiskRes.data.highRiskCreators);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch claims data');
        toast.error('Failed to fetch claims data', {
          style: { background: '#FECACA', color: '#7F1D1D' },
        });
        setLoading(false);
      }
    };
    fetchData();
  }, [filters, pagination.page]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleBulkReview = async (selectedClaims) => {
    // Placeholder for bulk review logic; actual implementation depends on UI
    try {
      await bulkReviewClaims({
        reviews: selectedClaims.map((claimId) => ({
          claimId,
          isValid: true, // Example; replace with form input
          notes: 'Bulk approved',
          payoutAmount: 0, // Example; replace with form input
        })),
      });
      toast.success('Bulk review completed', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
      // Refresh claims
      const claimsRes = await getAllClaims({ ...filters, page: pagination.page, limit: pagination.limit });
      setClaims(claimsRes.data.claims);
      setPagination(claimsRes.data.pagination);
    } catch (err) {
      toast.error('Bulk review failed', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  const getChartData = (type) => {
    if (!analytics) return { labels: [], datasets: [] };
    switch (type) {
      case 'statusBreakdown':
        return {
          labels: analytics.statusBreakdown.map((item) => item._id || 'Unknown'),
          datasets: [{ label: 'Claims by Status', data: analytics.statusBreakdown.map((item) => item.count) }],
        };
      case 'platformBreakdown':
        return {
          labels: analytics.platformBreakdown.map((item) => item._id || 'Unknown'),
          datasets: [
            { label: 'Claims', data: analytics.platformBreakdown.map((item) => item.count) },
            { label: 'Payout', data: analytics.platformBreakdown.map((item) => item.totalPayout) },
          ],
        };
      case 'incidentTypeBreakdown':
        return {
          labels: analytics.incidentTypeBreakdown.map((item) => item._id || 'Unknown'),
          datasets: [{ label: 'Incident Types', data: analytics.incidentTypeBreakdown.map((item) => item.count) }],
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
              Claims Dashboard
            </h1>
            <p className="text-xs md:text-sm lg:text-base text-gray-600 mt-2">
              Monitor and manage all claims, analytics, and reports.
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
            <p className="text-brown mt-4 text-lg font-medium">Loading claims data...</p>
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
                title="Total Claims"
                value={analytics.totalClaims}
                icon={<FiAlertCircle className="mr-1" />}
                secondaryText={`${analytics.statusBreakdown.find(s => s._id === 'Approved')?.count || 0} approved`}
                color="yellowGreen"
              />
              <KPICard
                title="Average Payout"
                value={`KES ${analytics.averagePayout}`}
                icon={<FiDollarSign className="mr-1" />}
                secondaryText="For approved claims"
                color="appleGreen"
              />
              <KPICard
                title="Rejection Rate"
                value={`${analytics.rejectionRate}%`}
                icon={<FiXCircle className="mr-1" />}
                secondaryText="Of total claims"
                color="yellowGreen"
              />
              <KPICard
                title="AI Confidence"
                value={`${analytics.averageAIConfidence}%`}
                icon={<FiCpu className="mr-1" />}
                secondaryText="Avg AI evaluation score"
                color="appleGreen"
              />
            </div>

            {/* Urgent Claims */}
            <UrgentClaimsCard claims={urgentClaims} />

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ClaimsAnalyticsChart
                type="pie"
                data={getChartData('statusBreakdown')}
                title="Claims by Status"
              />
              <ClaimsAnalyticsChart
                type="bar"
                data={getChartData('platformBreakdown')}
                title="Platform Breakdown"
              />
              <ClaimsAnalyticsChart
                type="line"
                data={getChartData('incidentTypeBreakdown')}
                title="Incident Type Trends"
              />
            </div>

            {/* Claims Table */}
            <ClaimsTable
              claims={claims}
              pagination={pagination}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              onBulkReview={handleBulkReview}
            />

            {/* High-Risk Creators */}
            {highRiskCreators.length > 0 && (
              <HighRiskCreatorsCard creators={highRiskCreators} />
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
        <ClaimReportForm isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} />
      </motion.div>
    </PageAbsorber>
  );
};

export default Claims;