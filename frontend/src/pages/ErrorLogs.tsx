import React from 'react';
import { ErrorStats } from '@/components/ui/errorStats';
import { ErrorLogsTable } from '@/components/ui/errorLogsTable';

export function ErrorLogsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Error Logs</h1>
      <ErrorStats />
      <ErrorLogsTable />
    </div>
  );
}
