// src/components/claims/ActionButtons.jsx
import React, { useState } from 'react';
import { FiCpu, FiCheckCircle, FiAlertTriangle, FiFileText } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { evaluateClaimAI, markClaimPaid, auditClaimsWithAI, generateClaimReport } from '../../Resources/Apiservice';

const ActionButtons = ({ claimId, status, onAction, onAudit }) => {
  const [loading, setLoading] = useState({
    evaluateAI: false,
    audit: false,
    markPaid: false,
    report: false,
  });

  const handleAction = async (actionType) => {
    try {
      setLoading((prev) => ({ ...prev, [actionType]: true }));

      if (actionType === 'evaluateAI') {
        await evaluateClaimAI(claimId);
        toast.success('AI evaluation completed', {
          style: { background: '#A3E635', color: '#4A2C2A' },
        });
      } else if (actionType === 'markPaid') {
        if (!window.confirm('Mark this claim as paid? This action cannot be undone.')) return;
        await markClaimPaid(claimId);
        toast.success('Claim marked as paid', {
          style: { background: '#A3E635', color: '#4A2C2A' },
        });
      } else if (actionType === 'audit') {
        if (!window.confirm('Run audit on this claim?')) return;
        const response = await auditClaimsWithAI({ claimIds: [claimId] });
        const insights = response.data?.data?.find((result) => result.claimId === claimId)?.insights || [];
        if (!Array.isArray(insights)) throw new Error('Invalid audit insights format');
        onAudit(insights);
        toast.success('Audit completed', {
          style: { background: '#A3E635', color: '#4A2C2A' },
        });
      } else if (actionType === 'report') {
        const response = await generateClaimReport({ claimId });
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `CCI_Claim_${claimId.slice(-6)}_Report.docx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success('Report downloaded', {
          style: { background: '#A3E635', color: '#4A2C2A' },
        });
      }

      onAction(); // Refresh claim data
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || `Failed to ${actionType.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
      toast.error(errorMessage, {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    } finally {
      setLoading((prev) => ({ ...prev, [actionType]: false }));
    }
  };

  // Normalize status for safety
  const normalizedStatus = status?.toLowerCase() || '';

  return (
    <div className="flex flex-wrap gap-2 max-w-full">
      {['submitted', 'ai reviewed', 'pending'].includes(normalizedStatus) && (
        <button
          onClick={() => handleAction('evaluateAI')}
          disabled={loading.evaluateAI}
          className="px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg flex items-center text-xs font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {loading.evaluateAI ? (
            <svg className="animate-spin h-4 w-4 mr-1 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <FiCpu className="mr-1 h-4 w-4" />
          )}
          AI Evaluation
        </button>
      )}
      {normalizedStatus !== 'paid' && (
        <button
          onClick={() => handleAction('audit')}
          disabled={loading.audit}
          className="px-4 py-2 bg-yellowGreen text-brown rounded-lg flex items-center text-xs font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {loading.audit ? (
            <svg className="animate-spin h-4 w-4 mr-1 text-brown" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <FiAlertTriangle className="mr-1 h-4 w-4" />
          )}
          Audit
        </button>
      )}
      {normalizedStatus === 'approved' && (
        <button
          onClick={() => handleAction('markPaid')}
          disabled={loading.markPaid}
          className="px-4 py-2 bg-appleGreen text-brown rounded-lg flex items-center text-xs font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {loading.markPaid ? (
            <svg className="animate-spin h-4 w-4 mr-1 text-brown" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <FiCheckCircle className="mr-1 h-4 w-4" />
          )}
          Mark Paid
        </button>
      )}
      <button
        onClick={() => handleAction('report')}
        disabled={loading.report}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center text-xs font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        {loading.report ? (
          <svg className="animate-spin h-4 w-4 mr-1 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : (
          <FiFileText className="mr-1 h-4 w-4" />
        )}
        Report
      </button>
    </div>
  );
};

export default ActionButtons;