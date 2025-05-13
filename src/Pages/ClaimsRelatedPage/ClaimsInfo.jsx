// src/pages/ClaimsInfo.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import PageAbsorber from '../Resources/PageAbsorber';
import {
  getClaimById,
  getClaimHistory,
  evaluateClaimAI,
  auditClaimsWithAI,
  markClaimPaid,
} from '../services/api';
import ClaimDetailsCard from '../components/claims/ClaimDetailsCard';
import EvidenceViewer from '../components/claims/EvidenceViewer';
import EvaluationCard from '../components/claims/EvaluationCard';
import StatusHistoryTable from '../components/claims/StatusHistoryTable';
import AuditInsightsCard from '../components/claims/AuditInsightsCard';
import ReviewClaimForm from '../components/claims/ReviewClaimForm';
import ActionButtons from '../components/claims/ActionButtons';

const ClaimsInfo = () => {
  const { id } = useParams();
  const [claim, setClaim] = useState(null);
  const [history, setHistory] = useState([]);
  const [auditInsights, setAuditInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [claimRes, historyRes] = await Promise.all([
          getClaimById(id),
          getClaimHistory(id),
        ]);
        setClaim(claimRes.data.claim);
        setHistory(historyRes.data.data.history.statusChanges);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch claim data');
        toast.error('Failed to fetch claim data', {
          style: { background: '#FECACA', color: '#7F1D1D' },
        });
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAction = async () => {
    // Refresh claim and history after an action
    try {
      const [claimRes, historyRes] = await Promise.all([
        getClaimById(id),
        getClaimHistory(id),
      ]);
      setClaim(claimRes.data.claim);
      setHistory(historyRes.data.data.history.statusChanges);
    } catch (err) {
      toast.error('Failed to refresh claim data', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  const handleReviewSubmit = async () => {
    // Refresh claim and history after review
    handleAction();
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
              Claim Details (ID: {id.slice(-6)})
            </h1>
            <p className="text-xs md:text-sm lg:text-base text-gray-600 mt-2">
              View and manage individual claim details.
            </p>
          </div>
          {claim && (
            <button
              onClick={() => setReviewModalOpen(true)}
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-brown to-fadeBrown rounded-lg font-semibold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <FiCheckCircle className="mr-2" />
              Review Claim
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block h-12 w-12 border-4 border-appleGreen border-t-transparent rounded-full"
            ></motion.div>
            <p className="text-brown mt-4 text-lg font-medium">Loading claim details...</p>
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
        {!loading && !error && claim && (
          <div className="space-y-10">
            {/* Action Buttons */}
            <ActionButtons
              claimId={id}
              status={claim.statusHistory.history[claim.statusHistory.history.length - 1].status}
              onAction={handleAction}
            />

            {/* Claim Details */}
            <ClaimDetailsCard claimDetails={claim.claimDetails} />

            {/* Evidence */}
            <EvidenceViewer evidence={claim.evidence} />

            {/* Evaluation */}
            <EvaluationCard evaluation={claim.evaluation} />

            {/* Audit Insights */}
            {auditInsights.length > 0 && <AuditInsightsCard insights={auditInsights} />}

            {/* Status History */}
            <StatusHistoryTable history={history} />
          </div>
        )}

        {/* Review Modal */}
        <ReviewClaimForm
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          claimId={id}
          onSubmit={handleReviewSubmit}
        />
      </motion.div>
    </PageAbsorber>
  );
};

export default ClaimsInfo;