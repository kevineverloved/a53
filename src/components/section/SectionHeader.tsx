
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
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/75 border-b border-border">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <span className="font-syne text-xl font-bold">
            Lesson {currentLessonIndex + 1}
          </span>
          <span className="text-sm text-muted-foreground">
            {subject}
          </span>
        </div>
      </div>
    </header>
  );
};

export default SectionHeader;
