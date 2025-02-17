
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LessonsHeader = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default LessonsHeader;
