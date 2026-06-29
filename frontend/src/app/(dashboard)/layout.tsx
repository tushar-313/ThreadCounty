"use client";

import { useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import type { Profile } from "@/types";
import { Chatbot } from "@/components/dashboard/chatbot";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        try {
          const data = await api.getProfile(session.access_token) as { profile: Profile };
          setProfile(data.profile);
        } catch {
          setProfile({
            id: session.user.id,
            email: session.user.email || "",
            full_name: session.user.user_metadata?.full_name || null,
            avatar_url: null,
            role: "user",
            subscription_plan: "free",
            storage_used_mb: 0,
            storage_limit_mb: 100,
          });
        }
      }
    }
    loadProfile();
  }, [supabase.auth]);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar profile={profile} />
      <main className="flex-1 bg-muted/20">{children}</main>
      <Chatbot />
    </div>
  );
}
