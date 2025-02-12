import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LicenseModal from '../components/LicenseModal';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  const handleGetStarted = () => {
    // Check if license type is already selected
    const existingLicense = localStorage.getItem('selectedLicense');
    if (existingLicense) {
      navigate('/lessons');
    } else {
      setShowLicenseModal(true);
    }
  };

  const handleLicenseSelect = (licenseType) => {
    localStorage.setItem('selectedLicense', licenseType);
    setShowLicenseModal(false);
    navigate('/lessons');
  };

  const navigateToLesson = (lessonId) => {
    const existingLicense = localStorage.getItem('selectedLicense');
    if (existingLicense) {
      navigate(`/lessons?section=vehicle-controls&lesson=${lessonId}`);
    } else {
      setShowLicenseModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Master Your</span>
              <span className="block text-blue-600">Driver's License</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Comprehensive learning materials, practice tests, and everything you need to pass your driver's license test with confidence.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <button
                  onClick={handleGetStarted}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>

          {/* Popular Lessons Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Popular Lessons</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateToLesson('intro-controls')}
                className="bg-white overflow-hidden shadow rounded-lg cursor-pointer transform transition-all hover:shadow-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Introduction to Vehicle Controls</h3>
                  <p className="text-gray-600">
                    Learn about essential vehicle controls, dashboard indicators, and basic operations.
                  </p>
                  <div className="mt-4 flex items-center text-blue-600">
                    <span className="text-sm font-medium">Start Learning</span>
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Feature Cards */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Practice Tests</h3>
                  <p className="text-gray-600">
                    Test your knowledge with our comprehensive practice quizzes.
                  </p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
                  <p className="text-gray-600">
                    Monitor your learning progress and identify areas for improvement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LicenseModal
        isOpen={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
        onSelect={handleLicenseSelect}
      />
    </div>
  );
};

export default Home; 