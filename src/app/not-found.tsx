import { EmptyState } from "@/components/shared/empty-state";

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="The page you're looking for doesn't exist."
      actionLabel="Go Home"
      actionHref="/"
    />
  );
}
