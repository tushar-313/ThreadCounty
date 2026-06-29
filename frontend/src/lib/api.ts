const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getDashboardStats(token: string) {
    return this.request("/api/dashboard/stats", {}, token);
  }

  async getProfile(token: string) {
    return this.request("/api/users/me", {}, token);
  }

  async updateProfile(token: string, data: { full_name?: string; avatar_url?: string; subscription_plan?: string; storage_limit_mb?: number }) {
    return this.request("/api/users/me", { method: "PATCH", body: JSON.stringify(data) }, token);
  }

  async getActivity(token: string) {
    return this.request("/api/users/me/activity", {}, token);
  }

  async getNotifications(token: string) {
    return this.request("/api/users/me/notifications", {}, token);
  }

  async uploadFabric(token: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.request("/api/uploads/", { method: "POST", body: formData }, token);
  }

  async getReports(token: string, params?: { search?: string; fabric_type?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.fabric_type) query.set("fabric_type", params.fabric_type);
    const qs = query.toString();
    return this.request(`/api/reports/${qs ? `?${qs}` : ""}`, {}, token);
  }

  async getReport(token: string, reportId: string) {
    return this.request(`/api/reports/${reportId}`, {}, token);
  }

  async deleteReport(token: string, reportId: string) {
    return this.request(`/api/reports/${reportId}`, { method: "DELETE" }, token);
  }

  async downloadReport(token: string, reportId: string) {
    return this.request(`/api/reports/${reportId}/download`, {}, token);
  }

  async getAdminStats(token: string) {
    return this.request("/api/admin/stats", {}, token);
  }

  async getAdminUsers(token: string) {
    return this.request("/api/admin/users", {}, token);
  }

  async getAdminUploads(token: string) {
    return this.request("/api/admin/uploads", {}, token);
  }

  async getAdminMessages(token: string) {
    return this.request("/api/admin/messages", {}, token);
  }

  async updateAdminUserRole(token: string, userId: string, role: string) {
    return this.request(`/api/admin/users/${userId}/role?role=${role}`, { method: "PATCH" }, token);
  }

  async deleteAdminUpload(token: string, uploadId: string) {
    return this.request(`/api/admin/uploads/${uploadId}`, { method: "DELETE" }, token);
  }

  async submitContact(data: { name: string; email: string; subject: string; message: string }) {
    return this.request("/api/contact/", { method: "POST", body: JSON.stringify(data) });
  }
}

export const api = new ApiClient(API_URL);
