
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      if (lesson.image_url) {
        setIsLoading(true);
        setError(null);
        try {
          const { data: { publicUrl } } = supabase
            .storage
            .from('traffic_signs')
            .getPublicUrl(lesson.image_url.replace('/traffic_signs/', ''));
          setImageUrl(publicUrl);
        } catch (error) {
          setError('Failed to load image');
          console.error('Error loading image:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (lesson.title.toLowerCase().includes('introduction') || lesson.title.toLowerCase().includes('traffic light')) {
        // Use traffic light image for the first lesson or lessons about traffic lights
        setImageUrl('/lovable-uploads/950875d7-30e9-49e4-933b-d676b691e3f3.jpg');
      }
    };

    loadImage();
  }, [lesson.image_url, lesson.title]);

  return (
    <>
      <h1 className="text-2xl font-syne">{lesson.title}</h1>
      {imageUrl && (
        <div className="my-4">
          <img
            src={imageUrl}
            alt={lesson.title}
            className="w-full h-auto max-h-[400px] object-contain rounded-lg"
          />
        </div>
      )}
      <p className="text-gray-300 leading-relaxed whitespace-pre-line font-roboto">
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
