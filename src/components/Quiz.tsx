import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";
import QuizQuestion from "./quiz/QuizQuestion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [showIncorrectDialog, setShowIncorrectDialog] = useState(false);
  const [localLives, setLocalLives] = useState(lives);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
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
      // Award points for correct answer
      const { error: progressError } = await supabase
        .from("user_progress")
        .update({ points: lives * 10 }) // More points for maintaining more lives
        .eq("section_id", sectionId);

      if (!progressError) {
        toast({
          title: "Correct!",
          description: `You earned ${lives * 10} points!`,
          variant: "default",
        });
      }

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
      setIsHeartAnimating(true);
      setTimeout(() => {
        setIsHeartAnimating(false);
        setLocalLives((prev) => prev - 1);
      }, 300);

      if (localLives <= 1) {
        setShowIncorrectDialog(true);
        onComplete(false);
      } else {
        toast({
          title: "Incorrect Answer",
          description: "Try again! You can do this!",
          variant: "destructive",
        });
      }
    }
  };

  const handleDialogClose = () => {
    setShowIncorrectDialog(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setLocalLives(5); // Reset lives when starting over
  };

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  if (!questions || questions.length === 0) {
    return <div>No questions available for these lessons.</div>;
  }

  return (
    <>
      <Dialog open={showIncorrectDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Time for a Fresh Start!</DialogTitle>
            <DialogDescription>
              Don't worry! Learning takes time and practice. Let's go back to the lesson and try again with a fresh perspective. You've got this! 💪
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDialogClose} className="w-full">
              Return to Lesson
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {showLives && (
          <div className="flex items-center gap-1 justify-end">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-all duration-300 ${
                  i < localLives 
                    ? `text-red-500 fill-red-500 ${
                        isHeartAnimating && i === localLives - 1
                          ? "scale-150 opacity-0"
                          : ""
                      }`
                    : "text-gray-500"
                }`}
              />
            ))}
          </div>
        )}
        
        <div className="text-sm text-gray-400">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        
        <QuizQuestion
          questionIndex={currentQuestionIndex}
          question={currentQuestion?.question || ""}
          imageUrl={currentQuestion?.image_url}
        />
        
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
    </>
  );
};

export default Quiz;
