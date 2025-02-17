
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const LessonsNavigation = () => {
  return (
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
      </div>
    </motion.nav>
  );
};

export default LessonsNavigation;
