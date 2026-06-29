"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Trash2, Download, Eye, Filter, Scale, Mic, MicOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import type { Report } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { CompareDialog } from "@/components/dashboard/compare-dialog";

export default function HistoryPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fabricFilter, setFabricFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Comparison States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [listening, setListening] = useState(false);

  const supabase = createClient();

  const loadReports = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;

    try {
      const params: { search?: string; fabric_type?: string } = {};
      if (search) params.search = search;
      if (fabricFilter !== "all") params.fabric_type = fabricFilter;

      const data = await api.getReports(session.access_token, params) as { reports: Report[] };
      setReports(data.reports);
    } catch {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, fabricFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;

    try {
      await api.deleteReport(session.access_token, deleteId);
      setReports(reports.filter((r) => r.id !== deleteId));
      setSelectedIds(selectedIds.filter((id) => id !== deleteId));
      toast.success("Report deleted");
    } catch {
      toast.error("Failed to delete report");
    } finally {
      setDeleteId(null);
    }
  };

  const handleDownload = async (reportId: string) => {
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

  const toggleSelect = (reportId: string) => {
    if (selectedIds.includes(reportId)) {
      setSelectedIds(selectedIds.filter((id) => id !== reportId));
    } else {
      if (selectedIds.length >= 2) {
        toast.warning("You can only compare 2 samples at a time. Deselect one first.");
        return;
      }
      setSelectedIds([...selectedIds, reportId]);
    }
  };

  const selectedReports = reports.filter((r) => selectedIds.includes(r.id));
  const reportA = selectedReports[0] || null;
  const reportB = selectedReports[1] || null;

  const startVoiceSearch = () => {
    // @ts-expect-error - Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice search is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
      toast.info("Listening... Speak now");
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearch(transcript);
      toast.success("Voice input applied!");
    };

    recognition.onerror = () => {
      toast.error("Voice recognition failed.");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold sm:text-3xl">Upload History</h1>
        <p className="mt-1 text-muted-foreground">View, search, and manage your previous fabric analyses.</p>
      </motion.div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by fabric type..."
            className="pl-10 pr-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            onClick={startVoiceSearch}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
              listening ? "text-primary animate-pulse" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {listening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </button>
        </div>
        <Select value={fabricFilter} onValueChange={(v) => setFabricFilter(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Plain Weave Cotton">Plain Weave</SelectItem>
            <SelectItem value="Twill Weave Polyester">Twill Weave</SelectItem>
            <SelectItem value="Denim Twill">Denim</SelectItem>
            <SelectItem value="Satin Weave Silk">Satin Weave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="mt-6 space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : reports.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No reports found. Upload a fabric image to get started.</p>
            <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
              <Link href="/upload">Upload Fabric</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-4">
          {reports.map((report, i) => {
            const isChecked = selectedIds.includes(report.id);
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`transition-all ${isChecked ? "border-primary bg-primary/5/10 dark:bg-primary/20 dark:bg-primary/10/10" : ""}`}>
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelect(report.id)}
                        className="mt-1.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{report.fabric_type}</h3>
                          <Badge variant="secondary">
                            {(report.confidence_score * 100).toFixed(0)}% confidence
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Density: {report.thread_density}/in | Warp: {report.warp_count} | Weft: {report.weft_count}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {report.created_at
                            ? formatDistanceToNow(new Date(report.created_at), { addSuffix: true })
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/reports/${report.id}`}>
                          <Eye className="mr-1 h-4 w-4" /> View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(report.id)}>
                        <Download className="mr-1 h-4 w-4" /> Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDeleteId(report.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Floating Action Button for Comparison */}
      {selectedIds.length === 2 && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <Button
            onClick={() => setCompareOpen(true)}
            className="shadow-lg bg-primary hover:bg-primary/90 h-12 px-6 flex items-center gap-2 text-white font-medium rounded-full"
          >
            <Scale className="h-5 w-5" />
            Compare Selected Fabrics
          </Button>
        </div>
      )}

      <CompareDialog
        open={compareOpen}
        onOpenChange={setCompareOpen}
        reportA={reportA}
        reportB={reportB}
      />

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Report</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this report? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
