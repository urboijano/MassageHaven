
import { cn } from "@/lib/utils"

interface PageLoadingProps extends React.HTMLAttributes<HTMLDivElement> {}

const PageLoading = ({ className, ...props }: PageLoadingProps) => {
  return (
    <div className={cn("fixed inset-0 bg-background flex items-center justify-center z-50", className)} {...props}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoading;
