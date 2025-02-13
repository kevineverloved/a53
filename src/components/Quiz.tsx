
import React, { useState } from 'react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export interface QuizProps {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  onComplete: () => void;
  lives?: number;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete, lives = 5 }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = () => {
    if (!selectedAnswer) return;

    if (selectedAnswer === currentQuestion.correctAnswer) {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        onComplete();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-lg">
        <p className="text-lg mb-4">{currentQuestion?.question}</p>
        <div className="space-y-3">
          {currentQuestion?.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => setSelectedAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`w-full justify-start text-left p-4 h-auto ${
                selectedAnswer === option
                  ? option === currentQuestion.correctAnswer
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleAnswer}
        disabled={!selectedAnswer}
        className="w-full"
      >
        {currentQuestionIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
      </Button>
    </div>
  );
};

export default Quiz;
