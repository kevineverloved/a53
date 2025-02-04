
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Progress = () => {
  const [currentPosition, setCurrentPosition] = useState(1);
  const totalSquares = 100;
  const squares = Array.from({ length: totalSquares }, (_, i) => i + 1);

  const navigate = useNavigate();

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
        <div className="max-w-4xl mx-auto glass p-6 rounded-lg">
          <div className="grid grid-cols-10 gap-1">
            {squares.map((square) => {
              const isCurrentPosition = square === currentPosition;
              const isCompleted = square < currentPosition;

              return (
                <div
                  key={square}
                  className={`
                    aspect-square rounded-md flex items-center justify-center text-sm
                    ${isCurrentPosition ? "bg-[#1EAEDB] text-white" : ""}
                    ${isCompleted ? "bg-[#1EAEDB]/30" : "bg-white/5"}
                    ${(square <= 10 || isCurrentPosition) ? "" : "opacity-50"}
                  `}
                >
                  {square}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Progress;
