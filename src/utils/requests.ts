import axios from 'axios';
import type { ErrorLog, LogsResponse, ServiceStatus, PerformanceMetric, AlertRule } from '../types/api.types';

// Create an axios instance with default configuration
const apiClient = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error?.message || 'Unknown error');
    
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      throw new Error(`HTTP error! status: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error: No response received from server');
    } else {
      // Something else happened
      throw new Error(`Request error: ${error?.message || 'Unknown error'}`);
    }
  }
);

export async function fetchJSONData<T>(url: string): Promise<T> {
  try {
    const response = await apiClient.get<{ logs: T }>(url);
    return response.data.logs;
  } catch (error) {
    // Re-throw the error to be handled by the calling code
    throw error;
  }
}

// Alternative function for direct data fetching (without .logs wrapper)
export async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await apiClient.get<T>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// POST request helper
export async function postData<T, U>(url: string, data: U): Promise<T> {
  try {
    const response = await apiClient.post<T>(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// PUT request helper
export async function putData<T, U>(url: string, data: U): Promise<T> {
  try {
    const response = await apiClient.put<T>(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// DELETE request helper
export async function deleteData<T>(url: string): Promise<T> {
  try {
    const response = await apiClient.delete<T>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { apiClient };

// Specific API functions for health monitoring

// Fetch logs with proper typing
export async function fetchLogs(url: string): Promise<ErrorLog[]> {
  try {
    const response = await apiClient.get<LogsResponse>(url);
    return response.data.logs;
  } catch (error) {
    throw error;
  }
}

// Fetch service status
export async function fetchServiceStatus(url: string): Promise<ServiceStatus[]> {
  try {
    const response = await apiClient.get<ServiceStatus[]>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Fetch performance metrics
export async function fetchPerformanceMetrics(url: string): Promise<PerformanceMetric[]> {
  try {
    const response = await apiClient.get<PerformanceMetric[]>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Fetch alert rules
export async function fetchAlertRules(url: string): Promise<AlertRule[]> {
  try {
    const response = await apiClient.get<AlertRule[]>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}


// Dummy data for error logs
export const data = [
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