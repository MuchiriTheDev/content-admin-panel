// src/components/claims/EvidenceViewer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiFile, FiImage, FiVideo, FiFileText, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const EvidenceViewer = ({ evidence }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const modalRef = useRef(null);

  const openModal = (file) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  // Handle Esc key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Focus trapping
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isModalOpen]);

  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'screenshot':
      case 'image':
        return <FiImage className="text-brown" />;
      case 'video':
        return <FiVideo className="text-brown" />;
      case 'document':
        return <FiFileText className="text-brown" />;
      default:
        return <FiFile className="text-brown" />;
    }
  };

  const getFileExtension = (type) => {
    switch (type?.toLowerCase()) {
      case 'screenshot':
      case 'image':
        return '.jpg';
      case 'video':
        return '.mp4';
      case 'document':
        return '.pdf';
      default:
        return '';
    }
  };

  const handleError = (type) => {
    toast.error(`Failed to load ${type}`, {
      style: { background: '#FECACA', color: '#7F1D1D' },
    });
  };

  if (!evidence || (!evidence.files?.length && !evidence.affectedContent?.length)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md border border-appleGreen"
      >
        <h2 className="text-xl font-semibold text-brown mb-4 flex items-center">
          <FiFile className="mr-2" /> Evidence
        </h2>
        <p className="text-gray-600 flex items-center">
          <FiAlertCircle className="mr-2" /> No evidence provided.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen"
    >
      <h2 className="text-xl font-semibold text-brown mb-4 flex items-center">
        <FiFile className="mr-2" /> Evidence
      </h2>
      <div className="space-y-6">
        {/* Files Section */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Files</p>
          {evidence.files?.length === 0 ? (
            <p className="text-gray-600">No files uploaded.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {evidence.files.map((file) => (
                <div
                  key={file.url}
                  className="border border-gray-200 p-4 rounded-lg flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    {getFileIcon(file.type)}
                    <p className="text-base text-brown font-medium truncate">{file.description}</p>
                  </div>
                  {file.type?.toLowerCase() === 'screenshot' || file.type?.toLowerCase() === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.description}
                      className="h-24 w-full object-cover rounded-md cursor-pointer"
                      loading="lazy"
                      onClick={() => openModal(file)}
                      onError={() => handleError('image')}
                    />
                  ) : file.type?.toLowerCase() === 'video' ? (
                    <div
                      className="h-24 w-full bg-gray-200 rounded-md flex items-center justify-center cursor-pointer"
                      onClick={() => openModal(file)}
                    >
                      <FiVideo className="text-2xl text-gray-500" />
                    </div>
                  ) : (
                    <div className="h-24 w-full bg-gray-200 rounded-md flex items-center justify-center">
                      <FiFileText className="text-2xl text-gray-500" />
                    </div>
                  )}
                  <p className="text-sm text-gray-600">
                    Type: {file.type} | Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(file)}
                      className="px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      View
                    </button>
                    <a
                      href={file.url}
                      download={`${file.description || 'evidence'}${getFileExtension(file.type)}`}
                      className="px-4 py-2 bg-yellowGreen text-brown rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Affected Content Section */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Affected Content</p>
          {evidence.affectedContent?.length === 0 ? (
            <p className="text-gray-600">No affected content provided.</p>
          ) : (
            <div className="space-y-4">
              {evidence.affectedContent.map((content) => (
                <div
                  key={content.url || content.description}
                  className="border border-gray-200 p-4 rounded-lg"
                >
                  <p className="text-base text-brown font-medium">{content.description}</p>
                  <p className="text-sm text-gray-600">Media Type: {content.mediaType}</p>
                  {content.url ? (
                    <a
                      href={content.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brown hover:underline text-sm"
                      onClick={() => {
                        if (!content.url) handleError('content URL');
                      }}
                    >
                      View Content
                    </a>
                  ) : (
                    <p className="text-sm text-gray-600">No URL provided</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-xl w-full max-w-3xl"
            ref={modalRef}
            tabIndex={-1}
          >
            <h3 className="text-xl font-semibold text-brown mb-4">
              {selectedFile?.description || 'Evidence Preview'}
            </h3>
            {selectedFile?.type?.toLowerCase() === 'video' ? (
              <video
                controls
                src={selectedFile.url}
                className="w-full h-auto rounded-lg"
                onError={() => handleError('video')}
              />
            ) : (
              <img
                src={selectedFile?.url}
                alt={selectedFile?.description}
                className="w-full h-auto rounded-lg"
                onError={() => handleError('image')}
              />
            )}
            <div className="mt-4 flex justify-end space-x-4">
              <a
                href={selectedFile?.url}
                download={`${selectedFile?.description || 'evidence'}${getFileExtension(selectedFile?.type)}`}
                className="px-4 py-2 bg-yellowGreen text-brown rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Download
              </a>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default EvidenceViewer;