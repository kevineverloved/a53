import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';

const Quiz = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleAnswerSelect = (answer) => {
    if (!showFeedback) {
      setSelectedAnswer(answer);
    }
  };

  const handleNext = async () => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    setAnswers([
      ...answers,
      {
        question: currentQuestion.question,
        selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect
      }
    ]);

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowFeedback(true);

    setTimeout(async () => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setShowResults(true);
        if ((score + (isCorrect ? 1 : 0)) / questions.length >= 0.8) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }

        // Save quiz results to Supabase
        try {
          const { error } = await supabase
            .from('quiz_results')
            .insert([
              {
                score: score + (isCorrect ? 1 : 0),
                total_questions: questions.length,
                time_spent: timeSpent,
                answers: answers.concat({
                  question: currentQuestion.question,
                  selectedAnswer,
                  correctAnswer: currentQuestion.correctAnswer,
                  isCorrect
                })
              }
            ]);

          if (error) throw error;
        } catch (error) {
          console.error('Error saving quiz results:', error);
        }
      }
    }, 2000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const finalScore = (score / questions.length) * 100;
    const performance = finalScore >= 80 ? 'Excellent!' : finalScore >= 60 ? 'Good job!' : 'Keep practicing!';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full mx-auto text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Quiz Complete!</h2>
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto relative">
            <svg className="transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-gray-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="44"
                cx="50"
                cy="50"
              />
              <circle
                className={`${
                  finalScore >= 80 ? 'text-green-500' : finalScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                }`}
                strokeWidth="8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="44"
                cx="50"
                cy="50"
                strokeDasharray={`${(score / questions.length) * 276} 276`}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="text-4xl font-bold">{Math.round(finalScore)}%</span>
            </div>
          </div>
        </div>
        <p className="text-2xl font-bold mb-4">{performance}</p>
        <p className="text-gray-600 mb-4">
          You scored {score} out of {questions.length} questions correctly
        </p>
        <p className="text-gray-600 mb-8">
          Time taken: {formatTime(timeSpent)}
        </p>
        <div className="space-y-6">
          {answers.map((answer, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <p className="font-medium mb-2">{answer.question}</p>
              <p className={`text-sm ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                Your answer: {answer.selectedAnswer}
              </p>
              {!answer.isCorrect && (
                <p className="text-sm text-green-600 mt-1">
                  Correct answer: {answer.correctAnswer}
                </p>
              )}
            </div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="mt-8 bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Continue Learning
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <span className="text-sm text-gray-500">Time: {formatTime(timeSpent)}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full w-full mb-8">
        <motion.div
          className="h-2 bg-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <h2 className="text-xl font-medium mb-6">{currentQuestion.question}</h2>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {currentQuestion.options.map((option) => (
            <motion.button
              key={option}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswerSelect(option)}
              disabled={showFeedback}
              className={`w-full p-4 text-left rounded-lg transition-colors ${
                showFeedback
                  ? option === currentQuestion.correctAnswer
                    ? 'bg-green-100 border-2 border-green-500'
                    : option === selectedAnswer
                    ? 'bg-red-100 border-2 border-red-500'
                    : 'bg-gray-50 border-2 border-transparent opacity-50'
                  : selectedAnswer === option
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              {option}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleNext}
        disabled={!selectedAnswer || showFeedback}
        className={`mt-8 w-full py-3 rounded-lg transition-colors font-medium ${
          selectedAnswer && !showFeedback
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {showFeedback
          ? selectedAnswer === currentQuestion.correctAnswer
            ? '✓ Correct! Moving to next question...'
            : '✗ Incorrect! Moving to next question...'
          : currentQuestionIndex + 1 === questions.length
          ? 'Finish Quiz'
          : 'Next Question'}
      </motion.button>
    </motion.div>
  );
};

export default Quiz; 