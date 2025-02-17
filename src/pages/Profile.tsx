
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Heart, Star, Timer, TrendingUp, Award, Target, BookOpen, ArrowLeft, Home, Settings as SettingsIcon, User } from "lucide-react";
import { MAX_HEARTS } from "@/types/learning";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }

        const [profileResponse, progressResponse] = await Promise.all([
          supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single(),
          supabase
            .from("user_progress")
            .select("*")
            .eq("user_id", session.user.id)
            .single()
        ]);

        setProfile(profileResponse.data);
        setUserProgress(progressResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground pb-16 md:pb-0">
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
          <h1 className="text-2xl font-syne font-bold">Profile</h1>
        </div>
      </motion.header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Profile Info */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass p-6 rounded-xl space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {profile?.full_name?.[0] || "U"}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-syne font-bold">{profile?.full_name || "User"}</h2>
                <p className="text-sm text-gray-400">{profile?.email}</p>
                <p className="text-sm text-primary">{profile?.license_type === 'code10' ? 'Code 10 Learner' : 'Code 8 Learner'}</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass p-4 rounded-xl space-y-2"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <h3 className="font-syne font-bold">Points</h3>
              </div>
              <p className="text-2xl font-bold">{userProgress?.points || 0}</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass p-4 rounded-xl space-y-2"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <h3 className="font-syne font-bold">Lives</h3>
              </div>
              <p className="text-2xl font-bold">{userProgress?.lives || 0}/{MAX_HEARTS}</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass p-4 rounded-xl space-y-2"
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <h3 className="font-syne font-bold">Achievements</h3>
              </div>
              <p className="text-2xl font-bold">{userProgress?.achievements?.length || 0}</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass p-4 rounded-xl space-y-2"
            >
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-blue-500" />
                <h3 className="font-syne font-bold">Study Time</h3>
              </div>
              <p className="text-2xl font-bold">{userProgress?.study_time || 0}h</p>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass p-6 rounded-xl space-y-4"
          >
            <h3 className="text-xl font-syne font-bold">Recent Activity</h3>
            <div className="space-y-4">
              {userProgress?.recent_activity?.map((activity: any, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {activity.type === 'quiz' ? (
                      <Target className="w-5 h-5 text-primary" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-syne font-bold">{activity.title}</p>
                    <p className="text-sm text-gray-400">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
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
            onClick={() => navigate("/")}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center gap-1 h-full rounded-none bg-white/10"
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center gap-1 h-full rounded-none"
            onClick={() => navigate("/settings")}
          >
            <SettingsIcon className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </motion.nav>
    </div>
  );
};

export default Profile;
