"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRightLeft, ChevronDown, RefreshCcw, Layers } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import type { Report } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

export default function ComparePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportA, setReportA] = useState<Report | null>(null);
  const [reportB, setReportB] = useState<Report | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadReports() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      try {
        const result = await api.getReports(session.access_token);
        const data = (result as { reports: Report[] }).reports;
        setReports(data);
        if (data.length > 0) setReportA(data[0]);
        if (data.length > 1) setReportB(data[1]);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [supabase.auth]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  const StatRow = ({ label, valA, valB, isHigherBetter = true }: { label: string, valA: number, valB: number, isHigherBetter?: boolean }) => {
    const diff = valA - valB;
    const aIsBetter = isHigherBetter ? diff > 0 : diff < 0;
    const bIsBetter = isHigherBetter ? diff < 0 : diff > 0;
    const equal = diff === 0;

    return (
      <div className="flex flex-col space-y-2 py-4 border-b border-border/50 last:border-0">
        <p className="text-sm font-medium text-muted-foreground text-center uppercase tracking-wider">{label}</p>
        <div className="flex items-center justify-between px-4">
          <div className={`text-2xl font-bold ${aIsBetter ? 'text-primary' : ''}`}>{valA}</div>
          <div className={`text-xs px-3 py-1 rounded-full ${equal ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary font-bold'}`}>
            {equal ? 'Equal' : (diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1))}
          </div>
          <div className={`text-2xl font-bold ${bIsBetter ? 'text-primary' : ''}`}>{valB}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl flex items-center gap-2"><Layers className="h-8 w-8 text-primary" /> Fabric Comparison</h1>
          <p className="mt-1 text-muted-foreground">Select two reports to compare their analysis metrics side-by-side.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/history"><ArrowLeft className="mr-2 h-4 w-4" /> Back to History</Link>
        </Button>
      </motion.div>

      {reports.length < 2 ? (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <RefreshCcw className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h2 className="text-xl font-semibold">Not enough data</h2>
            <p className="mt-2 text-muted-foreground max-w-md">
              You need at least two fabric reports to use the comparison tool. Upload more fabrics to get started.
            </p>
            <Button asChild className="mt-6">
              <Link href="/upload">Upload Fabric</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 space-y-8">
          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg border-4 border-background">
              <ArrowRightLeft className="h-4 w-4" />
            </div>

            <Card className="border-border/50 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <CardHeader className="bg-muted/10 pb-4">
                <CardTitle className="text-sm text-muted-foreground mb-2">Sample A</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="outline" className="w-full justify-between font-semibold h-12 bg-background" />}>
                    {reportA ? reportA.fabric_type : "Select Report A"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[300px]">
                    {reports.filter(r => r.id !== reportB?.id).map((r) => (
                      <DropdownMenuItem key={r.id} onClick={() => setReportA(r)} className="flex items-center justify-between cursor-pointer">
                        <span>{r.fabric_type}</span>
                        <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
            </Card>

            <Card className="border-border/50 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
              <CardHeader className="bg-muted/10 pb-4">
                <CardTitle className="text-sm text-muted-foreground mb-2">Sample B</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="outline" className="w-full justify-between font-semibold h-12 bg-background" />}>
                    {reportB ? reportB.fabric_type : "Select Report B"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[300px]">
                    {reports.filter(r => r.id !== reportA?.id).map((r) => (
                      <DropdownMenuItem key={r.id} onClick={() => setReportB(r)} className="flex items-center justify-between cursor-pointer">
                        <span>{r.fabric_type}</span>
                        <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
            </Card>
          </div>

          {/* Comparison Metrics */}
          {reportA && reportB && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-border/50 shadow-md">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4 bg-muted/30 border-b border-border/50 text-sm font-semibold text-muted-foreground">
                    <div className="flex-1 text-left px-4">Sample A Metrics</div>
                    <div className="flex-1 text-center">Variance</div>
                    <div className="flex-1 text-right px-4">Sample B Metrics</div>
                  </div>
                  <div className="p-4 sm:p-6 space-y-2">
                    <StatRow label="Thread Density (/in)" valA={reportA.thread_density} valB={reportB.thread_density} />
                    <StatRow label="Warp Count" valA={reportA.warp_count} valB={reportB.warp_count} />
                    <StatRow label="Weft Count" valA={reportA.weft_count} valB={reportB.weft_count} />
                    
                    <div className="py-6 border-b border-border/50 last:border-0">
                      <p className="text-sm font-medium text-muted-foreground text-center uppercase tracking-wider mb-4">AI Confidence Score</p>
                      <div className="flex items-center justify-between gap-8 px-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Score</span>
                            <span className="font-bold">{(reportA.confidence_score * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={reportA.confidence_score * 100} className="h-2" />
                        </div>
                        <div className="text-muted-foreground text-sm font-bold bg-muted px-3 py-1 rounded-full">
                          VS
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Score</span>
                            <span className="font-bold">{(reportB.confidence_score * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={reportB.confidence_score * 100} className="h-2 [&>div]:bg-accent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
