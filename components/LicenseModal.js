import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LicenseModal = ({ isOpen, onClose, onSelect }) => {
  const navigate = useNavigate();

  const licenses = [
    {
      type: 'Class C',
      description: 'Standard driver's license for cars and light vehicles',
      icon: '🚗'
    },
    {
      type: 'Class A',
      description: 'Commercial license for large trucks and trailers',
      icon: '🚛'
    },
    {
      type: 'Class M',
      description: 'Motorcycle license',
      icon: '🏍️'
    }
  ];

  const handleSelect = (licenseType) => {
    onSelect(licenseType);
    navigate('/lessons');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Welcome! What license would you like to learn?</h2>
        <div className="space-y-4">
          {licenses.map((license) => (
            <motion.button
              key={license.type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(license.type)}
              className="w-full p-4 bg-white border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-4"
            >
              <span className="text-4xl">{license.icon}</span>
              <div className="text-left">
                <h3 className="font-semibold text-lg">{license.type}</h3>
                <p className="text-gray-600">{license.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LicenseModal; 