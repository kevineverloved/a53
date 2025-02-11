import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Car, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [licenseType, setLicenseType] = useState<string>("code8");

  const handleSubmit = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ license_type: licenseType })
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Welcome to A53!",
        description: "Your license preference has been saved. Let's start learning!",
      });

      navigate("/learn");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Eish!",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-syne font-bold">Welcome to A53</h1>
          <p className="text-gray-400">Choose your learner's license type to get started</p>
        </div>

        <RadioGroup
          value={licenseType}
          onValueChange={setLicenseType}
          className="grid grid-cols-1 gap-4"
        >
          <Label
            htmlFor="code8"
            className={`glass p-6 rounded-xl cursor-pointer transition-all duration-200 ${
              licenseType === "code8" ? "border-2 border-primary" : "border border-white/10"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Car className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-syne font-bold">Code 8</h3>
                    <p className="text-sm text-gray-400">Light motor vehicles</p>
                  </div>
                  <RadioGroupItem value="code8" id="code8" />
                </div>
              </div>
            </div>
          </Label>

          <Label
            htmlFor="code10"
            className={`glass p-6 rounded-xl cursor-pointer transition-all duration-200 ${
              licenseType === "code10" ? "border-2 border-primary" : "border border-white/10"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-orange-500" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-syne font-bold">Code 10</h3>
                    <p className="text-sm text-gray-400">Heavy motor vehicles</p>
                  </div>
                  <RadioGroupItem value="code10" id="code10" />
                </div>
              </div>
            </div>
          </Label>
        </RadioGroup>

        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleSubmit}
        >
          Get Started
        </Button>
      </motion.div>
    </div>
  );
};

export default Onboarding;
