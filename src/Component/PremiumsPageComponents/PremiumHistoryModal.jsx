// src/components/PremiumComponents/PremiumHistoryModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import * as ApiService from '../../Resources/Apiservice';

const PremiumHistoryModal = ({ open, handleClose, premiumId }) => {
  const [history, setHistory] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      const fetchHistory = async () => {
        try {
          const response = await ApiService.getPremiumHistory(premiumId);
          setHistory(response.data.history);
        } catch (err) {
          setError('Failed to fetch premium history');
        }
      };
      fetchHistory();
    }
  }, [open, premiumId]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: 600,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Premium History
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {history ? (
          <>
            <Typography variant="subtitle1">Calculation History</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell>Amount (KES)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.calculationHistory.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                    <TableCell>{entry.percentage}%</TableCell>
                    <TableCell>{entry.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Payment Attempts
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Error</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.paymentAttempts.map((attempt, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(attempt.date).toLocaleDateString()}</TableCell>
                    <TableCell>{attempt.status}</TableCell>
                    <TableCell>{attempt.errorMessage || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Reminders Sent: {history.remindersSent}
            </Typography>
            <Typography variant="subtitle1">
              Renewal Count: {history.renewalCount}
            </Typography>
            <Typography variant="subtitle1">
              Last Renewed: {history.lastRenewedAt ? new Date(history.lastRenewedAt).toLocaleDateString() : 'N/A'}
            </Typography>
          </>
        ) : (
          <Typography>Loading...</Typography>
        )}
        <Button variant="outlined" onClick={handleClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default PremiumHistoryModal;