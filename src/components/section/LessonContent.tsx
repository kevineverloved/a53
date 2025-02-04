import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      if (lesson.image_url) {
        try {
          // Extract just the filename from the full URL path
          const filename = lesson.image_url.split('/traffic_signs/')[1];
          if (filename) {
            const { data: { publicUrl } } = supabase
              .storage
              .from('traffic_signs')
              .getPublicUrl(filename);
            
            setImageUrl(publicUrl);
          }
        } catch (error) {
          console.error('Error loading image:', error);
        }
      }
    };

    loadImage();
  }, [lesson.image_url]);

  return (
    <>
      <h1 className="text-2xl font-georgia">{lesson.title}</h1>
      {imageUrl && (
        <div className="my-4">
          <img
            src={imageUrl}
            alt={lesson.title}
            className="w-full h-auto max-h-[400px] object-contain rounded-lg"
          />
        </div>
      )}
      <p className="text-gray-300 leading-relaxed whitespace-pre-line">
        {lesson.content}
      </p>
      <div className="flex justify-end mt-6">
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