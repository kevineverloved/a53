import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Car, Truck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLicenseChoice = async (licenseType: "code8" | "code10") => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please sign in to continue",
        });
        navigate("/");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ 
          license_type: licenseType,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: `You've chosen to learn for a ${licenseType === "code8" ? "Code 8" : "Code 10"} license.`,
      });
      
      navigate("/learn");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto glass">
          <CardHeader>
            <CardTitle className="font-georgia text-2xl text-center">Choose Your License Type</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Select the type of license you want to learn for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button
                variant="outline"
                size="lg"
                className="h-40 flex flex-col items-center justify-center space-y-4 hover:bg-white/10"
                onClick={() => handleLicenseChoice("code8")}
                disabled={isLoading}
              >
                <Car className="w-16 h-16" />
                <div className="text-center">
                  <h3 className="font-bold text-lg">Code 8</h3>
                  <p className="text-sm text-gray-400">Light motor vehicles</p>
                </div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-40 flex flex-col items-center justify-center space-y-4 hover:bg-white/10"
                onClick={() => handleLicenseChoice("code10")}
                disabled={isLoading}
              >
                <Truck className="w-16 h-16" />
                <div className="text-center">
                  <h3 className="font-bold text-lg">Code 10</h3>
                  <p className="text-sm text-gray-400">Heavy motor vehicles</p>
                </div>
              </Button>
            </div>

            <p className="text-center text-sm text-gray-400 mt-6">
              You can change your choice later in your profile settings
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Onboarding;