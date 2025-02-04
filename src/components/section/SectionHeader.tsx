
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SectionHeaderProps {
  currentLessonIndex: number;
  subject?: string;
}

const SectionHeader = ({ currentLessonIndex, subject }: SectionHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/75 border-b border-white/10">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/learn")}
            className="mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <span className="font-georgia text-2xl font-bold">
              Lesson {currentLessonIndex + 1}
            </span>
            <span className="text-sm text-gray-400">
              Subject: {subject}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SectionHeader;
