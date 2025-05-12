// src/components/PremiumComponents/OverduePremiumsSection.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Checkbox,
} from '@mui/material';
import * as ApiService from '../../Resources/Apiservice';

const OverduePremiumsSection = ({ overduePremiums, onSendReminders }) => {
  const [selectedPremiums, setSelectedPremiums] = useState([]);
  const [error, setError] = useState('');

  const handleSelect = (premiumId) => {
    setSelectedPremiums((prev) =>
      prev.includes(premiumId)
        ? prev.filter((id) => id !== premiumId)
        : [...prev, premiumId]
    );
  };

  const handleSendReminders = async () => {
    if (selectedPremiums.length === 0) {
      setError('Select at least one premium');
      return;
    }

    try {
      await ApiService.sendPaymentReminders({ premiumIds: selectedPremiums });
      alert('Reminders sent successfully');
      onSendReminders();
    } catch (err) {
      setError('Failed to send reminders');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Overdue Premiums
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Select</TableCell>
            <TableCell>User Email</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Percentage</TableCell>
            <TableCell>Amount (KES)</TableCell>
            <TableCell>Due Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {overduePremiums.map((premium) => (
            <TableRow key={premium._id}>
              <TableCell>
                <Checkbox
                  checked={selectedPremiums.includes(premium._id)}
                  onChange={() => handleSelect(premium._id)}
                />
              </TableCell>
              <TableCell>
                {premium.premiumDetails?.userId?.personalInfo?.email}
              </TableCell>
              <TableCell>
                {`${premium.premiumDetails?.userId?.personalInfo?.firstName} ${premium.premiumDetails?.userId?.personalInfo?.lastName}`}
              </TableCell>
              <TableCell>{premium.premiumDetails.finalPercentage}%</TableCell>
              <TableCell>{premium.premiumDetails.finalAmount.toFixed(2)}</TableCell>
              <TableCell>
                {new Date(premium.paymentStatus.dueDate).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        variant="contained"
        onClick={handleSendReminders}
        sx={{ mt: 2 }}
        disabled={selectedPremiums.length === 0}
      >
        Send Payment Reminders
      </Button>
    </Box>
  );
};

export default OverduePremiumsSection;