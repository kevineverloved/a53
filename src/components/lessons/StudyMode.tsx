
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import StudyCard from '@/components/StudyCard';
import Quiz from '@/components/Quiz';
import { Lesson } from '@/hooks/useLessons';

interface StudyModeProps {
  selectedSubsection: Lesson;
  currentCardIndex: number;
  showQuiz: boolean;
  onBack: () => void;
  onNextCard: () => void;
  onQuizComplete: () => void;
}

const StudyMode = ({
  selectedSubsection,
  currentCardIndex,
  showQuiz,
  onBack,
  onNextCard,
  onQuizComplete
}: StudyModeProps) => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button onClick={onBack} variant="ghost" className="flex items-center text-primary hover:text-primary/90">
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
              onNext={onNextCard}
            />
          ) : (
            <Quiz
              key="quiz"
              questions={selectedSubsection.questions}
              onComplete={onQuizComplete}
              lives={5}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudyMode;
