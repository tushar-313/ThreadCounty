"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Upload, FileText, Mail, BarChart3, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import type { AdminStats, Profile } from "@/types";
import { toast } from "sonner";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface AdminUpload {
  id: string;
  file_name: string;
  status: string;
  created_at: string;
  profiles?: { full_name: string; email: string };
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [uploads, setUploads] = useState<AdminUpload[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      try {
        const [statsData, usersData, uploadsData, messagesData] = await Promise.all([
          api.getAdminStats(session.access_token),
          api.getAdminUsers(session.access_token),
          api.getAdminUploads(session.access_token),
          api.getAdminMessages(session.access_token),
        ]);
        setStats(statsData as AdminStats);
        setUsers((usersData as { users: Profile[] }).users);
        setUploads((uploadsData as { uploads: AdminUpload[] }).uploads);
        setMessages((messagesData as { messages: ContactMessage[] }).messages);
      } catch {
        toast.error("Failed to load admin data. Admin access required.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [supabase.auth]);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    try {
      await api.updateAdminUserRole(session.access_token, userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`User role updated to ${newRole}`);
    } catch {
      toast.error("Failed to update user role.");
    }
  };

  const handleDeleteUpload = async (uploadId: string) => {
    if (!confirm("Are you sure you want to delete this upload?")) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    try {
      await api.deleteAdminUpload(session.access_token, uploadId);
      setUploads(uploads.filter(u => u.id !== uploadId));
      setStats(prev => prev ? { ...prev, total_uploads: Math.max(0, prev.total_uploads - 1) } : prev);
      toast.success("Upload deleted successfully.");
    } catch {
      toast.error("Failed to delete upload.");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Manage users, uploads, and platform analytics.</p>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", value: String(stats?.total_users || 0), icon: Users },
          { label: "Total Uploads", value: String(stats?.total_uploads || 0), icon: Upload },
          { label: "Total Reports", value: String(stats?.total_reports || 0), icon: FileText },
          { label: "Messages", value: String(stats?.total_messages || 0), icon: Mail },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-primary/10 p-3 text-primary dark:bg-primary/20 dark:bg-primary/10">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">
                  <AnimatedCounter value={stat.value} />
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats?.plan_distribution && Object.keys(stats.plan_distribution).length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {Object.entries(stats.plan_distribution).map(([plan, count]) => (
                <div key={plan} className="rounded-lg border px-4 py-3 text-center">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm capitalize text-muted-foreground">{plan}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="users" className="mt-8">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="uploads">Uploads</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name || "—"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell><Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge></TableCell>
                      <TableCell className="capitalize">{user.subscription_plan}</TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/users/${user.id}`}>View Details</Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleRoleChange(user.id, user.role || "user")}>
                          Make {user.role === "admin" ? "User" : "Admin"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No users found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uploads">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploads.map((upload) => (
                    <TableRow key={upload.id}>
                      <TableCell className="font-medium">{upload.file_name}</TableCell>
                      <TableCell>{upload.profiles?.full_name || upload.profiles?.email || "—"}</TableCell>
                      <TableCell><Badge variant="secondary">{upload.status}</Badge></TableCell>
                      <TableCell>{new Date(upload.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteUpload(upload.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {uploads.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No uploads found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((msg) => (
                    <TableRow key={msg.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{msg.name}</p>
                          <p className="text-xs text-muted-foreground">{msg.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{msg.subject}</TableCell>
                      <TableCell><Badge variant="secondary">{msg.status}</Badge></TableCell>
                      <TableCell>{new Date(msg.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                  {messages.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No messages found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
