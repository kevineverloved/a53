
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Lesson {
  title: string;
  content: Array<{
    title: string;
    front: string;
    back: string;
  }>;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}

export const useLessons = (licenseType: string) => {
  const [lessonData, setLessonData] = useState<Record<string, Record<string, Lesson[]>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLessons();
  }, [licenseType]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: sections, error: sectionsError } = await supabase
        .from('sections')
        .select('*')
        .eq('license_type', licenseType)
        .order('order_number');

      if (sectionsError) {
        console.error('Error fetching sections:', sectionsError);
        toast({
          title: "Error",
          description: "Failed to load sections. Please try again.",
          variant: "destructive"
        });
        throw sectionsError;
      }

      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('license_type', licenseType)
        .order('order_number');

      if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
        toast({
          title: "Error",
          description: "Failed to load lessons. Please try again.",
          variant: "destructive"
        });
        throw lessonsError;
      }

      const organizedData: Record<string, Record<string, Lesson[]>> = {};
      sections.forEach((section, index) => {
        const sectionLessons = lessons?.filter(lesson => lesson.section_id === section.id) || [];
        
        if (!organizedData[section.title]) {
          organizedData[section.title] = {
            'Main': sectionLessons.map(lesson => ({
              title: lesson.title,
              content: Array.isArray(lesson.content) ? lesson.content.map((item: string) => ({
                title: lesson.title,
                front: item,
                back: item
              })) : [{
                title: lesson.title,
                front: lesson.content,
                back: lesson.content
              }],
              questions: []
            }))
          };
        }
      });

      setLessonData(organizedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError('Failed to load lessons. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load lessons. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return { lessonData, loading, error };
};
