import { EmptyState } from '@/components/ui/empty-state';
import { FileQuestion } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <EmptyState
        title="Page Not Found"
        description="The page you are looking for doesn't exist or has been moved."
        icon={<FileQuestion className="h-12 w-12" />}
        action={{
          label: "Go to Dashboard",
          href: "/"
        }}
      />
    </div>
  );
}