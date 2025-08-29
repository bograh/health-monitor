import { ErrorStats } from "@/components/ui/errorStats";
import { ErrorLogsTable } from "@/components/ui/errorLogsTable";

export function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <ErrorStats />
      <ErrorLogsTable />
    </div>
  );
}
