import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function UpdateQuestions() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/updateQuestions', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update questions');
      }

      toast({
        title: "Success!",
        description: `Updated ${data.count} questions successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update questions",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">Update Quiz Questions</h1>
        <p className="text-center text-muted-foreground">
          This will replace all existing questions with the new set of road rules questions.
        </p>
        <Button 
          onClick={handleUpdate} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Updating..." : "Update Questions"}
        </Button>
      </div>
    </div>
  );
} 