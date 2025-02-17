import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { useUserProgress } from "@/hooks/useUserProgress";
import {
  Trophy,
  Star,
  Timer,
  BookOpen,
  Award,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Brain,
  Zap,
  Lock,
  ArrowLeft,
  Home,
  User,
  Settings as SettingsIcon,
  BarChart2
} from "lucide-react";

const ProgressCard = ({
  title,
  value,
  icon: Icon,
  color,
  description
}: any) => <motion.div initial={{
  scale: 0.95,
  opacity: 0
}} animate={{
  scale: 1,
  opacity: 1
}} className="glass p-6 rounded-xl space-y-4">
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{
      backgroundColor: `${color}20`
    }}>
        <Icon className="h-6 w-6" style={{
        color
      }} />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold" style={{
        color
      }}>
          {value}
        </p>
      </div>
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
  </motion.div>;

const AchievementBadge = ({
  title,
  icon: Icon,
  color,
  unlocked
}: any) => <motion.div initial={{
  scale: 0.9,
  opacity: 0
}} animate={{
  scale: 1,
  opacity: 1
}} whileHover={{
  scale: 1.05
}} className={`relative p-4 rounded-xl flex flex-col items-center gap-2 ${unlocked ? "glass" : "bg-white/5"}`}>
    <div className={`h-16 w-16 rounded-full flex items-center justify-center ${unlocked ? "bg-gradient-to-br" : "bg-white/10"}`} style={unlocked ? {
    backgroundImage: `linear-gradient(135deg, ${color}, ${color}50)`
  } : {}}>
      <Icon className={`h-8 w-8 ${unlocked ? "text-white" : "text-white/40"}`} />
    </div>
    <p className="text-sm font-medium text-center">{title}</p>
    {!unlocked && <div className="absolute inset-0 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
        <Lock className="h-6 w-6 text-white/40" />
      </div>}
  </motion.div>;

const MilestoneItem = ({
  title,
  date,
  completed
}: any) => <div className="flex items-center gap-4">
    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${completed ? "bg-green-500/20" : "bg-white/10"}`}>
      {completed ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-white/40" />}
    </div>
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{date}</p>
    </div>
  </div>;

const ProgressPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    progress,
    sections,
    achievements
  } = useUserProgress();
  const currentProgress = progress ? ((progress.last_position - 1) / 100) * 100 : 0;

  const stats = [{
    title: "Total Progress",
    value: `${Math.round(currentProgress)}%`,
    icon: TrendingUp,
    color: "#4F46E5",
    description: "Overall completion of all sections"
  }, {
    title: "Study Streak",
    value: "5 Days",
    icon: Zap,
    color: "#EA580C",
    description: "Current learning streak"
  }, {
    title: "Time Spent",
    value: "12h 30m",
    icon: Timer,
    color: "#059669",
    description: "Total time spent learning"
  }, {
    title: "Tests Passed",
    value: "8/10",
    icon: CheckCircle2,
    color: "#0EA5E9",
    description: "Successfully completed tests"
  }];

  const badges = [{
    title: "Quick Learner",
    icon: Brain,
    color: "#4F46E5",
    unlocked: true
  }, {
    title: "Perfect Score",
    icon: Star,
    color: "#EA580C",
    unlocked: true
  }, {
    title: "Road Master",
    icon: Trophy,
    color: "#059669",
    unlocked: false
  }, {
    title: "Expert",
    icon: Award,
    color: "#0EA5E9",
    unlocked: false
  }];

  return <div className="min-h-screen bg-background text-foreground pb-16 md:pb-0">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/75 border-b border-border"
      >
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-syne font-bold">Progress</h1>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div initial={{
          y: 20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          duration: 0.3
        }} className="glass p-6 rounded-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Your Learning Journey</h2>
                <p className="text-muted-foreground">Track your progress and achievements</p>
              </div>
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(currentProgress)}%</span>
              </div>
              <ProgressBar value={currentProgress} className="h-3 bg-white/10" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat, i) => <motion.div key={stat.title} initial={{
            scale: 0.95,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} transition={{
            duration: 0.3,
            delay: i * 0.1
          }}>
                <ProgressCard {...stat} />
              </motion.div>)}
          </div>

          <motion.section initial={{
          y: 20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          duration: 0.3,
          delay: 0.2
        }} className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge, i) => <motion.div key={badge.title} initial={{
              scale: 0.9,
              opacity: 0
            }} animate={{
              scale: 1,
              opacity: 1
            }} transition={{
              duration: 0.3,
              delay: 0.1 * i
            }}>
                  <AchievementBadge {...badge} />
                </motion.div>)}
            </div>
          </motion.section>

          <motion.section initial={{
          y: 20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          duration: 0.3,
          delay: 0.3
        }} className="glass p-6 rounded-xl space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recent Milestones
            </h2>
            <div className="space-y-4">
              <MilestoneItem title="Completed Road Signs Section" date="Today" completed={true} />
              <MilestoneItem title="Achieved Perfect Score" date="Yesterday" completed={true} />
              <MilestoneItem title="Complete Safety Rules" date="Upcoming" completed={false} />
            </div>
          </motion.section>

          <motion.div initial={{
          y: 20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          duration: 0.3,
          delay: 0.4
        }} className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => navigate("/learn")} className="flex-1 bg-primary hover:bg-primary/90">
              <BookOpen className="h-4 w-4 mr-2" />
              Continue Learning
            </Button>
            <Button variant="outline" onClick={() => navigate("/profile")} className="flex-1">
              <Trophy className="h-4 w-4 mr-2" />
              View All Achievements
            </Button>
          </motion.div>
        </div>
      </main>

      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-lg border-t border-border"
      >
        <div className="grid grid-cols-4 h-full">
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center gap-1 h-full rounded-none ${
              location.pathname === "/learn" ? "bg-white/10" : ""
            }`}
            onClick={() => navigate("/learn")}
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-xs">Learn</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center gap-1 h-full rounded-none ${
              location.pathname === "/progress" ? "bg-white/10" : ""
            }`}
            onClick={() => navigate("/progress")}
          >
            <BarChart2 className="h-5 w-5" />
            <span className="text-xs">Progress</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center gap-1 h-full rounded-none ${
              location.pathname === "/profile" ? "bg-white/10" : ""
            }`}
            onClick={() => navigate("/profile")}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center gap-1 h-full rounded-none ${
              location.pathname === "/settings" ? "bg-white/10" : ""
            }`}
            onClick={() => navigate("/settings")}
          >
            <SettingsIcon className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </motion.nav>
    </div>;
};

export default ProgressPage;
