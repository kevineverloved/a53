
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, Map } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    getProfile();
    getLeaderboard();
  }, []);

  async function getProfile() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, location')
        .eq('id', session.user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setAvatarUrl(data.avatar_url);
        setLocation(data.location || '');
      }
    } catch (error) {
      toast.error('Error loading profile');
      console.error(error);
    }
  }

  async function getLeaderboard() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email, location, points')
        .order('points', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          location,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Error updating profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', session.user.id);

      if (updateError) throw updateError;
      
      setAvatarUrl(publicUrl);
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Error uploading avatar');
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-syne font-black mb-8">Profile</h1>
        
        <div className="glass p-6 rounded-lg mb-8">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src={avatarUrl || ''} />
              <AvatarFallback>
                {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : '?'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                className="hidden"
                id="avatar-upload"
                disabled={uploading}
              />
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </Button>
            </div>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your location"
                  className="flex-1"
                />
                <Button onClick={() => {
                  if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition((position) => {
                      setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
                    });
                  }
                }}>
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button 
              onClick={updateProfile} 
              disabled={loading}
              className="w-full"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </div>
        </div>

        <div className="glass p-6 rounded-lg">
          <h2 className="text-2xl font-syne font-bold mb-6">Local Leaderboard</h2>
          <div className="space-y-4">
            {leaderboard.map((user, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-syne font-bold">{index + 1}</span>
                  <span className="font-sf-pro">{user.email}</span>
                </div>
                <span className="font-sf-pro font-medium">{user.points} points</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
