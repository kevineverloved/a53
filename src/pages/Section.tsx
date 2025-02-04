
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useUserProgress } from "@/hooks/useUserProgress";
import { supabase } from "@/integrations/supabase/client";
import Quiz from "@/components/Quiz";
import SectionHeader from "@/components/section/SectionHeader";
import ProgressBar from "@/components/section/ProgressBar";
import LessonContent from "@/components/section/LessonContent";
import LoadingSkeleton from "@/components/section/LoadingSkeleton";

const LESSONS_PER_QUIZ = 3;

export const Section = () => {
  const { sectionId } = useParams();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const { progress, updateProgress } = useUserProgress();

  const { data: section, isLoading: sectionLoading } = useQuery({
    queryKey: ["section", sectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sections")
        .select("*")
        .eq("id", Number(sectionId))
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["lessons", sectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("section_id", Number(sectionId))
        .order("order_number");

      if (error) throw error;
      return data;
    },
  });

  const currentLesson = lessons?.[currentLessonIndex];
  const isLastLesson = currentLessonIndex === (lessons?.length ?? 0) - 1;
  const shouldShowQuiz = 
    (currentLessonIndex + 1) % LESSONS_PER_QUIZ === 0 || 
    isLastLesson;

  const getQuizLessonIds = () => {
    if (!lessons) return [];
    const startIndex = Math.floor(currentLessonIndex / LESSONS_PER_QUIZ) * LESSONS_PER_QUIZ;
    const endIndex = Math.min(startIndex + LESSONS_PER_QUIZ, currentLessonIndex + 1);
    return lessons.slice(startIndex, endIndex).map(lesson => lesson.id);
  };

  const handleNext = () => {
    if (!lessons) return;
    
    if (shouldShowQuiz) {
      setShowQuiz(true);
    } else {
      setCurrentLessonIndex((prev) => prev + 1);
    }
  };

  const handleQuizComplete = async (passed: boolean) => {
    if (!lessons || !currentLesson) return;

    if (passed) {
      await updateProgress.mutateAsync({
        section_id: Number(sectionId),
        lesson_id: currentLesson?.id,
        points: (progress?.points || 0) + 15,
      });

      if (isLastLesson) {
        await updateProgress.mutateAsync({
          section_id: Number(sectionId),
          completed: true,
        });
      } else {
        setCurrentLessonIndex((prev) => prev + 1);
      }
      setShowQuiz(false);
    } else {
      await updateProgress.mutateAsync({
        lives: Math.max(0, (progress?.lives || 5) - 1),
      });
    }
  };

  if (lessonsLoading || sectionLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <SectionHeader 
        currentLessonIndex={currentLessonIndex}
        subject={section?.subject}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <ProgressBar 
            currentIndex={currentLessonIndex}
            total={lessons?.length || 0}
          />

          <div className="glass p-6 rounded-lg space-y-6">
            {showQuiz ? (
              <Quiz
                lessonIds={getQuizLessonIds()}
                onComplete={handleQuizComplete}
                showLives={true}
                lives={progress?.lives}
                sectionId={Number(sectionId)}
              />
            ) : currentLesson ? (
              <LessonContent
                lesson={currentLesson}
                shouldShowQuiz={shouldShowQuiz}
                onNext={handleNext}
              />
            ) : (
              <p>No lessons found for this section.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Section;
