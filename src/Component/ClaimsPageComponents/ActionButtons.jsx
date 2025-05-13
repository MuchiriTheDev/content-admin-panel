// src/components/claims/ActionButtons.jsx
import React from 'react';
import { FiCpu, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { evaluateClaimAI, markClaimPaid, auditClaimsWithAI } from '../../services/api';

const ActionButtons = ({ claimId, status, onAction }) => {
  const handleAction = async (actionType) => {
    try {
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
        await auditClaimsWithAI({ claimIds: [claimId] });
        toast.success('Audit completed', {
          style: { background: '#A3E635', color: '#4A2C2A' },
        });
      }
      onAction();
    } catch (err) {
      toast.error('Action failed', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  return (
    <div className="flex space-x-4">
      {status === 'Submitted' && (
        <button
          onClick={() => handleAction('evaluateAI')}
          className="px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg flex items-center"
        >
          <FiCpu className="mr-2" /> Run AI Evaluation
        </button>
      )}
      {status !== 'Paid' && (
        <button
          onClick={() => handleAction('audit')}
          className="px-4 py-2 bg-yellowGreen text-brown rounded-lg flex items-center"
        >
          <FiAlertTriangle className="mr-2" /> Audit Claim
        </button>
      )}
      {status === 'Approved' && (
        <button
          onClick={() => handleAction('markPaid')}
          className="px-4 py-2 bg-appleGreen text-brown rounded-lg flex items-center"
        >
          <FiCheckCircle className="mr-2" /> Mark as Paid
        </button>
      )}
    </div>
  );
};

export default ActionButtons;