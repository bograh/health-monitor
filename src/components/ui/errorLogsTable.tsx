import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "./badge"

 // Dummy data for error logs
            const data: ErrorLog[] = [
                {
                    id: "1",
                    timestamp: "2024-06-01 10:15:23",
                    level: "Error",
                    path: "/database/connection",
                    message: "Failed to connect to database.",
                },
                {
                    id: "2",
                    timestamp: "2024-06-01 10:17:45",
                    level: "Warning",
                    path: "/api/response",
                    message: "API response time is slow.",
                },
                {
                    id: "3",
                    timestamp: "2024-06-01 10:20:10",
                    level: "Info",
                    path: "/user/login",
                    message: "User admin logged in.",
                },
                {
                    id: "4",
                    timestamp: "2024-06-01 10:22:05",
                    level: "Error",
                    path: "/payment/module",
                    message: "Unhandled exception in payment module.",
                },
                {
                    id: "5",
                    timestamp: "2024-06-01 10:25:30",
                    level: "Warning",
                    path: "/storage",
                    message: "Disk space running low.",
                },
            ]

export type ErrorLog = {
  id: string
  timestamp: string
  path: string
  level: "Error" | "Warning" | "Info"
  message: string
}

function getLogLevelClass(level: ErrorLog["level"]): string {
  switch (level) {
    case "Error":
      return "bg-pink-100 text-pink-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300";
    case "Warning":
      return "bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300";
    case "Info":
      return "bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300";
    default:
      return "";
  }
}

export function ErrorLogsTable() {
  return (
    <div className="w-full">
      <h3 className='text-lg font-semibold py-4'>Recent Error Logs</h3>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Timestamp
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
            {data.map((log) => (
                <TableRow key={log.id}>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>
                        <Badge className={`rounded-full ${getLogLevelClass(log.level)}`}>{log.level}</Badge>
                     </TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>{log.path}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
