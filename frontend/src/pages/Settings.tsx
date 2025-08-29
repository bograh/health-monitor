import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  Key,
  Users,
  Link,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from "lucide-react";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "general" | "api-keys" | "integrations" | "team"
  >("general");
  const [showApiKey, setShowApiKey] = useState(false);

  // Mock data
  const apiKeys = [
    {
      id: "1",
      name: "Production API Key",
      key: "sk_like_BsrAYmUtVy8MUtdo9MUcr6cNU2MTjwF7",
      lastUsed: "2024-01-15T14:30:00Z",
      permissions: ["read", "write"],
    },
    {
      id: "2",
      name: "Development Key",
      key: "sk_test_AbCdEfGhIjKlMnOpQrStUvWxYz123456",
      lastUsed: "2024-01-10T09:15:00Z",
      permissions: ["read"],
    },
  ];

  const teamMembers = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@healthmonitor.com",
      role: "Owner",
      status: "active",
      lastActive: "2024-01-15T14:30:00Z",
    },
    {
      id: "2",
      name: "John Developer",
      email: "john@company.com",
      role: "Developer",
      status: "active",
      lastActive: "2024-01-15T12:15:00Z",
    },
    {
      id: "3",
      name: "Sarah Ops",
      email: "sarah@company.com",
      role: "Viewer",
      status: "invited",
      lastActive: null,
    },
  ];

  const integrations = [
    {
      name: "Slack",
      description: "Send alerts to Slack channels",
      status: "connected",
      icon: "💬",
    },
    {
      name: "PagerDuty",
      description: "Incident management and escalation",
      status: "not-connected",
      icon: "📟",
    },
    {
      name: "Webhook",
      description: "Custom webhook notifications",
      status: "connected",
      icon: "🔗",
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
            activeTab === "general"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab("api-keys")}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
            activeTab === "api-keys"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          API Keys
        </button>
        <button
          onClick={() => setActiveTab("integrations")}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
            activeTab === "integrations"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Integrations
        </button>
        <button
          onClick={() => setActiveTab("team")}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
            activeTab === "team"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Team
        </button>
      </div>

      {/* General Settings */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Application Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Organization Name
                  </label>
                  <Input defaultValue="Health Monitor Inc." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Zone</label>
                  <Input defaultValue="UTC" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Data Retention Period
                </label>
                <Input defaultValue="90 days" />
                <p className="text-xs text-muted-foreground">
                  How long to keep error logs before automatic deletion
                </p>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Receive alerts via email
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Digest Reports</div>
                  <div className="text-sm text-muted-foreground">
                    Weekly summary reports
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === "api-keys" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">API Keys</h3>
              <p className="text-sm text-muted-foreground">
                Manage your API keys for integrations
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </div>

          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{apiKey.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Last used: {new Date(apiKey.lastUsed).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {apiKey.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value={apiKey.key}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(apiKey.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === "integrations" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Integrations</h3>
            <p className="text-sm text-muted-foreground">
              Connect with external services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <h4 className="font-semibold">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          integration.status === "connected"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          integration.status === "connected"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {integration.status === "connected"
                          ? "Connected"
                          : "Not Connected"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {integration.status === "connected"
                          ? "Configure"
                          : "Connect"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === "team" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Team Members</h3>
              <p className="text-sm text-muted-foreground">
                Manage team access and permissions
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>

          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{member.name}</h4>
                      <Badge variant="outline">{member.role}</Badge>
                      <Badge
                        variant={
                          member.status === "active" ? "default" : "secondary"
                        }
                        className={
                          member.status === "active"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {member.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {member.email}
                    </p>
                    {member.lastActive && (
                      <p className="text-xs text-muted-foreground">
                        Last active:{" "}
                        {new Date(member.lastActive).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    {member.role !== "Owner" && (
                      <Button variant="destructive" size="sm">
                        Remove
                      </Button>
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
