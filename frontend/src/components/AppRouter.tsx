import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./layout/layout";
import { DashboardPage } from "@/pages/Dashboard";
import { AnalyticsPage } from "@/pages/Analytics";
import { MonitoringPage } from "@/pages/Monitoring";
import { AlertsPage } from "@/pages/Alerts";
import { SettingsPage } from "@/pages/Settings";
import { ErrorsUnresolvedPage } from "@/pages/ErrorsUnresolved";
import { ErrorsCriticalPage } from "@/pages/ErrorsCritical";
import { ErrorsRecentPage } from "@/pages/ErrorsRecent";
import { DashboardRealtimePage } from "@/pages/DashboardRealtime";

export function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/overview" element={<DashboardPage />} />
          <Route
            path="/dashboard/realtime"
            element={<DashboardRealtimePage />}
          />

          <Route path="/errors" element={<DashboardPage />} />
          <Route path="/errors/all" element={<DashboardPage />} />
          <Route path="/errors/unresolved" element={<ErrorsUnresolvedPage />} />
          <Route path="/errors/critical" element={<ErrorsCriticalPage />} />
          <Route path="/errors/recent" element={<ErrorsRecentPage />} />

          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/analytics/trends" element={<AnalyticsPage />} />
          <Route path="/analytics/performance" element={<AnalyticsPage />} />
          <Route path="/analytics/reports" element={<AnalyticsPage />} />

          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/monitoring/health" element={<MonitoringPage />} />
          <Route path="/monitoring/uptime" element={<MonitoringPage />} />
          <Route path="/monitoring/metrics" element={<MonitoringPage />} />

          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/alerts/rules" element={<AlertsPage />} />
          <Route path="/alerts/notifications" element={<AlertsPage />} />
          <Route path="/alerts/incidents" element={<AlertsPage />} />

          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/general" element={<SettingsPage />} />
          <Route path="/settings/api-keys" element={<SettingsPage />} />
          <Route path="/settings/integrations" element={<SettingsPage />} />
          <Route path="/settings/team" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
