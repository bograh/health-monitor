import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "./badge"
import { useEffect, useState } from "react"
import { fetchJSONData } from "@/utils/requests"
import { Skeleton } from "@/components/ui/skeleton"

 

export type ErrorLog = {
  id: string
  timestamp: string
  date: string
  time_since: string
  request_path: string
  level: "Error" | "Warning" | "Info"
  message: string
}

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
  const [data, setData] = useState<ErrorLog[]>([]);
  const [ready, setReady] = useState(false);
  
  // Fetch error logs from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchJSONData<ErrorLog[]>(`${API_BASE_URL}/api/error-logs`);
        setData(result);
        setReady(true);
      } catch (error) {
        console.error("Error fetching error logs:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      <h3 className='text-lg font-semibold py-4'>Recent Error Logs</h3>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Date
              </TableHead>  
              <TableHead>
                Level
              </TableHead>  
              <TableHead>
                Message
              </TableHead>
              <TableHead>
                Path
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* create the rows */}
            {ready?data.map((log) => (
                <TableRow key={log.id}>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>
                        <Badge className={`rounded-full ${getLogLevelClass(log.level)}`}>{log.level}</Badge>
                     </TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>{log.request_path}</TableCell>
                </TableRow>
            )): <TableRowSkeleton />}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export function TableRowSkeleton({rows = 5}: {rows?: number}) {
    return (
        Array.from({ length: rows }).map((_, index) => (
        <TableRow key={'skeleton-row-' + index}>
        <TableCell>
            <Skeleton className="h-[20px] w-[100px] rounded-full" />
        </TableCell>
        <TableCell>
            <Skeleton className="h-[20px] w-[100px] rounded-full" />
        </TableCell>
        <TableCell>
            <Skeleton className="h-[20px] w-[100px] rounded-full" />
        </TableCell>
        <TableCell>
            <Skeleton className="h-[20px] w-[100px] rounded-full" />
        </TableCell>
        </TableRow>
        ))
    )
}
