// src/Component/HomePageComponents/UpdateUserForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiAlertCircle} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { updateUser } from '../../Resources/Apiservice';
import { FaLock } from 'react-icons/fa';

const UpdateUserForm = ({ isOpen, onClose, user, userId, onUpdate }) => {
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: user.user.personalInfo.firstName || '',
      lastName: user.user.personalInfo.lastName || '',
      email: user.user.personalInfo.email || '',
      phoneNumber: user.user.personalInfo.phoneNumber || '',
      country: user.user.personalInfo.country || 'Kenya',
      address: {
        street: user.user.personalInfo.address?.street || '',
        city: user.user.personalInfo.address?.city || '',
        postalCode: user.user.personalInfo.address?.postalCode || '',
      },
    },
    isVerified: user.user.isVerified || false,
    role: user.user.role || 'Creator',
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newFormData = { ...formData };

    if (name.includes('personalInfo.address.')) {
      const field = name.split('.')[2];
      newFormData = {
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          address: { ...formData.personalInfo.address, [field]: value },
        },
      };
    } else if (name.includes('personalInfo.')) {
      const field = name.split('.')[1];
      newFormData = {
        ...formData,
        personalInfo: { ...formData.personalInfo, [field]: value },
      };
    } else {
      newFormData = {
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      };
    }

    setFormData(newFormData);
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.personalInfo.firstName) {
      newErrors['personalInfo.firstName'] = 'First name is required';
    }
    if (!formData.personalInfo.email) {
      newErrors['personalInfo.email'] = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.personalInfo.email)) {
      newErrors['personalInfo.email'] = 'Invalid email format';
    }
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
      const response = await updateUser(userId, formData);
      toast.success('User updated successfully', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
      onUpdate(response.data.data);
      window.location.reload();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update user', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    } finally {
      setLoading(false);
    }
  };

  // Dynamic guidance for key fields
  const fieldGuidance = (fieldName, value) => {
    const messages = {
      'personalInfo.email': 'This email will be used for account communication and verification.',
      'role': value === 'Creator' ? 'Creators can manage content and insurance.' : 'Admins have full system access.',
      'isVerified': value ? 'Verified accounts have enhanced credibility.' : 'Verification can boost account trust.',
      default: 'Update this field to keep your profile accurate.',
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
              <h4 className="text-2xl md:text-3xl font-bold">Update User Profile</h4>
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
              {/* Personal Information Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-white rounded-lg shadow-md border-2 border-appleGreen"
              >
                <h5 className="text-xl font-semibold text-brown mb-4">Personal Information</h5>
                <p className="text-sm text-gray-500 mb-4">
                  Update your personal details to keep your profile accurate.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-brown">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={firstInputRef}
                      type="text"
                      name="personalInfo.firstName"
                      value={formData.personalInfo.firstName}
                      onChange={handleChange}
                      className={`w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200 ${
                        errors['personalInfo.firstName'] ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter first name"
                      required
                    />
                    {errors['personalInfo.firstName'] && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FiAlertCircle /> {errors['personalInfo.firstName']}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                      <FaLock className="text-gray-400" /> {fieldGuidance('personalInfo.firstName')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-brown">Last Name</label>
                    <input
                      type="text"
                      name="personalInfo.lastName"
                      value={formData.personalInfo.lastName}
                      onChange={handleChange}
                      className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-brown">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="personalInfo.email"
                      value={formData.personalInfo.email}
                      onChange={handleChange}
                      className={`w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200 ${
                        errors['personalInfo.email'] ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter email"
                      required
                    />
                    {errors['personalInfo.email'] && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FiAlertCircle /> {errors['personalInfo.email']}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                      <FaLock className="text-gray-400" /> {fieldGuidance('personalInfo.email')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-brown">Phone Number</label>
                    <input
                      type="tel"
                      name="personalInfo.phoneNumber"
                      value={formData.personalInfo.phoneNumber}
                      onChange={handleChange}
                      className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Address Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="p-6 bg-white rounded-lg shadow-md border-2 border-appleGreen"
              >
                <h5 className="text-xl font-semibold text-brown mb-4">Address</h5>
                <p className="text-sm text-gray-500 mb-4">
                  Provide your address for accurate account and insurance records.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-brown">Country</label>
                    <input
                      type="text"
                      name="personalInfo.country"
                      value={formData.personalInfo.country}
                      onChange={handleChange}
                      className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                      placeholder="Enter country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-brown">Street Address</label>
                    <input
                      type="text"
                      name="personalInfo.address.street"
                      value={formData.personalInfo.address.street}
                      onChange={handleChange}
                      className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                      placeholder="Enter street address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-brown">City</label>
                    <input
                      type="text"
                      name="personalInfo.address.city"
                      value={formData.personalInfo.address.city}
                      onChange={handleChange}
                      className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-brown">Postal Code</label>
                    <input
                      type="text"
                      name="personalInfo.address.postalCode"
                      value={formData.personalInfo.address.postalCode}
                      onChange={handleChange}
                      className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Account Settings Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="p-6 bg-white rounded-lg shadow-md border-2 border-appleGreen"
              >
                <h5 className="text-xl font-semibold text-brown mb-4">Account Settings</h5>
                <p className="text-sm text-gray-500 mb-4">
                  Manage account roles and verification status.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-brown">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                    >
                      <option value="Creator">Creator</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                      <FaLock className="text-gray-400" /> {fieldGuidance('role', formData.role)}
                    </p>
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-medium text-brown mt-2">
                      <input
                        type="checkbox"
                        name="isVerified"
                        checked={formData.isVerified}
                        onChange={handleChange}
                        className="mr-2 h-5 w-5 text-appleGreen focus:ring-yellowGreen border-gray-300 rounded"
                      />
                      Verified Account
                    </label>
                    <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                      <FaLock className="text-gray-400" /> {fieldGuidance('isVerified', formData.isVerified)}
                    </p>
                  </div>
                </div>
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

export default UpdateUserForm;