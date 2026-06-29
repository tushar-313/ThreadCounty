"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Download, Share2, ArrowLeft, Grid3x3, Layers, Target, Lightbulb, Copy, Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import type { Report } from "@/types";
import { toast } from "sonner";

export default function ReportPage() {
  const params = useParams();
  const reportId = params.id as string;
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      try {
        const data = await api.getReport(session.access_token, reportId) as { report: Report };
        setReport(data.report);
      } catch {
        toast.error("Failed to load report");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [reportId, supabase.auth]);

  const handleDownload = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;

    try {
      const data = await api.downloadReport(session.access_token, reportId) as {
        content: string;
        filename: string;
      };
      const blob = new Blob([data.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded!");
    } catch {
      toast.error("Download failed");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "ThreadCounty Report", url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 text-center">
        <p className="text-muted-foreground">Report not found.</p>
        <Button asChild className="mt-4"><Link href="/history">Back to History</Link></Button>
      </div>
    );
  }

  const confidence = (report.confidence_score * 100).toFixed(1);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/history" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to History
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Analysis Report</h1>
            <p className="mt-1 text-muted-foreground">{report.fabric_type}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
              Share
            </Button>
            <Button onClick={handleDownload} className="bg-primary hover:bg-primary/90">
              <Download className="mr-2 h-4 w-4" /> Download Report
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Uploaded Image</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/30 p-4 flex items-center justify-center min-h-[200px]">
              {report.uploads?.file_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={report.uploads.file_url}
                  alt={report.uploads.file_name || "Fabric"}
                  className="max-h-64 rounded-lg object-contain"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Layers className="mx-auto h-12 w-12" />
                  <p className="mt-2">{report.uploads?.file_name || "Fabric Image"}</p>
                </div>
              )}
            </div>
            {report.uploads?.file_name && (
              <p className="mt-2 text-sm text-muted-foreground">{report.uploads.file_name}</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Confidence Score</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-primary">{confidence}%</span>
                <Progress value={parseFloat(confidence)} className="flex-1 h-3" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Thread Density", value: `${report.thread_density}/in`, icon: Grid3x3 },
              { label: "Warp Count", value: report.warp_count, icon: Layers },
              { label: "Weft Count", value: report.weft_count, icon: Layers },
              { label: "Fabric Type", value: report.fabric_type, icon: Target },
            ].map((item) => (
              <Card key={item.label}>
                <CardContent className="p-4">
                  <item.icon className="h-4 w-4 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-bold truncate">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" /> AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.ai_suggestions?.map((suggestion, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
                <Badge variant="secondary" className="mt-0.5 shrink-0">{i + 1}</Badge>
                <p className="text-sm">{suggestion}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
