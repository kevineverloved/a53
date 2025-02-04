
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Trophy, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Skeleton } from "@/components/ui/skeleton";

const Learn = () => {
  const navigate = useNavigate();
  const { progress, sections, achievements, isLoading } = useUserProgress();

  const currentProgress = progress ? ((progress.last_position - 1) / 100) * 100 : 0;
  const lives = progress?.lives || 5;
  const points = progress?.points || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white p-4">
        <div className="container mx-auto space-y-4">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/75 border-b border-white/10">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <span className="font-georgia text-2xl font-bold">K53</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 ${
                    i < lives ? "text-red-500 fill-red-500" : "text-gray-500"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#1EAEDB]" />
              <span>{points} pts</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(currentProgress)}%</span>
            </div>
            <Progress value={currentProgress} className="bg-white/10" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements?.map((achievement, i) => (
              <div
                key={i}
                className="glass p-4 rounded-lg flex flex-col items-center justify-center gap-2"
              >
                <Star className={`w-8 h-8 ${points >= achievement.points_required ? "text-[#1EAEDB]" : "text-gray-500"}`} />
                <span className="text-sm text-center">{achievement.title}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-georgia">Road Rules</h2>
            <div className="glass p-6 rounded-lg">
              <p className="text-gray-400 mb-6">
                Start your journey to learn road rules. Complete sections to earn points and achievements.
              </p>
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => navigate("/progress")}
                  variant="outline"
                  className="bg-white/5 border-white/10 hover:bg-white/10"
                >
                  View Progress Map
                </Button>
                <Button
                  onClick={() => navigate(`/learn/section/${sections?.[0]?.id}`)}
                  className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
                >
                  Start Learning <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Learn;
