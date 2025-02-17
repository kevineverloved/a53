import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
interface StudyCardContent {
  title: string;
  front: string;
  back: string;
}
interface StudyCardProps {
  content: StudyCardContent;
  currentIndex: number;
  totalCards: number;
  onNext: () => void;
}
const StudyCard: React.FC<StudyCardProps> = ({
  content,
  currentIndex,
  totalCards,
  onNext
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Card {currentIndex + 1} of {totalCards}
        </span>
        <div className="h-2 bg-gray-200 rounded-full flex-grow mx-4">
          <motion.div className="h-2 bg-blue-500 rounded-full" initial={{
          width: 0
        }} animate={{
          width: `${(currentIndex + 1) / totalCards * 100}%`
        }} transition={{
          duration: 0.3
        }} />
        </div>
      </div>

      <motion.div className="bg-white rounded-xl shadow-lg p-8 cursor-pointer min-h-[400px]" onClick={() => setIsFlipped(!isFlipped)} initial={false} animate={{
      rotateY: isFlipped ? 180 : 0
    }} transition={{
      duration: 0.6,
      type: 'spring'
    }}>
        <div className={`${isFlipped ? 'rotate-y-180' : ''} transform`}>
          {!isFlipped ? <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{content.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{content.front}</p>
              
            </div> : <div className="space-y-4 rotate-y-180">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Answer</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{content.back}</p>
              <p className="text-sm text-blue-600 mt-4">Click to see question</p>
            </div>}
        </div>
      </motion.div>

      <div className="mt-8 flex justify-between items-center">
        <Button onClick={e => {
        e.stopPropagation();
        setIsFlipped(!isFlipped);
      }} variant="outline">
          {isFlipped ? 'Show Question' : 'Show Answer'}
        </Button>
        {currentIndex + 1 < totalCards ? <Button onClick={onNext}>Next Card</Button> : <Button onClick={onNext} variant="default">Start Quiz</Button>}
      </div>
    </div>;
};
export default StudyCard;