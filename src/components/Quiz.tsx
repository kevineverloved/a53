
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

interface QuizProps {
  lessonIds: number[];
  onComplete: (passed: boolean) => void;
  showLives?: boolean;
  lives?: number;
  sectionId: number;
}

const Quiz = ({ lessonIds, onComplete, showLives = false, lives = 5, sectionId }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch quiz progress
  const { data: quizProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["quiz-progress", sectionId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("quiz_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("section_id", sectionId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  // Update quiz progress mutation
  const updateProgress = useMutation({
    mutationFn: async (updates: {
      last_question_index: number;
      completed_questions: number[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("quiz_progress")
        .upsert({
          user_id: user.id,
          section_id: sectionId,
          ...updates,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: questions, isLoading } = useQuery({
    queryKey: ["quiz-questions", lessonIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .in("lesson_id", lessonIds)
        .order("lesson_id");

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (quizProgress && !progressLoading) {
      setCurrentQuestionIndex(quizProgress.last_question_index);
    }
  }, [quizProgress, progressLoading]);

  const currentQuestion = questions?.[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    if (isCorrect) {
      // Save progress
      const completedQuestions = [
        ...(quizProgress?.completed_questions || []),
        currentQuestion.id,
      ];

      await updateProgress.mutateAsync({
        last_question_index: currentQuestionIndex + 1,
        completed_questions: completedQuestions,
      });

      if (currentQuestionIndex === (questions?.length ?? 0) - 1) {
        onComplete(true);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      }
    } else {
      // Reset progress and reduce lives
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      toast({
        title: "Incorrect",
        description: "Try again! You lost a life.",
        variant: "destructive",
      });
      onComplete(false);
    }
  };

  if (isLoading || progressLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  if (!questions || questions.length === 0) {
    return <div>No questions available for these lessons.</div>;
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
            className="w-full justify-start text-left px-4 py-3 min-h-[48px] whitespace-normal break-words"
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
