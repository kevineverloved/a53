
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

interface QuizProps {
  lessonId: number;
  onComplete: (passed: boolean) => void;
  showLives?: boolean;
  lives?: number;
}

const Quiz = ({ lessonId, onComplete, showLives = false, lives = 5 }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: questions, isLoading } = useQuery({
    queryKey: ["quiz-questions", lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("lesson_id", lessonId);

      if (error) throw error;
      return data;
    },
  });

  const currentQuestion = questions?.[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    if (isCorrect) {
      toast({
        title: "Correct!",
        description: "Great job! Let's move on.",
      });

      if (currentQuestionIndex === (questions?.length ?? 0) - 1) {
        onComplete(true);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      }
    } else {
      toast({
        title: "Incorrect",
        description: "Try again!",
        variant: "destructive",
      });
      onComplete(false);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  if (!questions || questions.length === 0) {
    return <div>No questions available for this lesson.</div>;
  }

  return (
    <div className="space-y-6">
      {showLives && (
        <div className="flex items-center gap-1 justify-end">
          {[...Array(5)].map((_, i) => (
            <Heart
              key={i}
              className={`w-5 h-5 ${
                i < (lives || 0) ? "text-red-500 fill-red-500" : "text-gray-500"
              }`}
            />
          ))}
        </div>
      )}
      
      <div className="text-sm text-gray-400">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>
      
      <h2 className="text-xl font-georgia">{currentQuestion?.question}</h2>
      
      <div className="space-y-3">
        {currentQuestion?.options.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswer === option ? "default" : "outline"}
            className="w-full justify-start text-left"
            onClick={() => handleAnswerSelect(option)}
          >
            {option}
          </Button>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!selectedAnswer}
        className="w-full bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
      >
        Submit Answer
      </Button>
    </div>
  );
};

export default Quiz;
