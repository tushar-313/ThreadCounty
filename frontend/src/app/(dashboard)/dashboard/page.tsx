"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Upload, FileText, HardDrive, Crown, ArrowRight, Bell, Activity, ArrowRightLeft
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import type { DashboardStats, Profile, Notification, ActivityLog } from "@/types";
import { formatDistanceToNow, subDays, format, isSameDay } from "date-fns";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      try {
        const [statsData, profileData, notifData, activityData] = await Promise.all([
          api.getDashboardStats(session.access_token),
          api.getProfile(session.access_token),
          api.getNotifications(session.access_token),
          api.getActivity(session.access_token),
        ]);
        setStats(statsData as DashboardStats);
        setProfile((profileData as { profile: Profile }).profile);
        setNotifications((notifData as { notifications: Notification[] }).notifications);
        setActivity((activityData as { activity: ActivityLog[] }).activity);

        if ((profileData as { profile: Profile }).profile.role === "admin") {
          router.replace("/admin");
        }
      } catch {
        setStats({
          total_uploads: 0,
          total_reports: 0,
          storage_used_mb: 0,
          storage_limit_mb: 100,
          recent_reports: [],
          subscription_plan: "free",
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [supabase.auth]);

  const storagePercent = stats
    ? Math.min((stats.storage_used_mb / stats.storage_limit_mb) * 100, 100)
    : 0;

  // Generate chart data based on activity (last 7 days)
  const generateChartData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const count = activity.filter(a => isSameDay(new Date(a.created_at), date)).length;
      data.push({
        name: format(date, "MMM dd"),
        activity: count
      });
    }
    return data;
  };
  const chartData = generateChartData();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-950 dark:to-zinc-900 px-6 py-6 text-white shadow-lg border border-white/10"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute right-0 top-0 h-[300px] w-[300px] -translate-y-1/2 translate-x-1/3 rounded-full bg-primary/30 blur-[80px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              Welcome back, {profile?.full_name?.split(" ")[0] || "User"}
            </h1>
            <p className="mt-1 text-zinc-400 max-w-xl text-sm">
              Here's an overview of your textile analysis activity and platform usage.
            </p>
          </div>
          <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md self-start md:self-auto">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
            System Online
          </div>
        </div>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Uploads", value: String(stats?.total_uploads || 0), icon: Upload, color: "text-primary" },
          { label: "Reports Generated", value: String(stats?.total_reports || 0), icon: FileText, color: "text-violet-600" },
          { label: "Storage Used", value: `${stats?.storage_used_mb ? stats.storage_used_mb.toFixed(2) : "0.00"} MB`, icon: HardDrive, color: "text-emerald-600" },
          { label: "Current Plan", value: stats?.subscription_plan || "free", icon: Crown, color: "text-amber-600" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-xl shadow-sm transition-all hover:shadow-md hover:border-primary/50 group">
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${stat.color.replace('text-', 'bg-')}`} />
              <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-0 blur-2xl group-hover:opacity-20 transition-opacity duration-500 ${stat.color.replace('text-', 'bg-')}`} />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg p-2.5 bg-background shadow-sm border border-border/50 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold tracking-tight">
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <p className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
              <CardDescription>Your platform activity over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                      itemStyle={{ color: "var(--primary)" }}
                    />
                    <Area type="monotone" dataKey="activity" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Your latest fabric analysis results</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/history">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {stats?.recent_reports && stats.recent_reports.length > 0 ? (
                <div className="space-y-3">
                  {stats.recent_reports.map((report) => (
                    <Link
                      key={report.id}
                      href={`/reports/${report.id}`}
                      className="group flex items-center justify-between rounded-xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{report.fabric_type}</p>
                          <p className="text-sm text-muted-foreground">
                            Density: {report.thread_density} | Confidence: {(report.confidence_score * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No reports yet. Upload your first fabric image!</p>
                  <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                    <Link href="/upload">Upload Fabric</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href="/upload"><Upload className="mr-2 h-4 w-4" /> Upload Fabric</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/history"><FileText className="mr-2 h-4 w-4" /> View History</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/compare"><ArrowRightLeft className="mr-2 h-4 w-4" /> Compare Fabrics</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/pricing"><Crown className="mr-2 h-4 w-4" /> Upgrade Plan</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{stats?.storage_used_mb ? stats.storage_used_mb.toFixed(2) : "0.00"} MB used</span>
                  <span>{stats?.storage_limit_mb || 100} MB total</span>
                </div>
                <Progress value={storagePercent} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((n) => (
                    <div key={n.id} className="rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{n.title}</p>
                        {!n.read && <Badge variant="secondary" className="text-xs">New</Badge>}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{n.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No notifications.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
