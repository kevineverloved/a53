import { supabase } from "@/integrations/supabase/client";

interface UpdateProgressParams {
  newPosition?: number;
  pointsDelta?: number;
  livesChange?: number;
  resetProgress?: boolean;
}

export const updateUserProgress = async ({
  newPosition,
  pointsDelta = 0,
  livesChange = 0,
  resetProgress = false,
}: UpdateProgressParams) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("No authenticated user found!");
    return;
  }
  const userId = user.id;

  // Fetch current progress
  const { data: [progressRecord], error: fetchError } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);
  
  if (fetchError) {
    console.error("Error fetching progress:", fetchError);
    return;
  }

  const currentPoints = progressRecord?.points || 0;
  const currentLives = progressRecord?.lives || 5;
  
  // Calculate new values
  const newPoints = resetProgress ? 0 : currentPoints + pointsDelta;
  const newLives = resetProgress ? 5 : Math.max(0, Math.min(5, currentLives + livesChange));
  
  // If resetting progress, go back to position 1
  const position = resetProgress ? 1 : (newPosition || progressRecord?.last_position);

  // Update the progress record
  const { error: updateError } = await supabase
    .from("user_progress")
    .update({
      last_position: position,
      points: newPoints,
      lives: newLives,
    })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Error updating progress:", updateError);
  }

  return { newPoints, newLives, position };
}; 