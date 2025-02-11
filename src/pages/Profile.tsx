import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Car,
  Medal,
  Clock,
  Calendar,
  BookOpen,
  Trophy,
  Star,
  Award,
  Timer,
  AlertCircle,
  CheckCircle2,
  BadgeCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: any;
  progress: number;
  color: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 1,
      title: "Quick Learner",
      description: "Complete 5 lessons in one day",
      icon: Clock,
      progress: 60,
      color: "#4F46E5"
    },
    {
      id: 2,
      title: "Perfect Score",
      description: "Score 100% in any test",
      icon: Star,
      progress: 40,
      color: "#9333EA"
    },
    {
      id: 3,
      title: "Road Master",
      description: "Complete all road rules sections",
      icon: Car,
      progress: 75,
      color: "#EA580C"
    }
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(data);
      }
    };
    
    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/75 border-b border-border"
      >
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Button variant="ghost" onClick={() => navigate("/learn")}>
            Back to Learn
          </Button>
          <h1 className="text-heading-1">Profile</h1>
          <div className="w-[70px]" /> {/* Spacer for alignment */}
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="glass p-6 rounded-xl space-y-6"
          >
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-2">{profile.full_name || "Learner Driver"}</h2>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Car className="h-4 w-4" />
                    <span>{profile.license_type || "Code 8"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Learning Progress */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Lessons Completed</h3>
                  <p className="text-2xl font-bold text-blue-500">24</p>
                </div>
              </div>
              <Progress value={60} className="bg-blue-500/10" />
            </div>

            <div className="glass p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Test Scores</h3>
                  <p className="text-2xl font-bold text-purple-500">85%</p>
                </div>
              </div>
              <Progress value={85} className="bg-purple-500/10" />
            </div>

            <div className="glass p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Timer className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Study Time</h3>
                  <p className="text-2xl font-bold text-orange-500">12h</p>
                </div>
              </div>
              <Progress value={40} className="bg-orange-500/10" />
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="glass p-6 rounded-xl space-y-6"
          >
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Completed Road Signs Test</p>
                  <p className="text-sm text-muted-foreground">Score: 90% • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Started Traffic Rules Section</p>
                  <p className="text-sm text-muted-foreground">Progress: 20% • 5 hours ago</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Medal className="h-5 w-5" />
              Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="glass p-6 rounded-xl space-y-4"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="h-12 w-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${achievement.color}20` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: achievement.color }} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                    <Progress value={achievement.progress} className="bg-white/10" />
                    <p className="text-sm text-right text-muted-foreground">{achievement.progress}%</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
