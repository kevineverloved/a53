import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import StudyCard from '../components/StudyCard';
import Quiz from '../components/Quiz';
import { Button } from '../components/ui/button';
import { ArrowLeft, Heart, Trophy, BookOpen } from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

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

interface Section {
  id: number;
  title: string;
  content_type: string | null;
  description: string | null;
  license_type: string | null;
  order_number: number;
  subject: string | null;
}

const Lessons = () => {
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section');
  const lessonId = searchParams.get('lesson');
  
  const [selectedSection, setSelectedSection] = useState<string | null>(section);
  const [selectedSubsection, setSelectedSubsection] = useState<Lesson | null>(null);
  const [lessonData, setLessonData] = useState<Record<string, Record<string, Lesson[]>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const navigate = useNavigate();

  const licenseType = localStorage.getItem('selectedLicense') || 'Class C';

  useEffect(() => {
    fetchLessons();
  }, [licenseType]);

  useEffect(() => {
    if (section === 'vehicle-controls' && lessonId === 'intro-controls' && lessonData['Vehicle Controls']) {
      const introLesson = Object.values(lessonData['Vehicle Controls'])[0]?.[0];
      if (introLesson) {
        setSelectedSection('Vehicle Controls');
        handleStartLesson(introLesson);
      }
    }
  }, [section, lessonId, lessonData]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      
      // First, let's add our vehicle controls content
      const vehicleControlsContent = {
        'Vehicle Controls': {
          'Basic Controls': [
            {
              title: 'Introduction to Vehicle Controls',
              content: [
                {
                  title: 'Steering Wheel',
                  front: 'What is the primary function of the steering wheel?',
                  back: 'The steering wheel controls the direction of the vehicle. It should be held at the 9 and 3 o\'clock positions for optimal control and airbag safety.'
                },
                {
                  title: 'Pedals',
                  front: 'What are the three main pedals in a manual transmission vehicle?',
                  back: 'From left to right: Clutch (manual only), Brake, and Accelerator (Gas pedal). In automatic vehicles, there are only two pedals: Brake and Accelerator.'
                },
                {
                  title: 'Gear Shift',
                  front: 'What is the purpose of the gear shift?',
                  back: 'The gear shift allows you to change the vehicle\'s gears, controlling power delivery to the wheels. In automatic vehicles, common positions are: P (Park), R (Reverse), N (Neutral), D (Drive).'
                }
              ],
              questions: [
                {
                  question: 'What is the recommended hand position on the steering wheel?',
                  options: ['10 and 2 o\'clock', '9 and 3 o\'clock', '8 and 4 o\'clock', '7 and 5 o\'clock'],
                  correctAnswer: '9 and 3 o\'clock'
                },
                {
                  question: 'In an automatic transmission vehicle, which pedal is on the right?',
                  options: ['Brake pedal', 'Clutch pedal', 'Accelerator pedal', 'Emergency brake'],
                  correctAnswer: 'Accelerator pedal'
                }
              ]
            }
          ]
        }
      };

      // Now fetch sections from Supabase
      const { data: sections, error: sectionsError } = await supabase
        .from('sections')
        .select('*')
        .eq('license_type', licenseType)
        .order('order_number');

      if (sectionsError) throw sectionsError;

      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('license_type', licenseType)
        .order('order_number');

      if (lessonsError) throw lessonsError;

      // Organize the data
      const organizedData = sections.reduce((acc: Record<string, Record<string, Lesson[]>>, section: Section) => {
        if (!acc[section.title]) {
          acc[section.title] = {};
        }
        
        const sectionLessons = lessons?.filter(
          lesson => lesson.section_id === section.id
        ) || [];

        if (sectionLessons.length > 0) {
          acc[section.title]['Main'] = sectionLessons.map(lesson => ({
            title: lesson.title,
            content: Array.isArray(lesson.content) 
              ? lesson.content.map((item: string) => ({
                  title: lesson.title,
                  front: item,
                  back: item
                }))
              : [{ 
                  title: lesson.title,
                  front: lesson.content,
                  back: lesson.content 
                }],
            questions: []
          }));
        }

        return acc;
      }, vehicleControlsContent);

      setLessonData(organizedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError('Failed to load lessons. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedSubsection(lesson);
    setStudyMode(true);
    setCurrentCardIndex(0);
    setShowQuiz(false);
  };

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
            <Button
              onClick={() => setStudyMode(false)}
              variant="ghost"
              className="flex items-center text-primary hover:text-primary/90"
            >
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
        className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/75 border-b border-white/10"
      >
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-syne font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent leading-tight">
              {licenseType} License
            </h1>
            <p className="text-sm text-muted-foreground leading-tight">
              Learn at your own pace
            </p>
          </div>
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
        <div className="grid md:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-3"
          >
            <Card className="glass">
              <CardContent className="p-4">
                <h2 className="text-xl font-syne font-bold mb-4">Sections</h2>
                <nav className="space-y-2">
                  {Object.keys(lessonData).map((section) => (
                    <motion.button
                      key={section}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedSection(section);
                        setSelectedSubsection(null);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                        selectedSection === section
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {section}
                    </motion.button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-9"
          >
            {selectedSection ? (
              <Card className="glass">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-syne font-bold mb-6 text-gradient">{selectedSection}</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(lessonData[selectedSection]).map(([subsectionTitle, lessons]) => (
                      <div key={subsectionTitle} className="glass rounded-lg p-4">
                        <h3 className="text-xl font-syne font-bold mb-4">{subsectionTitle}</h3>
                        <div className="space-y-4">
                          {lessons.map((lesson, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="glass hover:bg-white/10 rounded-lg p-4 cursor-pointer transition-colors"
                              onClick={() => handleStartLesson(lesson)}
                            >
                              <h4 className="font-syne font-medium text-lg mb-2">{lesson.title}</h4>
                              <p className="text-sm text-foreground/60">
                                {lesson.content.length} study cards • {lesson.questions?.length || 0} quiz questions
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-primary/60" />
                  <h2 className="text-xl font-syne">
                    Select a section from the left to begin learning
                  </h2>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Lessons;
