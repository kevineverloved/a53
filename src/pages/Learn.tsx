import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Menu, Car, Map, SignpostBig, Shield, Truck, Container, Scale, Navigation, User, Settings, Info, Mail, CreditCard, ArrowRight, Heart, Trophy, Star, Timer, BookOpen, Award, Target, TrendingUp, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImageWithSkeleton } from "@/components/ui/image-skeleton";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { learningPath, achievements } from "@/data/learningPath";
import { Level, UserProgress } from "@/types/learning";
import { TOTAL_AVAILABLE_POINTS, MAX_HEARTS } from "@/types/learning";

interface Subject {
  title: string;
  icon: any;
  color: string;
  gradient: string;
  description: string;
  bgImage: string;
  backgroundImage?: string;
}

const Learn = () => {
  const navigate = useNavigate();
  const { progress, sections, achievements: userAchievements, isLoading } = useUserProgress();
  const isMobile = useIsMobile();
  const [licenseType, setLicenseType] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        setProfile(profileData);
        setLicenseType(profileData?.license_type || null);

        // Fetch user progress
        const { data: progressData } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (progressData) {
          setUserProgress({
            ...progressData,
            hearts: progressData.lives || MAX_HEARTS,
            totalPoints: progressData.points || 0,
            currentLevel: 1,
            completedSections: [],
            achievements: [],
            quizScores: {},
            streakDays: 0,
            lastActive: progressData.updated_at || new Date().toISOString()
          });
        }
      }
    };
    
    fetchUserData();
  }, []);

  const currentProgress = progress ? ((progress.last_position - 1) / 100) * 100 : 0;

  const getSubjects = (): Subject[] => {
    if (licenseType === 'code10') {
      return [
        { 
          title: "Truck Navigation", 
          icon: Navigation, 
          color: "#8B5CF6", 
          gradient: "linear-gradient(225deg, rgba(0, 0, 0, 0.5), rgba(139, 92, 246, 0.35))",
          description: "Master the roads like a pro truckie! Learn all about routes and navigation.",
          bgImage: "/truck-navigation.jpg",
          backgroundImage: "url('/truck-navigation.jpg')"
        },
        { 
          title: "Load Management", 
          icon: Container, 
          color: "#D946EF", 
          gradient: "linear-gradient(225deg, rgba(0, 0, 0, 0.5), rgba(217, 70, 239, 0.35))",
          description: "Keep your cargo lekker safe! Learn proper loading techniques.",
          bgImage: "/load-management.jpg",
          backgroundImage: "url('/load-management.jpg')"
        },
        { 
          title: "Traffic Signs for Trucks", 
          icon: SignpostBig, 
          color: "#F97316", 
          gradient: "linear-gradient(225deg, rgba(0, 0, 0, 0.5), rgba(249, 115, 22, 0.35))",
          description: "Know your signs, boet! Essential truck signage guide.",
          bgImage: "/truck-signs.jpg",
          backgroundImage: "url('/truck-signs.jpg')"
        },
        { 
          title: "Heavy Vehicle Safety", 
          icon: Truck, 
          color: "#0EA5E9", 
          gradient: "linear-gradient(225deg, rgba(0, 0, 0, 0.5), rgba(14, 165, 233, 0.35))",
          description: "Stay safe on our roads! Master truck safety protocols.",
          bgImage: "/truck-safety.jpg",
          backgroundImage: "url('/truck-safety.jpg')"
        }
      ];
    }
    
    return [
      { 
        title: "Road Rules", 
        icon: Map, 
        color: "#8B5CF6", 
        gradient: "linear-gradient(225deg, rgba(0, 0, 0, 0.5), rgba(139, 92, 246, 0.35))",
        description: "Get clued up on the rules of the road, my friend!",
        bgImage: "/road-rules.jpg",
        backgroundImage: "url('/road-rules.jpg')"
      },
      { 
        title: "Car Rules", 
        icon: Car, 
        color: "#D946EF", 
        gradient: "linear-gradient(225deg, rgba(0, 0, 0, 0.5), rgba(217, 70, 239, 0.35))",
        description: "Drive like a pro! Master vehicle control basics.",
        bgImage: "/car-rules.jpg",
        backgroundImage: "url('/car-rules.jpg')"
      },
      { 
        title: "Traffic Sign Rules", 
        icon: SignpostBig, 
        color: "#F97316", 
        gradient: "linear-gradient(225deg, rgba(0, 0, 0, 0.5), rgba(249, 115, 22, 0.35))",
        description: "Know your signs, it's important, né?",
        bgImage: "/traffic-signs.jpg",
        backgroundImage: "url('/traffic-signs.jpg')"
      },
      { 
        title: "Safety Rules", 
        icon: Shield, 
        color: "#0EA5E9", 
        gradient: "linear-gradient(225deg, rgba(0, 0, 0, 0.5), rgba(14, 165, 233, 0.35))",
        description: "Keep it safe on the roads, always!",
        bgImage: "/safety-rules.jpg",
        backgroundImage: "url('/safety-rules.jpg')"
      }
    ];
  };

  const getLastLesson = () => {
    if (!sections || !progress) return null;
    const currentSectionIndex = Math.floor((progress.last_position - 1) / 12.5);
    return sections[currentSectionIndex];
  };

  const LevelCard = ({ level }: { level: Level }) => {
    const isLocked = !level.isUnlocked;
    const completedSections = level.sections.filter(s => s.isCompleted).length;
    const totalSections = level.sections.length;
    const progress = (completedSections / totalSections) * 100;

    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={!isLocked ? { scale: 1.02 } : {}}
        className={`relative p-6 rounded-xl border ${
          isLocked ? 'border-white/10 bg-white/5' : 'border-primary/20 bg-white/10'
        } space-y-4 cursor-pointer`}
        onClick={() => !isLocked && navigate(`/learn/level/${level.id}`)}
      >
        {isLocked && (
          <div className="absolute inset-0 backdrop-blur-sm rounded-xl flex items-center justify-center bg-black/40">
            <div className="flex flex-col items-center gap-2">
              <Lock className="w-8 h-8 text-white/60" />
              <p className="text-sm text-white/60">
                Requires {level.requiredPoints} points to unlock
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h3 className="text-xl font-syne font-bold">{level.title}</h3>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm">{level.totalPoints} points</span>
          </div>
        </div>

        <p className="text-sm text-gray-300">{level.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{completedSections}/{totalSections} sections</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </motion.div>
    );
  };

  const AchievementBadge = ({ achievement }: { achievement: typeof achievements[0] }) => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5"
    >
      <div className="text-4xl">{achievement.icon}</div>
      <h4 className="font-syne font-bold text-center">{achievement.title}</h4>
      <p className="text-xs text-center text-gray-300">{achievement.description}</p>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
        <div className="container mx-auto space-y-4">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  const subjects = getSubjects();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground pb-16 md:pb-0">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/75 border-b border-border"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-syne font-bold">A53 Learner's</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-syne">{userProgress?.hearts || 0}/{MAX_HEARTS}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-syne">{userProgress?.totalPoints || 0}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
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
          </div>
        </div>
      </motion.header>

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
            {subjects.map((subject, i) => {
              const Icon = subject.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative p-6 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer overflow-hidden group min-h-[160px]"
                  onClick={() => navigate(`/learn/section/${i + 1}`)}
                  style={{
                    backgroundImage: subject.backgroundImage,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div 
                    className="absolute inset-0 transition-all duration-300"
                    style={{
                      background: subject.gradient,
                    }}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                    <Icon className="w-8 h-8" style={{ color: subject.color }} />
                    <span className="text-sm font-bold text-white">{subject.title}</span>
                    <p className="text-xs text-white/80 line-clamp-2">{subject.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-syne font-black">
              {licenseType === 'code10' ? 'Truck Driving Rules' : 'Road Rules'}
            </h2>
          </div>

          {/* Learning Path */}
          <div className="space-y-6">
            <h3 className="text-xl font-syne font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Learning Path
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningPath.map((level) => (
                <LevelCard key={level.id} level={level} />
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-6">
            <h3 className="text-xl font-syne font-bold flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {achievements.map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>

          {/* Study Tips */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass p-6 rounded-xl space-y-4"
          >
            <h3 className="text-xl font-syne font-bold flex items-center gap-2">
              <Target className="w-5 h-5" />
              Study Tips
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Complete levels in order for the best learning experience
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Review incorrect answers after each quiz
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Take practice quizzes multiple times to improve
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Focus on understanding rather than memorization
              </li>
            </ul>
          </motion.div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-lg border-t border-border"
      >
        <div className="grid grid-cols-4 h-full">
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center gap-1 h-full rounded-none"
            onClick={() => navigate("/learn")}
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-xs">Learn</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center gap-1 h-full rounded-none"
            onClick={() => navigate("/progress")}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs">Progress</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center gap-1 h-full rounded-none"
            onClick={() => navigate("/profile")}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center gap-1 h-full rounded-none"
            onClick={() => navigate("/settings")}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </motion.nav>
    </div>
  );
};

export default Learn;
