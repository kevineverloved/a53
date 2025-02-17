
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle2 } from 'lucide-react';

interface LessonCardProps {
  title: string;
  isLocked: boolean;
  isCompleted: boolean;
  onStartLesson: () => void;
  delay: number;
}

const LessonCard = ({ title, isLocked, isCompleted, onStartLesson, delay }: LessonCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className={`glass relative overflow-hidden transition-all duration-300 ${isLocked ? 'opacity-50' : 'hover:scale-[1.02]'}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-syne font-bold">{title}</h3>
            {isLocked ? (
              <Lock className="w-5 h-5 text-gray-400" />
            ) : isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : null}
          </div>
          {!isLocked ? (
            <Button 
              className="w-full mt-4"
              onClick={onStartLesson}
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
};

export default LessonCard;
