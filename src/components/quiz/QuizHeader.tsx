import { Heart } from "lucide-react";

interface QuizHeaderProps {
  lives: number;
  points: number;
  currentQuestionIndex: number;
  totalQuestions: number;
}

const QuizHeader = ({ lives, points, currentQuestionIndex, totalQuestions }: QuizHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Heart
            key={i}
            className={`w-6 h-6 transition-all duration-300 ${
              i < lives ? "text-red-500 scale-100" : "text-gray-400 scale-90"
            }`}
            fill={i < lives ? "currentColor" : "none"}
          />
        ))}
      </div>
      <div className="text-sm">
        Points: {points}
      </div>
      <div className="text-sm">
        Question {currentQuestionIndex + 1} of {totalQuestions}
      </div>
    </div>
  );
};

export default QuizHeader;