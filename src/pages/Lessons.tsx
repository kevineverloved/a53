
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLessons } from '@/hooks/useLessons';
import { useUserProgress } from '@/hooks/useUserProgress';
import LessonsHeader from '@/components/lessons/LessonsHeader';
import LessonsNavigation from '@/components/lessons/LessonsNavigation';
import LessonCard from '@/components/lessons/LessonCard';
import StudyMode from '@/components/lessons/StudyMode';
import type { Lesson } from '@/hooks/useLessons';

const Lessons = () => {
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section');
  const licenseType = localStorage.getItem('selectedLicense') || 'Class C';
  const { progress } = useUserProgress();
  const { lessonData, loading, error } = useLessons(licenseType);

  const [selectedSection, setSelectedSection] = useState<string | null>(section);
  const [selectedSubsection, setSelectedSubsection] = useState<Lesson | null>(null);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

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
      <StudyMode
        selectedSubsection={selectedSubsection}
        currentCardIndex={currentCardIndex}
        showQuiz={showQuiz}
        onBack={() => setStudyMode(false)}
        onNextCard={handleNextCard}
        onQuizComplete={handleQuizComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LessonsHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(lessonData).map(([sectionTitle, lessons], index) => {
            const isLocked = index > 0 && !progress?.completed;
            return (
              <LessonCard
                key={sectionTitle}
                title={sectionTitle}
                isLocked={isLocked}
                isCompleted={progress?.completed || false}
                onStartLesson={() => setSelectedSection(sectionTitle)}
                delay={index * 0.1}
              />
            );
          })}
        </div>
      </div>

      <LessonsNavigation />
    </div>
  );
};

export default Lessons;
