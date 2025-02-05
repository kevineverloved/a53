
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Info, Menu, Car, Map, SignpostBig, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Learn = () => {
  const navigate = useNavigate();
  const { progress, sections, achievements, isLoading } = useUserProgress();
  const isMobile = useIsMobile();
  const [licenseType, setLicenseType] = useState<string | null>(null);

  useEffect(() => {
    const fetchLicenseType = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("license_type")
          .eq("id", session.user.id)
          .single();
        
        setLicenseType(profile?.license_type || null);
      }
    };
    
    fetchLicenseType();
  }, []);

  const currentProgress = progress ? ((progress.last_position - 1) / 100) * 100 : 0;

  const subjects = [
    { title: "Road Rules", icon: Map, color: "#8B5CF6", gradient: "linear-gradient(225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)" },
    { title: "Car Rules", icon: Car, color: "#D946EF", gradient: "linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)" },
    { title: "Traffic Sign Rules", icon: SignpostBig, color: "#F97316", gradient: "linear-gradient(to right, #ee9ca7, #ffdde1)" },
    { title: "Safety Rules", icon: Shield, color: "#0EA5E9", gradient: "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)" }
  ];

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
          <span className="font-georgia text-2xl font-bold font-black">A53</span>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate("/onboarding")}
            >
              <Info className="w-5 h-5" />
              {licenseType ? `Learning ${licenseType === "code8" ? "Code 8" : "Code 10"}` : "Choose License"}
            </Button>
            <Menu className="w-5 h-5 text-white" />
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
            {subjects.map((subject, i) => {
              const Icon = subject.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                  onClick={() => navigate(`/learn/section/${i + 1}`)}
                  style={{
                    background: subject.gradient,
                    backgroundClip: "padding-box"
                  }}
                >
                  <Icon className="w-8 h-8" style={{ color: subject.color }} />
                  <span className="text-sm text-center font-bold text-gray-800">{subject.title}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-georgia font-black">Road Rules</h2>
            <div className="glass p-6 rounded-lg">
              <p className="text-gray-400 mb-6">
                Start your journey to learn road rules. Complete sections to earn points and achievements.
              </p>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button
                  onClick={() => navigate("/progress")}
                  variant="outline"
                  className="w-full sm:w-auto bg-white/5 border-white/10 hover:bg-white/10"
                >
                  View Progress Map
                </Button>
                <Button
                  onClick={() => navigate(`/learn/section/${sections?.[0]?.id}`)}
                  className="w-full sm:w-auto bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
                >
                  Start Learning <Map className="ml-2 w-4 h-4" />
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
