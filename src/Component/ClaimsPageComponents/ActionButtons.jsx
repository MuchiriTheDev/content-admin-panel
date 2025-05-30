// src/components/claims/ActionButtons.jsx
import React, { useState } from 'react';
import { FiCpu, FiCheckCircle, FiAlertTriangle, FiFileText } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { evaluateClaimAI, markClaimPaid, auditClaimsWithAI, generateClaimReport } from '../../Resources/Apiservice';

const ActionButtons = ({ claimId, status, onAction, onAudit }) => {
  const [loading, setLoading] = useState({ evaluateAI: false, audit: false, markPaid: false, report: false });

  const handleAction = async (actionType) => {
    try {
      setLoading((prev) => ({ ...prev, [actionType]: true }));

      if (actionType === 'evaluateAI') {
        await evaluateClaimAI(claimId);
        toast.success('AI evaluation completed', {
          style: { background: '#A3E635', color: '#4A2C2A' },
        });
      } else if (actionType === 'markPaid') {
        await markClaimPaid(claimId);
        toast.success('Claim marked as paid', {
          style: { background: '#A3E635', color: '#4A2C2A' },
        });
      } else if (actionType === 'audit') {
        const response = await auditClaimsWithAI({ claimIds: [claimId] });
        const insights = response.data.data.find((result) => result.claimId === claimId)?.insights || [];
        onAudit(insights); // Pass insights to parent
        toast.success('Audit completed', {
          style: { background: '#A3E635', color: '#4A2C2A' },
        });
      } else if (actionType === 'report') {
        const response = await generateClaimReport({ claimId });
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `CCI_Claim_${claimId.slice(-6)}_Report.docx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('Report downloaded', {
          style: { background: '#A3E635', color: '#4A2C2A' },
        });
      }

      onAction(); // Refresh claim data
    } catch (err) {
      const errorMessage = err.response?.data?.error || `Failed to ${actionType.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
      toast.error(errorMessage, {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    } finally {
      setLoading((prev) => ({ ...prev, [actionType]: false }));
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      {(status === 'Submitted' || status === 'AI Reviewed') && (
        <button
          onClick={() => handleAction('evaluateAI')}
          disabled={loading.evaluateAI}
          className="px-6 py-3 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg flex items-center text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading.evaluateAI ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <FiCpu className="mr-2" />
          )}
          Run AI Evaluation
        </button>
      )}
      {status !== 'Paid' && (
        <button
          onClick={() => handleAction('audit')}
          disabled={loading.audit}
          className="px-6 py-3 bg-yellowGreen text-brown rounded-lg flex items-center text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading.audit ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-brown" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <FiAlertTriangle className="mr-2" />
          )}
          Audit Claim
        </button>
      )}
      {status === 'Approved' && (
        <button
          onClick={() => handleAction('markPaid')}
          disabled={loading.markPaid}
          className="px-6 py-3 bg-appleGreen text-brown rounded-lg flex items-center text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading.markPaid ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-brown" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <FiCheckCircle className="mr-2" />
          )}
          Mark as Paid
        </button>
      )}
      <button
        onClick={() => handleAction('report')}
        disabled={loading.report}
        className="px-6 py-3 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg flex items-center text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading.report ? (
          <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : (
          <FiFileText className="mr-2" />
        )}
        Generate Report
      </button>
    </div>
  );
};

export default ActionButtons;