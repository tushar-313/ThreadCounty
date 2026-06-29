"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, User, Shield, CreditCard, HardDrive, Trash2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import type { Profile } from "@/types";
import { toast } from "sonner";
import { PRICING_PLANS } from "@/lib/constants";

interface AdminUpload {
  id: string;
  file_name: string;
  file_url: string;
  status: string;
  created_at: string;
}

export default function AdminUserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [uploads, setUploads] = useState<AdminUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      try {
        const [userData, uploadsData] = await Promise.all([
          api.getAdminUser(session.access_token, id as string),
          api.getAdminUserUploads(session.access_token, id as string),
        ]);
        setUser((userData as { user: Profile }).user);
        setUploads((uploadsData as { uploads: AdminUpload[] }).uploads);
      } catch (err) {
        toast.error("Failed to load user details.");
        router.push("/admin");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router, supabase.auth]);

  const handlePlanChange = async (newPlan: string | null) => {
    if (!newPlan) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token || !user) return;
    try {
      await api.updateAdminUserPlan(session.access_token, user.id, newPlan);
      setUser({ ...user, subscription_plan: newPlan as "free" | "student" | "professional" | "enterprise" });
      toast.success(`User plan updated to ${newPlan}`);
    } catch {
      toast.error("Failed to update user plan.");
    }
  };

  const handleDeleteUpload = async (uploadId: string) => {
    if (!confirm("Are you sure you want to delete this upload?")) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    try {
      await api.deleteAdminUpload(session.access_token, uploadId);
      setUploads(uploads.filter(u => u.id !== uploadId));
      toast.success("Upload deleted successfully.");
    } catch {
      toast.error("Failed to delete upload.");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard</Link>
        </Button>
        <h1 className="text-2xl font-bold sm:text-3xl">User Profile: {user.full_name || "Unknown"}</h1>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Joined</p>
                <p className="font-semibold">{new Date(user.created_at || "").toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <HardDrive className="h-4 w-4" /> Storage Used
                </p>
                <p className="font-semibold">
                  {user.storage_used_mb ? user.storage_used_mb.toFixed(2) : "0.00"} MB / {user.storage_limit_mb || 100} MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Subscription Management</CardTitle>
            <CardDescription>Update this user's active plan and limits.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Current Plan</p>
                <Select value={user.subscription_plan || "free"} onValueChange={handlePlanChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICING_PLANS.map(p => (
                      <SelectItem key={p.id} value={p.id} className="capitalize">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">
                Changing the plan will instantly update their storage limits and platform access.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Uploaded Images</CardTitle>
          <CardDescription>Manage files uploaded by this user.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Filename</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploads.map((upload) => (
                <TableRow key={upload.id}>
                  <TableCell>
                    {upload.file_url ? (
                      <a href={upload.file_url} target="_blank" rel="noopener noreferrer" className="relative h-12 w-12 overflow-hidden rounded-md border block hover:opacity-80 transition-opacity">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={upload.file_url} alt={upload.file_name} className="h-full w-full object-cover" />
                      </a>
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <a href={upload.file_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                      {upload.file_name}
                    </a>
                  </TableCell>
                  <TableCell><Badge variant="outline">{upload.status}</Badge></TableCell>
                  <TableCell>{new Date(upload.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteUpload(upload.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {uploads.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No uploads found for this user.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
