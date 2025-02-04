
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentIndex: number;
  total: number;
}

const ProgressBar = ({ currentIndex, total }: ProgressBarProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Section Progress</span>
        <span>
          {currentIndex + 1} / {total}
        </span>
      </div>
      <Progress
        value={((currentIndex + 1) / total) * 100}
        className="bg-white/10"
      />
    </div>
  );
};

export default ProgressBar;
