"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { exportUserData } from "@/lib/actions/data-export";
import { toast } from "sonner";

export function DataExportButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleExport() {
    setIsLoading(true);
    try {
      const result = await exportUserData();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (!result.data) {
        toast.error("No data to export");
        return;
      }

      // Trigger download
      const blob = new Blob([result.data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hiringlens-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Your data has been downloaded");
    } catch {
      toast.error("Failed to export data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button onClick={handleExport} disabled={isLoading} variant="outline">
      {isLoading ? "Preparing..." : "Download My Data"}
    </Button>
  );
}
