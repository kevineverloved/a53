import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { updateUserProgress } from "@/utils/updateUserProgress";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface QuizProps {
  question: {
    text: string;
    options: string[];
    correctAnswer: number;
  };
  currentPosition: number;
  onNext: () => void;
  lives: number;
}

const Quiz = ({ question, currentPosition, onNext, lives }: QuizProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnimatingHeart, setIsAnimatingHeart] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = async (answerIndex: number) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      setSelectedAnswer(answerIndex);
      
      if (answerIndex === question.correctAnswer) {
        // Correct answer: award points and proceed
        await updateUserProgress({
          newPosition: currentPosition + 1,
          pointsDelta: 50, // Award 50 points for correct answer
        });
        toast({
          title: "Correct! 🎉",
          description: "+50 points",
          className: "bg-green-500",
        });
        onNext();
      } else {
        // Wrong answer: lose a life
        setIsAnimatingHeart(true);
        
        const { newLives } = await updateUserProgress({
          livesChange: -1,
        });

        // Wait for heart animation
        setTimeout(() => {
          setIsAnimatingHeart(false);
          
          if (newLives <= 0) {
            setShowResetDialog(true);
          } else {
            toast({
              title: "Incorrect",
              description: `${newLives} ${newLives === 1 ? 'life' : 'lives'} remaining`,
              variant: "destructive",
            });
          }
        }, 500);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    await updateUserProgress({
      resetProgress: true,
    });
    window.location.href = '/learn'; // Full refresh to reset state
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-georgia">Quiz</h2>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Heart
              key={i}
              className={`w-5 h-5 transition-all duration-300 
                ${i < lives ? "text-red-500 fill-red-500" : "text-gray-500"}
                ${isAnimatingHeart && i === lives - 1 ? "scale-150 opacity-0" : ""}
              `}
            />
          ))}
        </div>
      </div>

      <div className="glass p-6 rounded-lg">
        <p className="text-lg mb-4">{question.text}</p>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              className={`w-full justify-start text-left p-4 h-auto ${
                selectedAnswer === index
                  ? index === question.correctAnswer
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

      <AlertDialog open={showResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Out of Lives</AlertDialogTitle>
            <AlertDialogDescription>
              Don't worry! Learning takes time and practice. Let's start from the beginning
              of this section to help reinforce the concepts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleReset}>
              Start Over
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Quiz; 