
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface LessonContentProps {
  lesson: {
    title: string;
    content: string;
    image_url?: string;
  };
  shouldShowQuiz: boolean;
  onNext: () => void;
}

const LessonContent = ({ lesson, shouldShowQuiz, onNext }: LessonContentProps) => {
  return (
    <>
      <h1 className="text-2xl font-georgia">{lesson.title}</h1>
      {lesson.image_url && (
        <img
          src={lesson.image_url}
          alt={lesson.title}
          className="w-full rounded-lg"
        />
      )}
      <p className="text-gray-300 leading-relaxed whitespace-pre-line">
        {lesson.content}
      </p>
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          className="w-full sm:w-auto bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
        >
          {shouldShowQuiz ? "Take Quiz" : "Next Lesson"}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </>
  );
};

export default LessonContent;
