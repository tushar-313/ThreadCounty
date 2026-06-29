"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Scale, X, HelpCircle } from "lucide-react";
import type { Report } from "@/types";

interface CompareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportA: Report | null;
  reportB: Report | null;
}

export function CompareDialog({ open, onOpenChange, reportA, reportB }: CompareDialogProps) {
  if (!reportA || !reportB) return null;

  const displayDensityDiff = reportA.thread_density !== reportB.thread_density;
  const displayWarpDiff = reportA.warp_count !== reportB.warp_count;
  const displayWeftDiff = reportA.weft_count !== reportB.weft_count;
  const displayTypeDiff = reportA.fabric_type !== reportB.fabric_type;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Scale className="h-5 w-5 text-primary" />
            Fabric Structure Comparison
          </DialogTitle>
          <DialogDescription>
            Side-by-side analysis comparison of selected fabric samples.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sample A */}
          <div className="rounded-xl border p-5 bg-card/50 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-lg text-primary">Sample A</h3>
              <Badge variant="outline">
                {new Date(reportA.created_at).toLocaleDateString()}
              </Badge>
            </div>
            
            <div className="aspect-video relative rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              {reportA.uploads?.file_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={reportA.uploads.file_url}
                  alt={reportA.uploads.file_name || "Fabric A"}
                  className="object-contain w-full h-full max-h-48"
                />
              ) : (
                <span className="text-muted-foreground text-sm">No image available</span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Fabric Type</p>
                <p className={`font-semibold ${displayTypeDiff ? "text-primary dark:text-primary/80" : ""}`}>
                  {reportA.fabric_type}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-xs text-muted-foreground">Thread Density</p>
                  <p className={`text-lg font-bold ${displayDensityDiff ? "text-primary" : ""}`}>
                    {reportA.thread_density}
                  </p>
                  <p className="text-[10px] text-muted-foreground">threads/in</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-xs text-muted-foreground">Warp Count</p>
                  <p className={`text-lg font-bold ${displayWarpDiff ? "text-primary" : ""}`}>
                    {reportA.warp_count}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-xs text-muted-foreground">Weft Count</p>
                  <p className={`text-lg font-bold ${displayWeftDiff ? "text-primary" : ""}`}>
                    {reportB.weft_count}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Confidence Score</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${reportA.confidence_score * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {(reportA.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  AI Suggestions
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
                  {reportA.ai_suggestions.slice(0, 3).map((sug, idx) => (
                    <li key={idx}>{sug}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sample B */}
          <div className="rounded-xl border p-5 bg-card/50 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-lg text-violet-600">Sample B</h3>
              <Badge variant="outline">
                {new Date(reportB.created_at).toLocaleDateString()}
              </Badge>
            </div>
            
            <div className="aspect-video relative rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              {reportB.uploads?.file_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={reportB.uploads.file_url}
                  alt={reportB.uploads.file_name || "Fabric B"}
                  className="object-contain w-full h-full max-h-48"
                />
              ) : (
                <span className="text-muted-foreground text-sm">No image available</span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Fabric Type</p>
                <p className={`font-semibold ${displayTypeDiff ? "text-violet-600 dark:text-violet-400" : ""}`}>
                  {reportB.fabric_type}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-xs text-muted-foreground">Thread Density</p>
                  <p className={`text-lg font-bold ${displayDensityDiff ? "text-violet-600" : ""}`}>
                    {reportB.thread_density}
                  </p>
                  <p className="text-[10px] text-muted-foreground">threads/in</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-xs text-muted-foreground">Warp Count</p>
                  <p className={`text-lg font-bold ${displayWarpDiff ? "text-violet-600" : ""}`}>
                    {reportB.warp_count}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-xs text-muted-foreground">Weft Count</p>
                  <p className={`text-lg font-bold ${displayWeftDiff ? "text-violet-600" : ""}`}>
                    {reportB.weft_count}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Confidence Score</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-violet-600" 
                      style={{ width: `${reportB.confidence_score * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {(reportB.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                  AI Suggestions
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
                  {reportB.ai_suggestions.slice(0, 3).map((sug, idx) => (
                    <li key={idx}>{sug}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
