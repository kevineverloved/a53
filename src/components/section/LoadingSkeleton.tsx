
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/75 border-b border-white/10">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Skeleton className="h-14 w-full" />
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </main>
    </div>
  );
};

export default LoadingSkeleton;
