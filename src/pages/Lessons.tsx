import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import StudyCard from '../components/StudyCard';
import Quiz from '../components/Quiz';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading lessons...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (studyMode && selectedSubsection) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button
              onClick={() => setStudyMode(false)}
              variant="ghost"
              className="flex items-center text-blue-600 hover:text-blue-700"
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {licenseType} License Lessons
          </h1>
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
            {licenseType}
          </span>
        </div>
        
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-3 bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Sections</h2>
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
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    selectedSection === section
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {section}
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="md:col-span-9">
            {selectedSection ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-6">{selectedSection}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(lessonData[selectedSection]).map(([subsectionTitle, lessons]) => (
                    <div key={subsectionTitle} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-xl font-semibold mb-4">{subsectionTitle}</h3>
                      <div className="space-y-4">
                        {lessons.map((lesson, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleStartLesson(lesson)}
                          >
                            <h4 className="font-medium text-lg mb-2">{lesson.title}</h4>
                            <p className="text-gray-600">
                              {lesson.content.length} study cards • {lesson.questions?.length || 0} quiz questions
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h2 className="text-xl text-gray-600">
                  Select a section from the left to begin learning
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lessons;
