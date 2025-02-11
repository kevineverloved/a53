
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bike, Car, Truck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<string>("");

  const licenses = [
    { code: "code1", name: "Code 1 - Motorcycles" },
    { code: "codeA1", name: "Code A1 - Light motorcycle" },
    { code: "codeA", name: "Code A - Motorcycle" },
    { code: "codeB", name: "Code B - Light motor vehicle" },
    { code: "codeC1", name: "Code C1 - Light heavy motor vehicle" },
    { code: "codeC", name: "Code C - Heavy motor vehicle" },
    { code: "codeEC1", name: "Code EC1 - Extra heavy articulated" },
    { code: "codeEC", name: "Code EC - Extra heavy combination" }
  ];

  const handleLicenseChoice = async (licenseType: string) => {
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
        description: `You've chosen to learn for a ${licenses.find(l => l.code === licenseType)?.name}.`,
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
            <Select
              onValueChange={(value) => {
                setSelectedLicense(value);
                handleLicenseChoice(value);
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a license type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Motorcycle Licenses</SelectLabel>
                  {licenses.slice(0, 3).map((license) => (
                    <SelectItem key={license.code} value={license.code}>
                      {license.name}
                    </SelectItem>
                  ))}
                  <SelectLabel>Motor Vehicle Licenses</SelectLabel>
                  {licenses.slice(3).map((license) => (
                    <SelectItem key={license.code} value={license.code}>
                      {license.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

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
