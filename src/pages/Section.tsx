import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Trophy, ArrowLeft, BookOpen, Timer } from "lucide-react";
import { learningPath } from "@/data/learningPath";
import { Section as SectionType } from "@/types/learning";
import { MAX_HEARTS } from "@/types/learning";
import { supabase } from "@/integrations/supabase/client";

const Section = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState<SectionType | null>(null);
  const [userProgress, setUserProgress] = useState<any>(null);

  useEffect(() => {
    // Find the section from learningPath data
    const foundSection = learningPath.flatMap(level => level.sections).find(s => s.id === Number(sectionId));
    if (foundSection) {
      setSection(foundSection);
    }

    // Fetch user progress
    const fetchUserProgress = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        
        setUserProgress(data);
      }
    };

    fetchUserProgress();
  }, [sectionId]);

  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Section not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/75 border-b border-border"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-syne font-bold">{section.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-syne">{userProgress?.hearts || 0}/{MAX_HEARTS}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-syne">{userProgress?.totalPoints || 0}</span>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass p-6 rounded-xl space-y-6"
          >
            <div>
              <h2 className="text-xl font-syne font-bold">{section.title}</h2>
              <p className="text-gray-400">{section.description}</p>
            </div>

            {section.type === 'study' && section.content && (
              <div className="space-y-8">
                {section.content.sections.map((contentSection, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-lg font-syne font-bold">{contentSection.title}</h3>
                    <p className="text-gray-300">{contentSection.content}</p>
                    {contentSection.image && (
                      <img 
                        src={contentSection.image} 
                        alt={contentSection.title}
                        className="rounded-lg w-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {section.type === 'quiz' && section.quiz && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-orange-500" />
                    <span>{section.quiz.timeLimit} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span>{section.quiz.totalPoints} points</span>
                  </div>
                </div>
                <Button className="w-full" onClick={() => navigate(`/quiz/${section.quiz?.id}`)}>
                  Start Quiz
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Section;
