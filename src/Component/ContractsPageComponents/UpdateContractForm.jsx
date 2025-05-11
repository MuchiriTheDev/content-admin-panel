// src/components/ContractsComponents/UpdateContractForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiAlertCircle } from 'react-icons/fi';
import { FaLock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { updateContract } from '../../Resources/Apiservice';

const UpdateContractForm = ({ isOpen, onClose, contract, contractId, onUpdate }) => {
  const [formData, setFormData] = useState({
    coveragePeriod: contract.insuranceStatus.coveragePeriod || 6,
    platformData: contract.platformInfo.platforms || [],
    financialInfo: { ...contract.financialInfo, monthlyEarnings: contract.financialInfo.monthlyEarnings || 0 },
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const firstInputRef = useRef(null);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  const handleInputChange = (e, field, index) => {
    const { name, value } = e.target;
    let newFormData = { ...formData };
    let newErrors = { ...errors };

    if (field === 'coveragePeriod') {
      newFormData.coveragePeriod = Number(value);
      newErrors.coveragePeriod = '';
    } else if (field === 'financialInfo') {
      newFormData.financialInfo = { ...formData.financialInfo, monthlyEarnings: Number(value) };
      newErrors['financialInfo.monthlyEarnings'] = '';
    } else if (field === 'platformData') {
      const updatedPlatforms = [...formData.platformData];
      updatedPlatforms[index][name] = value;
      newFormData.platformData = updatedPlatforms;
      newErrors[`platformData[${index}].${name}`] = '';
    }

    setFormData(newFormData);
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.coveragePeriod || formData.coveragePeriod <= 0) {
      newErrors.coveragePeriod = 'Coverage period is required and must be greater than 0';
    }
    if (formData.financialInfo.monthlyEarnings < 0) {
      newErrors['financialInfo.monthlyEarnings'] = 'Monthly earnings cannot be negative';
    }
    formData.platformData.forEach((platform, index) => {
      if (!platform.name) {
        newErrors[`platformData[${index}].name`] = 'Platform name is required';
      }
      if (!platform.username) {
        newErrors[`platformData[${index}].username`] = 'Username is required';
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      return;
    }
    setLoading(true);
    try {
      const response = await updateContract(contractId, formData);
      toast.success('Contract updated successfully', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
      onUpdate(response.data.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update contract', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    } finally {
      setLoading(false);
    }
  };

  // Dynamic guidance for key fields
  const fieldGuidance = (fieldName, value) => {
    const messages = {
      coveragePeriod: `Choose a coverage period (${value} months) to define the contract duration.`,
      'financialInfo.monthlyEarnings': 'Monthly earnings impact premium calculations.',
      'platformData.name': 'The platform name identifies the social media service.',
      'platformData.username': 'The username links to your account for verification.',
      default: 'Update this field to keep the contract accurate.',
    };
    return messages[fieldName] || messages.default;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-appleGreen relative bg-gradient-to-br from-white to-gray-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-appleGreen to-yellowGreen text-white rounded-t-xl">
              <h4 className="text-2xl md:text-3xl font-bold">Update Contract</h4>
              <button
                onClick={onClose}
                className="text-white hover:text-brown transition-colors duration-200"
                aria-label="Close modal"
              >
                <FiX size={28} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Contract Details Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-white rounded-lg shadow-md border-2 border-appleGreen"
              >
                <h5 className="text-xl font-semibold text-brown mb-4">Contract Details</h5>
                <p className="text-sm text-gray-500 mb-4">
                  Update coverage period and financial information for the contract.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-brown">
                      Coverage Period (months) <span className="text-red-500">*</span>
                    </label>
                    <select
                      ref={firstInputRef}
                      name="coveragePeriod"
                      value={formData.coveragePeriod}
                      onChange={(e) => handleInputChange(e, 'coveragePeriod')}
                      className={`w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200 ${
                        errors.coveragePeriod ? 'border-red-500' : ''
                      }`}
                      required
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                    </select>
                    {errors.coveragePeriod && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FiAlertCircle /> {errors.coveragePeriod}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                      <FaLock className="text-gray-400" />{' '}
                      {fieldGuidance('coveragePeriod', formData.coveragePeriod)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-brown">
                      Monthly Earnings (KES) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="monthlyEarnings"
                      value={formData.financialInfo.monthlyEarnings}
                      onChange={(e) => handleInputChange(e, 'financialInfo')}
                      className={`w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200 ${
                        errors['financialInfo.monthlyEarnings'] ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter monthly earnings"
                      min="0"
                      required
                    />
                    {errors['financialInfo.monthlyEarnings'] && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FiAlertCircle /> {errors['financialInfo.monthlyEarnings']}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                      <FaLock className="text-gray-400" />{' '}
                      {fieldGuidance('financialInfo.monthlyEarnings')}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Platforms Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="p-6 bg-white rounded-lg shadow-md border-2 border-appleGreen"
              >
                <h5 className="text-xl font-semibold text-brown mb-4">Social Platforms</h5>
                <p className="text-sm text-gray-500 mb-4">
                  Update social media platform details associated with the contract.
                </p>
                {formData.platformData.length === 0 ? (
                  <p className="text-gray-600 text-sm">No platforms added.</p>
                ) : (
                  formData.platformData.map((platform, index) => (
                    <div key={index} className="mb-6 border-2 border-appleGreen p-4 rounded-lg">
                      <h6 className="text-lg font-medium text-brown mb-2">Platform {index + 1}</h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-brown">
                            Platform Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={platform.name}
                            onChange={(e) => handleInputChange(e, 'platformData', index)}
                            className={`w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200 ${
                              errors[`platformData[${index}].name`] ? 'border-red-500' : ''
                            }`}
                            placeholder="Enter platform name"
                            required
                          />
                          {errors[`platformData[${index}].name`] && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <FiAlertCircle /> {errors[`platformData[${index}].name`]}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                            <FaLock className="text-gray-400" />{' '}
                            {fieldGuidance('platformData.name')}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-brown">
                            Username <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="username"
                            value={platform.username}
                            onChange={(e) => handleInputChange(e, 'platformData', index)}
                            className={`w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200 ${
                              errors[`platformData[${index}].username`] ? 'border-red-500' : ''
                            }`}
                            placeholder="Enter username"
                            required
                          />
                          {errors[`platformData[${index}].username`] && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <FiAlertCircle /> {errors[`platformData[${index}].username`]}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                            <FaLock className="text-gray-400" />{' '}
                            {fieldGuidance('platformData.username')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gray-200 text-brown rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300 shadow-md"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-yellowGreen to-appleGreen text-brown rounded-lg font-semibold disabled:opacity-50 transition-colors duration-300 shadow-md hover:shadow-yellowGreen/50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-brown"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FiSave className="mr-2" />
                      Save Changes
                    </span>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateContractForm;