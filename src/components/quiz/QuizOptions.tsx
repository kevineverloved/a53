import { Button } from "@/components/ui/button";

interface QuizOptionsProps {
  options: string[];
  onSelectAnswer: (answer: string) => void;
  isAnswered: boolean;
  selectedAnswer?: string;
  correctAnswer: string;
}

const QuizOptions = ({ options, onSelectAnswer, isAnswered, selectedAnswer, correctAnswer }: QuizOptionsProps) => {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <Button
          key={option}
          onClick={() => !isAnswered && onSelectAnswer(option)}
          className={`w-full justify-start text-left ${
            isAnswered
              ? option === correctAnswer
                ? "bg-green-500 hover:bg-green-600"
                : option === selectedAnswer
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-500 hover:bg-gray-600"
              : ""
          }`}
          disabled={isAnswered}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default QuizOptions;