import { EmptyState } from "@/components/shared/empty-state";

export default function CompanyNotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <EmptyState
        title="Company not found"
        description="We couldn't find this company. It may not have any reviews yet."
        actionLabel="Share an Experience"
        actionHref="/submit"
      />
    </div>
  );
}
