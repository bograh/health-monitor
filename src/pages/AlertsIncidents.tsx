import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchErrorStats } from "@/utils/requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Clock,
  Users,
  MessageSquare,
  Plus,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  RotateCcw,
  Filter,
  Search,
  Calendar,
  User,
  ExternalLink,
} from "lucide-react";

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "investigating" | "resolved" | "closed";
  assignee: string | null;
  reporter: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  affectedServices: string[];
  tags: string[];
  updates: IncidentUpdate[];
  impactLevel: "low" | "medium" | "high";
  estimatedUsers: number;
}

interface IncidentUpdate {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  type: "comment" | "status_change" | "assignment" | "resolution";
}

export function AlertsIncidentsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "history" | "metrics">(
    "active"
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "open" | "investigating" | "resolved"
  >("all");
  const [severityFilter, setSeverityFilter] = useState<
    "all" | "critical" | "high" | "medium" | "low"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: stats } = useQuery({
    queryKey: ["incidents-stats"],
    queryFn: fetchErrorStats,
    refetchInterval: 60000,
  });

  // Mock incidents data
  const incidents: Incident[] = [
    {
      id: "INC-001",
      title: "Database Connection Pool Exhausted",
      description:
        "Database connection pool has reached maximum capacity causing timeouts across all services.",
      severity: "critical",
      status: "investigating",
      assignee: "john.doe@company.com",
      reporter: "sarah.ops@company.com",
      createdAt: "2024-01-15T14:30:00Z",
      updatedAt: "2024-01-15T15:15:00Z",
      resolvedAt: null,
      affectedServices: ["API Gateway", "User Service", "Payment Service"],
      tags: ["database", "performance", "infrastructure"],
      impactLevel: "high",
      estimatedUsers: 15000,
      updates: [
        {
          id: "1",
          author: "john.doe@company.com",
          message:
            "Investigating database connection issues. Found high number of long-running queries.",
          timestamp: "2024-01-15T15:15:00Z",
          type: "comment",
        },
        {
          id: "2",
          author: "sarah.ops@company.com",
          message: "Assigned to John Doe for investigation",
          timestamp: "2024-01-15T14:45:00Z",
          type: "assignment",
        },
      ],
    },
    {
      id: "INC-002",
      title: "High Memory Usage on Web Servers",
      description:
        "Memory usage has exceeded 90% on all web servers, causing performance degradation.",
      severity: "high",
      status: "open",
      assignee: null,
      reporter: "monitoring@company.com",
      createdAt: "2024-01-15T13:20:00Z",
      updatedAt: "2024-01-15T13:20:00Z",
      resolvedAt: null,
      affectedServices: ["Web Dashboard", "API"],
      tags: ["memory", "performance", "web-servers"],
      impactLevel: "medium",
      estimatedUsers: 8000,
      updates: [],
    },
    {
      id: "INC-003",
      title: "SSL Certificate Expiry Warning",
      description:
        "SSL certificate for api.healthmonitor.com is expiring in 7 days.",
      severity: "medium",
      status: "resolved",
      assignee: "security@company.com",
      reporter: "automated@company.com",
      createdAt: "2024-01-14T09:00:00Z",
      updatedAt: "2024-01-14T16:30:00Z",
      resolvedAt: "2024-01-14T16:30:00Z",
      affectedServices: ["API"],
      tags: ["security", "ssl", "maintenance"],
      impactLevel: "low",
      estimatedUsers: 0,
      updates: [
        {
          id: "3",
          author: "security@company.com",
          message: "New SSL certificate has been installed and validated.",
          timestamp: "2024-01-14T16:30:00Z",
          type: "resolution",
        },
      ],
    },
    {
      id: "INC-004",
      title: "Elevated Error Rate in Payment Processing",
      description:
        "Error rate for payment processing has increased to 12% in the last hour.",
      severity: "high",
      status: "investigating",
      assignee: "payments@company.com",
      reporter: "error-monitoring@company.com",
      createdAt: "2024-01-15T12:45:00Z",
      updatedAt: "2024-01-15T14:20:00Z",
      resolvedAt: null,
      affectedServices: ["Payment Service", "Order Processing"],
      tags: ["payments", "errors", "revenue-impact"],
      impactLevel: "high",
      estimatedUsers: 5000,
      updates: [
        {
          id: "4",
          author: "payments@company.com",
          message:
            "Identified issue with third-party payment provider. Implementing fallback solution.",
          timestamp: "2024-01-15T14:20:00Z",
          type: "comment",
        },
      ],
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-700 bg-red-100 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-100 border-orange-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-red-600 bg-red-100";
      case "investigating":
        return "text-yellow-600 bg-yellow-100";
      case "resolved":
        return "text-green-600 bg-green-100";
      case "closed":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const filteredIncidents = incidents.filter((incident) => {
    const matchesStatus =
      statusFilter === "all" || incident.status === statusFilter;
    const matchesSeverity =
      severityFilter === "all" || incident.severity === severityFilter;
    const matchesSearch =
      searchTerm === "" ||
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSeverity && matchesSearch;
  });

  const activeIncidents = incidents.filter(
    (i) => i.status === "open" || i.status === "investigating"
  );
  const criticalIncidents = incidents.filter((i) => i.severity === "critical");
  const avgResolutionTime = 4.2; // Mock data

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <h1 className="text-2xl font-semibold">Incident Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Status Page
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Incident
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {activeIncidents.length}
            </div>
            <div className="text-xs text-muted-foreground">
              Requires attention
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {criticalIncidents.length}
            </div>
            <div className="text-xs text-muted-foreground">High priority</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {avgResolutionTime}h
            </div>
            <div className="text-xs text-muted-foreground">Last 30 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {incidents.length}
            </div>
            <div className="text-xs text-muted-foreground">
              +2 from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
            activeTab === "active"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Active ({activeIncidents.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
            activeTab === "history"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          History
        </button>
        <button
          onClick={() => setActiveTab("metrics")}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
            activeTab === "metrics"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Metrics
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as any)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => (
          <Card
            key={incident.id}
            className={`border-l-4 ${getSeverityColor(incident.severity)}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm text-muted-foreground">
                      {incident.id}
                    </span>
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getImpactColor(incident.impactLevel)}
                    >
                      {incident.impactLevel} impact
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">
                    {incident.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {incident.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <User className="h-3 w-3" />
                        <span className="font-medium">Assignee:</span>
                      </div>
                      <span className="text-muted-foreground">
                        {incident.assignee || "Unassigned"}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Users className="h-3 w-3" />
                        <span className="font-medium">Affected Users:</span>
                      </div>
                      <span className="text-muted-foreground">
                        ~{incident.estimatedUsers.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">Created:</span>
                      </div>
                      <span className="text-muted-foreground">
                        {getTimeAgo(incident.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-sm font-medium mb-1">
                      Affected Services:
                    </div>
                    <div className="flex gap-2">
                      {incident.affectedServices.map((service, index) => (
                        <Badge key={index} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {incident.tags.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-2">
                        {incident.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {incident.updates.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-sm font-medium mb-2">
                        Latest Update (
                        {getTimeAgo(incident.updates[0].timestamp)}):
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {incident.updates[0].message}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {incident.status !== "resolved" &&
                    incident.status !== "closed" && (
                      <Button variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Metrics Tab */}
      {activeTab === "metrics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Incident Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Incident frequency over time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resolution Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Average resolution time by severity
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
