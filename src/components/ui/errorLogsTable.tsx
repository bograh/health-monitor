import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "./badge"
import { Skeleton } from "@/components/ui/skeleton"
import type{ ErrorLog } from "@/types/api.types"
import { useQuery } from "@tanstack/react-query"
import { fetchLogs } from "@/utils/requests"

function getLogLevelClass(level: ErrorLog["level"]): string {
  switch (level.toLocaleLowerCase()) {
    case "error":
      return "bg-pink-100 text-pink-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300";
    case "warning":
      return "bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300";
    case "info":
      return "bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300";
    default:
      return "";
  }
}
const API_BASE_URL = 'https://expense-tracking-application.onrender.com';

export function ErrorLogsTable() {
  const { data: logs, isLoading, isError} = useQuery({
    queryKey: ['logs'],
    queryFn: () => fetchLogs(`${API_BASE_URL}/api/error-logs`)
  });

  if(isError){
    return <div>Failed to load logs</div>
  }

  return (
    <div className="w-full max-w-full">
      <h3 className='text-lg font-semibold py-4'>Recent Error Logs</h3>
      <div className="overflow-hidden rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">
                  Date
                </TableHead>  
                <TableHead className="min-w-[80px]">
                  {/* align heading with the badge text */}
                  <div className="px-2.5"> 
                    Level
                  </div>
                </TableHead>  
                <TableHead className="min-w-[200px] max-w-[300px]">
                  Message
                </TableHead>
                <TableHead className="min-w-[150px]">
                  Path
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* create the rows */}
              {!isLoading?logs!.map((log) => (
                  <TableRow key={log.id}>
                      <TableCell className="min-w-[120px] whitespace-nowrap">{log.date}</TableCell>
                      <TableCell className="min-w-[80px]">
                          <Badge className={`rounded-full ${getLogLevelClass(log.level)}`}>{log.level}</Badge>
                       </TableCell>
                      <TableCell className="min-w-[200px] max-w-[300px]">
                        <div className="truncate" title={log.message}>
                          {log.message}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[150px]">
                        {log.request_path}
                      </TableCell>
                  </TableRow>
              )): <TableRowSkeleton />}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export function TableRowSkeleton({rows = 5}: {rows?: number}) {
    return (
        Array.from({ length: rows }).map((_, index) => (
        <TableRow key={'skeleton-row-' + index}>
        <TableCell className="min-w-[120px]">
            <Skeleton className="h-[20px] w-[100px] rounded-full" />
        </TableCell>
        <TableCell className="min-w-[80px]">
            <Skeleton className="h-[20px] w-[60px] rounded-full" />
        </TableCell>
        <TableCell className="min-w-[200px] max-w-[300px]">
            <Skeleton className="h-[20px] w-[250px] rounded-full" />
        </TableCell>
        <TableCell className="min-w-[150px]">
            <Skeleton className="h-[20px] w-[120px] rounded-full" />
        </TableCell>
        </TableRow>
        ))
    )
}
