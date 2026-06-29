export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  subscription_plan: "free" | "student" | "professional" | "enterprise";
  storage_used_mb: number;
  storage_limit_mb: number;
  created_at?: string;
}

export interface Upload {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_size_kb: number;
  mime_type: string;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
}

export interface Report {
  id: string;
  upload_id: string;
  user_id: string;
  thread_density: number;
  warp_count: number;
  weft_count: number;
  fabric_type: string;
  confidence_score: number;
  ai_suggestions: string[];
  raw_analysis: Record<string, unknown>;
  created_at: string;
  uploads?: Partial<Upload>;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}

export interface DashboardStats {
  total_uploads: number;
  total_reports: number;
  storage_used_mb: number;
  storage_limit_mb: number;
  recent_reports: Report[];
  subscription_plan: string;
}

export interface AdminStats {
  total_users: number;
  total_uploads: number;
  total_reports: number;
  total_messages: number;
  plan_distribution: Record<string, number>;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}
