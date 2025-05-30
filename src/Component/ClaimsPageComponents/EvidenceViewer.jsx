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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isModalOpen]);

  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'screenshot':
      case 'image':
        return <FiImage className="text-brown h-4 w-4" />;
      case 'video':
        return <FiVideo className="text-brown h-4 w-4" />;
      case 'document':
        return <FiFileText className="text-brown h-4 w-4" />;
      default:
        return <FiFile className="text-brown h-4 w-4" />;
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
        className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg shadow-sm border border-appleGreen"
      >
        <h2 className="text-base font-semibold text-brown mb-2 flex items-center">
          <FiFile className="mr-1 h-4 w-4" /> Evidence
        </h2>
        <p className="text-sm text-gray-600 flex items-center">
          <FiAlertCircle className="mr-1 h-4 w-4" /> No evidence provided.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-appleGreen"
    >
      <h2 className="text-lg font-semibold text-brown mb-3 flex items-center">
        <FiFile className="mr-1 h-4 w-4" /> Evidence
      </h2>
      <div className="space-y-3">
        {/* Files Section */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Files</p>
          {evidence.files?.length === 0 ? (
            <p className="text-sm text-gray-600">No files uploaded.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {evidence.files.map((file) => (
                <div
                  key={file.url}
                  className="border border-gray-200 p-2 rounded-md flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-1">
                    {getFileIcon(file.type)}
                    <p className="text-sm text-brown font-medium truncate">{file.description}</p>
                  </div>
                  {file.type?.toLowerCase() === 'screenshot' || file.type?.toLowerCase() === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.description}
                      className="h-30 w-full object-cover rounded cursor-pointer"
                      loading="lazy"
                      onClick={() => openModal(file)}
                      onError={() => handleError('image')}
                    />
                  ) : file.type?.toLowerCase() === 'video' ? (
                    <div
                      className="h-16 w-full bg-gray-200 rounded flex items-center justify-center cursor-pointer"
                      onClick={() => openModal(file)}
                    >
                      <FiVideo className="text-lg text-gray-500" />
                    </div>
                  ) : (
                    <div className="h-16 w-full bg-gray-200 rounded flex items-center justify-center">
                      <FiFileText className="text-lg text-gray-500" />
                    </div>
                  )}
                  <p className="text-xs text-gray-600">
                    {file.type} | {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openModal(file)}
                      className="px-3 py-1.5 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-md text-xs font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                    >
                      View
                    </button>
                    <a
                      href={file.url}
                      download={`${file.description || 'evidence'}${getFileExtension(file.type)}`}
                      className="px-3 py-1.5 bg-yellowGreen text-brown rounded-md text-xs font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
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
          <p className="text-xs font-medium text-gray-500 mb-1">Affected Content</p>
          {evidence.affectedContent?.length === 0 ? (
            <p className="text-sm text-gray-600">No affected content provided.</p>
          ) : (
            <div className="space-y-2">
              {evidence.affectedContent.map((content) => (
                <div
                  key={content.url || content.description}
                  className="border border-gray-200 p-2 rounded-md"
                >
                  <p className="text-sm text-brown font-medium">{content.description}</p>
                  <p className="text-xs text-gray-600">Type: {content.mediaType}</p>
                  {content.url ? (
                    <a
                      href={content.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brown hover:underline text-xs"
                      onClick={() => {
                        if (!content.url) handleError('content URL');
                      }}
                    >
                      View Content
                    </a>
                  ) : (
                    <p className="text-xs text-gray-600">No URL provided</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 shadow-xl w-full max-w-xl"
            ref={modalRef}
            tabIndex={-1}
          >
            <h3 className="text-base font-semibold text-brown mb-2">
              {selectedFile?.description || 'Evidence Preview'}
            </h3>
            {selectedFile?.type?.toLowerCase() === 'video' ? (
              <video
                controls
                src={selectedFile.url}
                className="w-full h-auto max-h-[75vh] object-cover rounded"
                onError={() => handleError('video')}
              />
            ) : (
              <img
                src={selectedFile?.url}
                alt={selectedFile?.description}
                className="w-full h-auto max-h-[75vh] object-cover rounded"
                onError={() => handleError('image')}
              />
            )}
            <div className="mt-2 flex justify-end space-x-2">
              <a
                href={selectedFile?.url}
                download={`${selectedFile?.description || 'evidence'}${getFileExtension(selectedFile?.type)}`}
                className="px-3 py-1.5 bg-yellowGreen text-brown rounded-md text-xs font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
              >
                Download
              </a>
              <button
                onClick={closeModal}
                className="px-3 py-1.5 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-md text-xs font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
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