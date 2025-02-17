
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUserProgress = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["user-progress"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: userProgress, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch progress",
          variant: "destructive",
        });
        throw error;
      }

      if (!userProgress) {
        // If no progress exists, create initial progress
        const { data: newProgress, error: createError } = await supabase
          .from("user_progress")
          .upsert({
            user_id: user.id,
            lives: 5,
            points: 0,
            last_position: 1,
            completed: false
          })
          .select()
          .single();

        if (createError) {
          toast({
            title: "Error",
            description: "Failed to create initial progress",
            variant: "destructive",
          });
          throw createError;
        }

        return newProgress;
      }

      return userProgress;
    },
  });

  const { data: sections, isLoading: sectionsLoading } = useQuery({
    queryKey: ["sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sections")
        .select("*")
        .order("order_number");

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch sections",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("points_required");

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch achievements",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  const updateProgress = useMutation({
    mutationFn: async (updates: {
      lives?: number;
      points?: number;
      last_position?: number;
      completed?: boolean;
      section_id?: number;
      lesson_id?: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("user_progress")
        .upsert(
          {
            user_id: user.id,
            ...updates,
          },
          { onConflict: "user_id" }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-progress"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    },
  });

  return {
    progress,
    sections,
    achievements,
    isLoading: progressLoading || sectionsLoading || achievementsLoading,
    updateProgress,
  };
};
