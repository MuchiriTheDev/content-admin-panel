// src/components/claims/EvidenceViewer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiFile } from 'react-icons/fi';

const EvidenceViewer = ({ evidence }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen"
    >
      <h2 className="text-xl font-semibold text-brown mb-4 flex items-center">
        <FiFile className="mr-2" /> Evidence
      </h2>
      <div className="space-y-6">
        <div>
          <p className="text-xs md:text-sm text-gray-500">Files</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidence.files.map((file) => (
              <div key={file.url} className="border border-gray-200 p-4 rounded-lg">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-brown hover:underline">
                  {file.type}: {file.description}
                </a>
                <p className="text-xs text-gray-600 mt-1">
                  Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-500">Affected Content</p>
          {evidence.affectedContent.length === 0 ? (
            <p className="text-gray-600">No affected content provided.</p>
          ) : (
            <div className="space-y-2">
              {evidence.affectedContent.map((content) => (
                <div key={content.url || content.description} className="border border-gray-200 p-4 rounded-lg">
                  <p className="text-brown font-medium">{content.description}</p>
                  <p className="text-xs text-gray-600">Media Type: {content.mediaType}</p>
                  {content.url && (
                    <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-brown hover:underline">
                      View Content
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EvidenceViewer;