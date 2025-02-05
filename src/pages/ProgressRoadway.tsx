import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Star, Award } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const ProgressRoadway = () => {
  const navigate = useNavigate();
  const { progress, sections, isLoading } = useUserProgress();

  const totalSquares = 100;
  const squares = Array.from({ length: totalSquares }, (_, i) => i + 1);
  const currentPosition = progress?.last_position || 1;

  const getIcon = (position: number) => {
    if (position === currentPosition) return <Star className="w-6 h-6 text-yellow-400" />;
    if (position % 25 === 0) return <Trophy className="w-6 h-6 text-purple-400" />;
    if (position % 10 === 0) return <Award className="w-6 h-6 text-blue-400" />;
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/75 border-b border-white/10">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-georgia text-2xl font-bold">Progress Roadway</span>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto glass p-6 rounded-lg">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg" />
              <div className="grid grid-cols-10 gap-1 relative z-10">
                {squares.map((square) => {
                  const isCurrentPosition = square === currentPosition;
                  const isCompleted = square < currentPosition;
                  const section = sections?.[Math.floor((square - 1) / 12.5)];

                  return (
                    <motion.div
                      key={square}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: isCurrentPosition ? 1.1 : 1, 
                        opacity: square <= currentPosition + 5 ? 1 : 0.5 
                      }}
                      transition={{ duration: 0.3 }}
                      className={`
                        aspect-square rounded-md flex items-center justify-center text-sm
                        relative overflow-hidden cursor-default
                        ${isCurrentPosition ? "bg-[#1EAEDB] text-white ring-2 ring-white" : ""}
                        ${isCompleted ? "bg-[#1EAEDB]/30" : "bg-white/5"}
                        hover:scale-105 transition-all duration-300
                      `}
                      title={section?.title}
                    >
                      {getIcon(square) || square}
                      {isCurrentPosition && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between glass p-4 rounded-lg">
                <div>
                  <h3 className="font-georgia text-lg">Current Progress</h3>
                  <p className="text-sm text-gray-400">
                    You've completed {currentPosition - 1} steps out of {totalSquares}
                  </p>
                </div>
                <div className="text-3xl font-bold text-[#1EAEDB]">
                  {Math.round((currentPosition / totalSquares) * 100)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProgressRoadway;