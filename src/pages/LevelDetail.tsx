import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Trophy, ArrowLeft, BookOpen, Timer, CheckCircle2 } from "lucide-react";
import { learningPath } from "@/data/learningPath";
import { Level, Section } from "@/types/learning";
import { MAX_HEARTS } from "@/types/learning";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, Settings, Info, TrendingUp } from "lucide-react";

const LevelDetail = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const [level, setLevel] = useState<Level | null>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);

  useEffect(() => {
    // Find the level from learningPath data
    const foundLevel = learningPath.find(l => l.id === Number(levelId));
    if (foundLevel) {
      setLevel(foundLevel);
    }

    // Fetch user progress
    const fetchUserProgress = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        
        setUserProgress(data);
      }
    };

    fetchUserProgress();
  }, [levelId]);

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Level not found</p>
      </div>
    );
  }

  const completedSections = level.sections.filter(s => s.isCompleted).length;
  const progress = (completedSections / level.sections.length) * 100;

  const SectionCard = ({ section }: { section: Section }) => (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className="glass p-6 rounded-xl space-y-4 cursor-pointer hover:bg-white/10 transition-all duration-200"
      onClick={() => navigate(`/learn/section/${section.id}`)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {section.type === 'study' ? (
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Timer className="h-5 w-5 text-orange-500" />
            </div>
          )}
          <div>
            <h4 className="font-syne font-bold">{section.title}</h4>
            <p className="text-sm text-gray-400">{section.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm">{section.points}</span>
          </div>
          {section.isCompleted && (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/75 border-b border-border"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/progress")}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Progress
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/help")}>
                  <Info className="mr-2 h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/learn")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-syne font-bold">{level.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-syne">{userProgress?.hearts || 0}/{MAX_HEARTS}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-syne">{userProgress?.totalPoints || 0}</span>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Level Progress */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass p-6 rounded-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-syne font-bold">{level.title}</h2>
                <p className="text-gray-400">{level.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="font-syne">{level.totalPoints} points available</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{completedSections}/{level.sections.length} sections completed</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </motion.div>

          {/* Sections */}
          <div className="space-y-4">
            {level.sections.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LevelDetail; 