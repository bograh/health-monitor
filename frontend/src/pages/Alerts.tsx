import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Plus,
  Settings,
  Mail,
  Slack,
} from "lucide-react";

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  enabled: boolean;
  notifications: string[];
  lastTriggered?: string;
}

interface Incident {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "investigating" | "resolved";
  createdAt: string;
  updatedAt: string;
}

export function AlertsPage() {
  const [activeTab, setActiveTab] = useState<
    "rules" | "notifications" | "incidents"
  >("rules");

  // Mock data
  const alertRules: AlertRule[] = [
    {
      id: "1",
      name: "High Error Rate",
      condition: "Error count > threshold in 5 minutes",
      threshold: 50,
      enabled: true,
      notifications: ["email", "slack"],
      lastTriggered: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Critical Error",
      condition: "Error level = critical",
      threshold: 1,
      enabled: true,
      notifications: ["email", "sms"],
    },
    {
      id: "3",
      name: "API Response Time",
      condition: "Response time > threshold",
      threshold: 2000,
      enabled: false,
      notifications: ["email"],
    },
  ];

  const incidents: Incident[] = [
    {
      id: "1",
      title: "Database Connection Timeout",
      severity: "critical",
      status: "investigating",
      createdAt: "2024-01-15T14:30:00Z",
      updatedAt: "2024-01-15T14:45:00Z",
    },
    {
      id: "2",
      title: "High Memory Usage",
      severity: "high",
      status: "open",
      createdAt: "2024-01-15T12:15:00Z",
      updatedAt: "2024-01-15T12:15:00Z",
    },
    {
      id: "3",
      title: "SSL Certificate Expiry Warning",
      severity: "medium",
      status: "resolved",
      createdAt: "2024-01-14T09:00:00Z",
      updatedAt: "2024-01-14T16:30:00Z",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "investigating":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Alerts & Incidents</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Alert Rule
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveTab("rules")}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
            activeTab === "rules"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Alert Rules
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
            activeTab === "notifications"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab("incidents")}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
            activeTab === "incidents"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Incidents
        </button>
      </div>

      {/* Alert Rules Tab */}
      {activeTab === "rules" && (
        <div className="space-y-4">
          {alertRules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{rule.name}</h3>
                      <Badge variant={rule.enabled ? "default" : "secondary"}>
                        {rule.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {rule.condition}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>
                        Threshold: <strong>{rule.threshold}</strong>
                      </span>
                      <span>
                        Notifications:{" "}
                        <strong>{rule.notifications.join(", ")}</strong>
                      </span>
                      {rule.lastTriggered && (
                        <span>
                          Last triggered:{" "}
                          <strong>
                            {new Date(rule.lastTriggered).toLocaleString()}
                          </strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={rule.enabled ? "destructive" : "default"}
                      size="sm"
                    >
                      {rule.enabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enabled</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Recipients:</strong>
                  <div className="text-muted-foreground">
                    admin@healthmonitor.com
                  </div>
                  <div className="text-muted-foreground">
                    alerts@company.com
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Slack className="h-5 w-5" />
                Slack Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enabled</span>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Channel:</strong>
                  <div className="text-muted-foreground">#alerts</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                SMS Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Disabled</span>
                <Badge variant="secondary">Not configured</Badge>
              </div>
              <Button variant="outline" size="sm">
                Setup SMS
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Incidents Tab */}
      {activeTab === "incidents" && (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <Card key={incident.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <h3 className="font-semibold">{incident.title}</h3>
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        Created: {new Date(incident.createdAt).toLocaleString()}
                      </span>
                      <span>
                        Updated: {new Date(incident.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {incident.status !== "resolved" && (
                      <>
                        <Button variant="outline" size="sm">
                          {incident.status === "open"
                            ? "Investigate"
                            : "Update"}
                        </Button>
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Resolve
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
