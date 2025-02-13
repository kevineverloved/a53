import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bell,
  Moon,
  Sun,
  Volume2,
  Languages,
  Shield,
  LogOut,
  ChevronRight,
  Smartphone,
  Mail,
  Eye,
  Clock,
  Vibrate,
  BookOpen,
  AlertTriangle,
  HelpCircle,
  Trash2,
  User,
  ArrowLeft,
  Car
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SettingsSectionProps {
  title: string;
  icon: any;
  children: React.ReactNode;
}

const SettingsSection = ({ title, icon: Icon, children }: SettingsSectionProps) => {
  return (
    <Card className="glass">
      <CardHeader className="flex flex-row items-center space-y-0 gap-2">
        <Icon className="h-5 w-5" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [theme, setTheme] = useState("dark");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [volume, setVolume] = useState(80);
  const [language, setLanguage] = useState("english");
  const [autoPlay, setAutoPlay] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const [selectedLicense, setSelectedLicense] = useState("code_8");

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Cheers! See you soon!",
        description: "You've been signed out successfully. Come back soon, hey!",
        variant: "default",
      });
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Eish!",
        description: "There was a problem signing out. Please try again.",
      });
    }
  };

  const handleDeleteAccount = async () => {
    toast({
      variant: "destructive",
      title: "Delete Account",
      description: "This feature is not yet implemented.",
    });
  };

  const handleLicenseChange = async (newLicense: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error: progressError } = await supabase
        .from("user_progress")
        .upsert({
          user_id: user.id,
          license_type: newLicense,
          last_position: 1,
          points: 0
        })
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ license_type: newLicense })
        .eq('id', user.id);

      if (profileError) throw profileError;

      setSelectedLicense(newLicense);
      toast({
        title: "License Updated",
        description: "Your learning content has been updated.",
      });
    } catch (error) {
      console.error("Error updating license:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update license type. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
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
          <h1 className="text-2xl font-syne font-bold">Settings</h1>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* License Type */}
          <SettingsSection title="License Type" icon={Car}>
            <div className="space-y-6">
              <div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium leading-none mb-2">
                    Select Your License
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Choose which driver's license you want to learn
                  </p>
                </div>
                <Select
                  value={selectedLicense}
                  onValueChange={handleLicenseChange}
                >
                  <SelectTrigger className="w-full md:w-[280px]">
                    <SelectValue placeholder="Select a license type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="code_8">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        <span>Code 8 (Light Motor Vehicle)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="code_10">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        <span>Code 10 (Heavy Motor Vehicle)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="code_14">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        <span>Code 14 (Extra Heavy Motor Vehicle)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SettingsSection>

          {/* Appearance */}
          <SettingsSection title="Appearance" icon={Eye}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="flex items-center gap-1">
                    <Sun className="h-4 w-4" /> Light
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="flex items-center gap-1">
                    <Moon className="h-4 w-4" /> Dark
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Language</Label>
                <p className="text-sm text-muted-foreground">Select your preferred language</p>
              </div>
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent border-none focus:outline-none"
                >
                  <option value="english">English</option>
                  <option value="afrikaans">Afrikaans</option>
                  <option value="zulu">isiZulu</option>
                  <option value="xhosa">isiXhosa</option>
                </select>
              </div>
            </div>
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection title="Notifications" icon={Bell}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates about your progress</p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                disabled={!notificationsEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates on your device</p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
                disabled={!notificationsEnabled}
              />
            </div>
          </SettingsSection>

          {/* Sound & Feedback */}
          <SettingsSection title="Sound & Feedback" icon={Volume2}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Sound Effects</Label>
                <p className="text-sm text-muted-foreground">Play sounds during interactions</p>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Volume</Label>
                <span className="text-sm text-muted-foreground">{volume}%</span>
              </div>
              <Slider
                value={[volume]}
                onValueChange={([value]) => setVolume(value)}
                disabled={!soundEnabled}
                max={100}
                step={1}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Vibration</Label>
                <p className="text-sm text-muted-foreground">Enable haptic feedback</p>
              </div>
              <Switch
                checked={vibrationEnabled}
                onCheckedChange={setVibrationEnabled}
              />
            </div>
          </SettingsSection>

          {/* Learning Preferences */}
          <SettingsSection title="Learning Preferences" icon={BookOpen}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto-play Lessons</Label>
                <p className="text-sm text-muted-foreground">Automatically advance to next lesson</p>
              </div>
              <Switch
                checked={autoPlay}
                onCheckedChange={setAutoPlay}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Show Timer</Label>
                <p className="text-sm text-muted-foreground">Display time spent on lessons</p>
              </div>
              <Switch
                checked={showTimer}
                onCheckedChange={setShowTimer}
              />
            </div>
          </SettingsSection>

          {/* Account & Security */}
          <SettingsSection title="Account & Security" icon={Shield}>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => navigate("/profile")}
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Edit Profile</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => navigate("/help")}
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>Help & Support</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full text-orange-500 hover:text-orange-600 hover:bg-orange-500/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>

            <Button
              variant="outline"
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </SettingsSection>
        </div>
      </main>
    </div>
  );
};

export default Settings;
