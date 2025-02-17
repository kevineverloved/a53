
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import StudyCard from '../components/StudyCard';
import Quiz from '../components/Quiz';
import { Button } from '../components/ui/button';
import { ArrowLeft, Heart, Trophy, BookOpen, Lock, CheckCircle2 } from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useUserProgress } from '@/hooks/useUserProgress';

interface Lesson {
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

const Lessons = () => {
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section');
  const lessonId = searchParams.get('lesson');
  const { toast } = useToast();
  const [selectedSection, setSelectedSection] = useState<string | null>(section);
  const [selectedSubsection, setSelectedSubsection] = useState<Lesson | null>(null);
  const [lessonData, setLessonData] = useState<Record<string, Record<string, Lesson[]>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const navigate = useNavigate();
  const { progress } = useUserProgress();
  const licenseType = localStorage.getItem('selectedLicense') || 'Class C';

  const handleNextCard = () => {
    if (currentCardIndex + 1 < (selectedSubsection?.content.length ?? 0)) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = () => {
    setStudyMode(false);
    setSelectedSubsection(null);
    setCurrentCardIndex(0);
    setShowQuiz(false);
  };

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedSubsection(lesson);
    setStudyMode(true);
    setCurrentCardIndex(0);
    setShowQuiz(false);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl text-foreground/60">Loading lessons...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl text-destructive">{error}</div>
      </div>
    );
  }

  if (studyMode && selectedSubsection) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button onClick={() => setStudyMode(false)} variant="ghost" className="flex items-center text-primary hover:text-primary/90">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Lessons
            </Button>
          </div>
          <AnimatePresence mode="wait">
            {!showQuiz ? (
              <StudyCard
                key="study-card"
                content={selectedSubsection.content[currentCardIndex]}
                currentIndex={currentCardIndex}
                totalCards={selectedSubsection.content.length}
                onNext={handleNextCard}
              />
            ) : (
              <Quiz
                key="quiz"
                questions={selectedSubsection.questions}
                onComplete={handleQuizComplete}
                lives={5}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/75 border-b border-border"
      >
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-syne font-bold">Learn</h1>
          <div className="flex items-center gap-3 ml-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 glass px-3 py-1.5 rounded-full"
            >
              <Heart className="w-4 h-4 text-red-500" />
              <span className="font-syne text-sm">5</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 glass px-3 py-1.5 rounded-full"
            >
              <Trophy className="w-4 h-4 text-primary" />
              <span className="font-syne text-sm">0</span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(lessonData).map(([sectionTitle, lessons], index) => {
            const isLocked = index > 0 && !progress?.completed;
            return (
              <motion.div
                key={sectionTitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`glass relative overflow-hidden transition-all duration-300 ${isLocked ? 'opacity-50' : 'hover:scale-[1.02]'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-syne font-bold">{sectionTitle}</h3>
                      {isLocked ? (
                        <Lock className="w-5 h-5 text-gray-400" />
                      ) : progress?.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : null}
                    </div>
                    {!isLocked ? (
                      <Button 
                        className="w-full mt-4"
                        onClick={() => setSelectedSection(sectionTitle)}
                      >
                        Start Learning
                      </Button>
                    ) : (
                      <div className="text-sm text-gray-400 mt-4">
                        Complete previous section to unlock
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-lg border-t border-border"
      >
        <div className="grid grid-cols-4 h-full">
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center gap-1 h-full rounded-none bg-white/10"
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-xs">Learn</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center gap-1 h-full rounded-none bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-xs">Back</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center gap-1 h-full rounded-none bg-white/10"
          >
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-xs">5</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center gap-1 h-full rounded-none bg-white/10"
          >
            <Trophy className="w-5 h-4 text-primary" />
            <span className="text-xs">0</span>
          </Button>
        </div>
      </motion.nav>
    </div>
  );
};

export default Lessons;
