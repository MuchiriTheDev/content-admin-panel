// src/pages/ClaimsInfo.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import PageAbsorber from '../../Resources/PageAbsorber';
import {
  getClaimById,
  getClaimHistory,
  evaluateClaimAI,
  auditClaimsWithAI,
  markClaimPaid,
} from '../../Resources/Apiservice';
import ActionButtons from '../../Component/ClaimsPageComponents/ActionButtons';
import ClaimDetailsCard from '../../Component/ClaimsPageComponents/ClaimDetailsCard';
import EvidenceViewer from '../../Component/ClaimsPageComponents/EvidenceViewer';
import EvaluationCard from '../../Component/ClaimsPageComponents/EvaluationCard';
import AuditInsightsCard from '../../Component/ClaimsPageComponents/AuditInsightsCard';
import StatusHistoryTable from '../../Component/ClaimsPageComponents/StatusHistoryTable';
import ReviewClaimForm from '../../Component/ClaimsPageComponents/ReviewClaimForm';

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
        if (claimRes.data.success && historyRes.data.success) {
          setClaim(claimRes.data.claim);
          console.log('Claim Data:', claimRes.data.claim);
          setHistory(claimRes.data.claim.statusHistory?.history || []);
          setLoading(false);
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to fetch claim data';
        setError(errorMessage);
        toast.error(errorMessage, {
          style: { background: '#FECACA', color: '#7F1D1D' },
        });
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAction = async () => {
    try {
      const [claimRes, historyRes] = await Promise.all([
        getClaimById(id),
        getClaimHistory(id),
      ]);
      if (claimRes.data.success && historyRes.data.success) {
        toast.success('Successfully refreshed data', {
          style: { background: '#A3E635', color: '#4A2C2A' },
        });
        setClaim(claimRes.data.claim);
        setHistory(claimRes.data.claim.statusHistory?.history || []);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to refresh claim data';
      toast.error(errorMessage, {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  const handleAudit = (insights) => {
    try {
      if (!Array.isArray(insights)) {
        throw new Error('Invalid audit insights format');
      }
      setAuditInsights(insights);
      toast.success('Audit insights updated', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
      handleAction();
    } catch (err) {
      toast.error('Failed to process audit insights', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  const handleReviewSubmit = async () => {
    handleAction();
  };

  return (
    <PageAbsorber>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="p-4 md:p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl border border-appleGreen mx-auto my-4 max-w-5xl"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-brown tracking-tight">
              Claim (ID: {id.slice(-6)})
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              View and manage claim details.
            </p>
          </div>
          {claim && (
            <button
              onClick={() => setReviewModalOpen(true)}
              className="mt-3 md:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown rounded-lg text-xs font-semibold text-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
            >
              <FiCheckCircle className="mr-1 h-4 w-4" />
              Review
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block h-8 w-8 border-4 border-appleGreen border-t-transparent rounded-full"
            ></motion.div>
            <p className="text-brown mt-2 text-sm font-medium">Loading claim...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 text-red-900 p-3 rounded-lg mb-4 flex items-center"
          >
            <FiAlertCircle className="mr-2 text-base" />
            {error}
          </motion.div>
        )}

        {/* Main Content */}
        {!loading && !error && claim && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <ActionButtons
              claimId={id}
              status={claim.statusHistory?.history?.[claim.statusHistory.history.length - 1]?.status}
              onAction={handleAction}
              onAudit={handleAudit}
            />

            {/* Claim Details */}
            <ClaimDetailsCard claim={claim} />

            {/* Evidence */}
            <EvidenceViewer evidence={claim.evidence || { files: [], affectedContent: [] }} />

            {/* Evaluation */}
            <EvaluationCard evaluation={claim.evaluation || {}} />

            {/* Audit Insights */}
            {auditInsights.length > 0 && <AuditInsightsCard insights={auditInsights} claimId={id} />}

            {/* Status History */}
            <StatusHistoryTable history={claim.statusHistory?.history || []} claimId={id} />
          </div>
        )}

        {/* Review Modal */}
        <ReviewClaimForm
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          claimId={id}
          onSubmit={handleReviewSubmit}
          claim={claim}
        />
      </motion.div>
    </PageAbsorber>
  );
};

export default ClaimsInfo;