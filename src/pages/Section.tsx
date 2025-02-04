
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, ArrowLeft, ArrowRight, Menu } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Section = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const { progress, updateProgress } = useUserProgress();

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
  const lives = progress?.lives || 5;

  const handleNext = async () => {
    if (!lessons) return;

    if (isLastLesson) {
      await updateProgress.mutateAsync({
        section_id: Number(sectionId),
        lesson_id: currentLesson?.id,
        points: (progress?.points || 0) + 10,
        completed: true,
      });
      navigate("/progress");
    } else {
      setCurrentLessonIndex((prev) => prev + 1);
      await updateProgress.mutateAsync({
        section_id: Number(sectionId),
        lesson_id: currentLesson?.id,
        points: (progress?.points || 0) + 5,
      });
    }
  };

  if (lessonsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/75 border-b border-white/10">
          <div className="container mx-auto flex h-14 items-center px-4">
            <Skeleton className="h-14 w-full" />
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/75 border-b border-white/10">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/learn")}
              className="mr-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="font-georgia text-2xl font-bold">
              Lesson {currentLessonIndex + 1}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 ${
                    i < lives ? "text-red-500 fill-red-500" : "text-gray-500"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Menu className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Section Progress</span>
              <span>
                {currentLessonIndex + 1} / {lessons?.length}
              </span>
            </div>
            <Progress
              value={((currentLessonIndex + 1) / (lessons?.length || 1)) * 100}
              className="bg-white/10"
            />
          </div>

          <div className="glass p-6 rounded-lg space-y-6">
            {currentLesson ? (
              <>
                <h1 className="text-2xl font-georgia">{currentLesson.title}</h1>
                {currentLesson.image_url && (
                  <img
                    src={currentLesson.image_url}
                    alt={currentLesson.title}
                    className="w-full rounded-lg"
                  />
                )}
                <p className="text-gray-300 leading-relaxed">
                  {currentLesson.content}
                </p>
                <div className="flex justify-end">
                  <Button
                    onClick={handleNext}
                    className="w-full sm:w-auto bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
                  >
                    {isLastLesson ? "Complete Section" : "Next Lesson"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </>
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
