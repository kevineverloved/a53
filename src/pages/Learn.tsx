
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LessonsNavigation from '@/components/lessons/LessonsNavigation';

const Learn = () => {
  const navigate = useNavigate();
  const { progress } = useUserProgress();
  const { toast } = useToast();
  const [userProgress, setUserProgress] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('sections')
          .select('*')
          .order('order_number');

        if (sectionsError) throw sectionsError;

        setSections(sectionsData || []);
        
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: progressData } = await supabase
            .from("user_progress")
            .select("*")
            .eq("user_id", session.user.id)
            .single();
            
          setUserProgress(progressData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load content. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl text-foreground/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/75 border-b border-border"
      >
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-syne font-bold">Learn</h1>
          <div className="flex items-center gap-3 ml-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 glass px-3 py-1.5 rounded-full"
            >
              <Heart className="w-4 h-4 text-red-500" />
              <span className="font-syne text-sm">{userProgress?.lives || 5}</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 glass px-3 py-1.5 rounded-full"
            >
              <Trophy className="w-4 h-4 text-primary" />
              <span className="font-syne text-sm">{userProgress?.points || 0}</span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`glass relative overflow-hidden transition-all duration-300 hover:scale-[1.02]`}
                onClick={() => navigate('/lessons')}
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-syne font-bold mb-2">{section.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{section.description}</p>
                  <Button className="w-full">Start Learning</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <LessonsNavigation />
    </div>
  );
};

export default Learn;
