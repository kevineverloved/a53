
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Skeleton } from "@/components/ui/skeleton";

const Progress = () => {
  const navigate = useNavigate();
  const { progress, sections, isLoading, updateProgress } = useUserProgress();

  const totalSquares = 100;
  const squares = Array.from({ length: totalSquares }, (_, i) => i + 1);
  const currentPosition = progress?.last_position || 1;

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/75 border-b border-white/10">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/learn")}
            className="mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-georgia text-2xl font-bold">Progress Map</span>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto glass p-6 rounded-lg">
            <div className="grid grid-cols-10 gap-1">
              {squares.map((square) => {
                const isCurrentPosition = square === currentPosition;
                const isCompleted = square < currentPosition;
                const section = sections?.[Math.floor((square - 1) / 12.5)];

                return (
                  <div
                    key={square}
                    className={`
                      aspect-square rounded-md flex items-center justify-center text-sm
                      transition-all duration-300 cursor-default
                      ${isCurrentPosition ? "bg-[#1EAEDB] text-white scale-110" : ""}
                      ${isCompleted ? "bg-[#1EAEDB]/30" : "bg-white/5"}
                      ${square <= currentPosition + 5 ? "" : "opacity-50"}
                    `}
                    title={section?.title}
                  >
                    {square}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Progress;
