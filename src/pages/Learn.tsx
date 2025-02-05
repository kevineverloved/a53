import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Menu, Car, Map, SignpostBig, Shield, Truck, Container, Scale, Navigation, User, Settings, Info, Mail, Sun, Moon, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Learn = () => {
  const navigate = useNavigate();
  const { progress, sections, achievements, isLoading } = useUserProgress();
  const isMobile = useIsMobile();
  const [licenseType, setLicenseType] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    }
    return 'dark'
  });

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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const currentProgress = progress ? ((progress.last_position - 1) / 100) * 100 : 0;

  const getSubjects = () => {
    if (licenseType === 'code10') {
      return [
        { 
          title: "Truck Navigation", 
          icon: Navigation, 
          color: "#8B5CF6", 
          gradient: "linear-gradient(225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)" 
        },
        { 
          title: "Load Management", 
          icon: Container, 
          color: "#D946EF", 
          gradient: "linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)" 
        },
        { 
          title: "Traffic Signs for Trucks", 
          icon: SignpostBig, 
          color: "#F97316", 
          gradient: "linear-gradient(to right, #ee9ca7, #ffdde1)" 
        },
        { 
          title: "Heavy Vehicle Safety", 
          icon: Truck, 
          color: "#0EA5E9", 
          gradient: "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)" 
        }
      ];
    }
    
    return [
      { 
        title: "Road Rules", 
        icon: Map, 
        color: "#8B5CF6", 
        gradient: "linear-gradient(225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)" 
      },
      { 
        title: "Car Rules", 
        icon: Car, 
        color: "#D946EF", 
        gradient: "linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)" 
      },
      { 
        title: "Traffic Sign Rules", 
        icon: SignpostBig, 
        color: "#F97316", 
        gradient: "linear-gradient(to right, #ee9ca7, #ffdde1)" 
      },
      { 
        title: "Safety Rules", 
        icon: Shield, 
        color: "#0EA5E9", 
        gradient: "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)" 
      }
    ];
  };

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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/75 border-b border-border">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <h1 className="font-syne text-2xl font-black">A53</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate("/onboarding")}
            >
              Choose License
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-background border border-border">
                <DropdownMenuLabel className="font-syne">Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Profile</span>
                  </div>
                  <span className="text-xs text-muted-foreground">View and edit your profile settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="font-medium">Settings</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Customize your app preferences</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span className="font-medium">About</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Learn more about A53</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">Contact Us</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Get in touch with our support team</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">Premium Access</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Skip ads for only R20/month</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center justify-between py-3 cursor-pointer" onClick={toggleTheme}>
                  <div className="flex items-center gap-2">
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <h2 className="text-2xl font-syne font-black">
              {licenseType === 'code10' ? 'Truck Driving Rules' : 'Road Rules'}
            </h2>
            <div className="glass p-6 rounded-lg">
              <p className="text-gray-400 mb-6">
                {licenseType === 'code10' 
                  ? 'Start your journey to learn professional truck driving rules. Complete sections to earn points and achievements.'
                  : 'Start your journey to learn road rules. Complete sections to earn points and achievements.'}
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
                  Start Learning {licenseType === 'code10' ? <Truck className="ml-2 w-4 h-4" /> : <Map className="ml-2 w-4 h-4" />}
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
