import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StudyCard = ({ content, currentIndex, totalCards, onNext }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setDirection(1);
    setTimeout(() => {
      onNext();
      setIsFlipped(false);
      setDirection(0);
    }, 200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Card {currentIndex + 1} of {totalCards}
        </span>
        <div className="h-2 bg-gray-200 rounded-full flex-grow mx-4">
          <motion.div
            className="h-2 bg-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentIndex + 1) / totalCards) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex + (isFlipped ? '-flipped' : '')}
          initial={{ 
            opacity: 0,
            x: direction * 50
          }}
          animate={{ 
            opacity: 1,
            x: 0,
            rotateY: isFlipped ? 180 : 0
          }}
          exit={{ 
            opacity: 0,
            x: direction * -50
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          className="relative perspective-1000"
        >
          <div
            className={`bg-white rounded-xl shadow-lg p-8 cursor-pointer transform-style-3d transition-transform duration-500 min-h-[400px] flex flex-col justify-between ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={handleFlip}
          >
            <div className={`${isFlipped ? 'rotate-y-180' : ''} transform`}>
              {!isFlipped ? (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {content.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {content.front || content.question}
                  </p>
                  <p className="text-sm text-blue-600 mt-4">Click to reveal answer</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Answer</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {content.back || content.answer}
                  </p>
                  <p className="text-sm text-blue-600 mt-4">Click to see question</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {isFlipped ? 'Show Question' : 'Show Answer'}
              </button>
              {currentIndex + 1 < totalCards && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Next Card
                </motion.button>
              )}
              {currentIndex + 1 === totalCards && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Start Quiz
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Tip: Use the spacebar to flip the card, and the right arrow key to go to the next card
        </p>
      </div>
    </div>
  );
};

export default StudyCard; 