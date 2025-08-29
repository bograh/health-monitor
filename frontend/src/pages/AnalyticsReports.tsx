import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchErrorStats } from "@/utils/requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Mail,
  Calendar,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Clock,
  Filter,
  Plus,
  Eye,
  Share,
  Settings,
} from "lucide-react";

interface Report {
  id: string;
  name: string;
  description: string;
  type: "error_summary" | "performance" | "uptime" | "security" | "custom";
  frequency: "daily" | "weekly" | "monthly" | "on_demand";
  format: "pdf" | "csv" | "json" | "html";
  recipients: string[];
  lastGenerated: string | null;
  nextScheduled: string | null;
  status: "active" | "paused" | "failed";
  createdBy: string;
  size: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: "errors" | "performance" | "infrastructure" | "business";
  icon: React.ReactNode;
  estimatedTime: string;
  dataPoints: string[];
}

export function AnalyticsReportsPage() {
  const [activeTab, setActiveTab] = useState<
    "reports" | "templates" | "schedule"
  >("reports");
  const [filterType, setFilterType] = useState<"all" | "active" | "scheduled">(
    "all"
  );

  const { data: stats } = useQuery({
    queryKey: ["reports-stats"],
    queryFn: fetchErrorStats,
    refetchInterval: 300000, // 5 minutes
  });

  // Mock reports data
  const reports: Report[] = [
    {
      id: "RPT-001",
      name: "Weekly Error Summary",
      description:
        "Comprehensive overview of all errors, trends, and resolutions from the past week.",
      type: "error_summary",
      frequency: "weekly",
      format: "pdf",
      recipients: ["admin@company.com", "dev-team@company.com"],
      lastGenerated: "2024-01-14T09:00:00Z",
      nextScheduled: "2024-01-21T09:00:00Z",
      status: "active",
      createdBy: "admin@company.com",
      size: "2.3 MB",
    },
    {
      id: "RPT-002",
      name: "Daily Performance Metrics",
      description:
        "System performance metrics including response times, throughput, and resource utilization.",
      type: "performance",
      frequency: "daily",
      format: "html",
      recipients: ["ops-team@company.com"],
      lastGenerated: "2024-01-15T06:00:00Z",
      nextScheduled: "2024-01-16T06:00:00Z",
      status: "active",
      createdBy: "ops@company.com",
      size: "1.1 MB",
    },
    {
      id: "RPT-003",
      name: "Monthly Uptime Report",
      description:
        "Detailed uptime analysis with SLA compliance metrics and incident summaries.",
      type: "uptime",
      frequency: "monthly",
      format: "pdf",
      recipients: ["management@company.com", "sre@company.com"],
      lastGenerated: "2024-01-01T00:00:00Z",
      nextScheduled: "2024-02-01T00:00:00Z",
      status: "active",
      createdBy: "sre@company.com",
      size: "5.7 MB",
    },
    {
      id: "RPT-004",
      name: "Security Audit Log",
      description:
        "Security events, failed login attempts, and access pattern analysis.",
      type: "security",
      frequency: "weekly",
      format: "csv",
      recipients: ["security@company.com"],
      lastGenerated: "2024-01-13T18:00:00Z",
      nextScheduled: "2024-01-20T18:00:00Z",
      status: "paused",
      createdBy: "security@company.com",
      size: "856 KB",
    },
  ];

  const templates: ReportTemplate[] = [
    {
      id: "TPL-001",
      name: "Error Analysis Report",
      description: "Detailed analysis of error patterns, frequency, and impact",
      category: "errors",
      icon: <AlertTriangle className="h-6 w-6" />,
      estimatedTime: "~5 minutes",
      dataPoints: [
        "Error counts",
        "Error trends",
        "Top error sources",
        "Resolution times",
      ],
    },
    {
      id: "TPL-002",
      name: "Performance Dashboard",
      description: "System performance metrics and trends analysis",
      category: "performance",
      icon: <TrendingUp className="h-6 w-6" />,
      estimatedTime: "~3 minutes",
      dataPoints: [
        "Response times",
        "Throughput metrics",
        "Resource usage",
        "Performance trends",
        "System health status",
      ],
    },
    {
      id: "TPL-003",
      name: "Infrastructure Health",
      description: "Complete infrastructure monitoring and health report",
      category: "infrastructure",
      icon: <BarChart3 className="h-6 w-6" />,
      estimatedTime: "~7 minutes",
      dataPoints: [
        "Server metrics",
        "Network stats",
        "Uptime data",
        "Capacity planning",
      ],
    },
    {
      id: "TPL-004",
      name: "Business Impact Summary",
      description:
        "Business-focused metrics showing system impact on operations",
      category: "business",
      icon: <FileText className="h-6 w-6" />,
      estimatedTime: "~4 minutes",
      dataPoints: [
        "User impact",
        "Revenue impact",
        "SLA compliance",
        "Customer satisfaction",
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "paused":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "error_summary":
        return "text-red-600 bg-red-100";
      case "performance":
        return "text-blue-600 bg-blue-100";
      case "uptime":
        return "text-green-600 bg-green-100";
      case "security":
        return "text-purple-600 bg-purple-100";
      case "custom":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "errors":
        return "border-red-200 bg-red-50";
      case "performance":
        return "border-blue-200 bg-blue-50";
      case "infrastructure":
        return "border-green-200 bg-green-50";
      case "business":
        return "border-purple-200 bg-purple-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTimeUntil = (timestamp: string) => {
    const now = new Date();
    const future = new Date(timestamp);
    const diffMs = future.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `in ${diffDays} days`;
    if (diffHours > 0) return `in ${diffHours} hours`;
    return "soon";
  };

  const filteredReports = reports.filter((report) => {
    return (
      filterType === "all" ||
      (filterType === "active" && report.status === "active") ||
      (filterType === "scheduled" && report.nextScheduled)
    );
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Analytics Reports</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <div className="text-xs text-muted-foreground">
              {reports.filter((r) => r.status === "active").length} active
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Scheduled Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-xs text-muted-foreground">Auto-generated</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Data Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">9.3 MB</div>
            <div className="text-xs text-muted-foreground">This month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recipients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-xs text-muted-foreground">
              Active subscribers
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
            activeTab === "reports"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Reports ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
            activeTab === "templates"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
            activeTab === "schedule"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Schedule
        </button>
      </div>

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Reports</option>
                <option value="active">Active Only</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{report.name}</span>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        <Badge className={getTypeColor(report.type)}>
                          {report.type.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline">{report.frequency}</Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {report.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium">Last Generated:</span>
                          </div>
                          <span className="text-muted-foreground">
                            {report.lastGenerated
                              ? formatTimestamp(report.lastGenerated)
                              : "Never"}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="h-3 w-3" />
                            <span className="font-medium">Next Scheduled:</span>
                          </div>
                          <span className="text-muted-foreground">
                            {report.nextScheduled
                              ? getTimeUntil(report.nextScheduled)
                              : "Not scheduled"}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <FileText className="h-3 w-3" />
                            <span className="font-medium">Size:</span>
                          </div>
                          <span className="text-muted-foreground">
                            {report.size} ({report.format.toUpperCase()})
                          </span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="text-sm font-medium mb-1">
                          Recipients:
                        </div>
                        <div className="flex gap-2">
                          {report.recipients.map((recipient, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {recipient}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={getCategoryColor(template.category)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {template.icon}
                  {template.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {template.description}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Generation Time:</span>
                    <span>{template.estimatedTime}</span>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Includes:</div>
                    <div className="space-y-1">
                      {template.dataPoints.map((point, index) => (
                        <div
                          key={index}
                          className="text-xs text-muted-foreground"
                        >
                          • {point}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1">
                    Generate Now
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <Card>
          <CardHeader>
            <CardTitle>Report Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports
                .filter((r) => r.nextScheduled)
                .map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-semibold">{report.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {report.frequency} • {report.format.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {getTimeUntil(report.nextScheduled!)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(report.nextScheduled!)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
