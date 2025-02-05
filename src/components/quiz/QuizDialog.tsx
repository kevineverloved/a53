import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface QuizDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  finalScore: number;
}

const QuizDialog = ({ isOpen, onClose, onRestart, finalScore }: QuizDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="glass">
        <AlertDialogHeader>
          <AlertDialogTitle>Quiz Complete!</AlertDialogTitle>
          <AlertDialogDescription>
            You've run out of lives! Your final score is {finalScore} points.
            Would you like to try again?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onRestart}>
            Try Again
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuizDialog;