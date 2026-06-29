"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import Tesseract from "tesseract.js";

const MAX_SIZE = 15 * 1024 * 1024; // Increase default limit to 15MB since we will compress it down anyway
const ACCEPTED_TYPES = { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] };

async function compressImage(file: File) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(file, options);
    return {
      file: compressedFile,
      originalSize: file.size,
      compressedSize: compressedFile.size,
    };
  } catch (error) {
    console.error("Compression error:", error);
    throw error;
  }
}

export default function UploadPage() {
  const router = useRouter();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
    savingPercentage: number;
  } | null>(null);
  const [ocrText, setOcrText] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const supabase = createClient();

  const onDrop = useCallback(async (accepted: File[], rejected: FileRejection[]) => {
    setError(null);
    setCompressionStats(null);

    if (rejected.length > 0) {
      setError(rejected[0].errors[0]?.message || "Invalid file");
      return;
    }

    const selectedFile = accepted[0];
    if (!selectedFile) return;

    setOriginalFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));

    // If file is larger than 1MB, or if it is a PNG, trigger auto-compression on the fly
    if (selectedFile.size > 1024 * 1024 || selectedFile.type === "image/png") {
      toast.info("Optimizing image quality and size...");
      try {
        const result = await compressImage(selectedFile);
        setFileToUpload(result.file);
        // Replace preview with compressed one
        URL.revokeObjectURL(preview || "");
        setPreview(URL.createObjectURL(result.file));
        
        const saving = Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100);
        setCompressionStats({
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
          savingPercentage: saving > 0 ? saving : 0,
        });
        toast.success(`Image optimized successfully! Saved ${saving > 0 ? saving : 0}% size.`);
      } catch (err) {
        console.error("Compression failed:", err);
        setFileToUpload(selectedFile);
      }
    } else {
      setFileToUpload(selectedFile);
    }
  }, [preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    multiple: false,
  });

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setOriginalFile(null);
    setFileToUpload(null);
    setPreview(null);
    setError(null);
    setCompressionStats(null);
    setOcrText(null);
  };

  const handleOCR = async () => {
    const fileToUse = fileToUpload || originalFile;
    if (!fileToUse) return;

    setOcrLoading(true);
    setOcrText(null);
    try {
      toast.info("Extracting text from image...", { id: "ocr-toast" });
      const result = await Tesseract.recognize(fileToUse, "eng");
      setOcrText(result.data.text);
      toast.success("Text extracted successfully!", { id: "ocr-toast" });
    } catch (err) {
      toast.error("Failed to extract text.", { id: "ocr-toast" });
      console.error(err);
    } finally {
      setOcrLoading(false);
    }
  };

  const handleUpload = async () => {
    const fileToUse = fileToUpload || originalFile;
    if (!fileToUse) return;

    setUploading(true);
    setProgress(15);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not authenticated");

      setProgress(40);
      const result = await api.uploadFabric(session.access_token, fileToUse) as {
        report: { id: string };
      };
      setProgress(100);
      toast.success("Analysis complete!");
      router.push(`/reports/${result.report.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold sm:text-3xl">Upload Fabric Image</h1>
        <p className="mt-1 text-muted-foreground">
          Upload a fabric image for AI-powered thread density and weave analysis.
        </p>
      </motion.div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Image Upload</CardTitle>
          <CardDescription>Supported formats: JPG, JPEG, PNG (max 15MB)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!originalFile ? (
            <div
              {...getRootProps()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5 dark:bg-primary/20 dark:bg-primary/10/30"
                  : "border-muted-foreground/25 hover:border-indigo-400 hover:bg-muted/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">
                {isDragActive ? "Drop your image here" : "Drag & drop your fabric image"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">or click to browse files</p>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-xl border overflow-hidden"
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Preview" className="w-full max-h-80 object-contain bg-muted/30 animate-in fade-in duration-300" />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-muted/30">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t p-4 gap-4">
                  <div className="space-y-1">
                    <p className="font-medium truncate max-w-[280px]">{originalFile.name}</p>
                    {compressionStats ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs line-through text-muted-foreground">
                          {(compressionStats.originalSize / 1024).toFixed(0)} KB
                        </span>
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          {(compressionStats.compressedSize / 1024).toFixed(0)} KB (-{compressionStats.savingPercentage}%)
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">{(originalFile.size / 1024).toFixed(1)} KB</p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={removeFile} disabled={uploading} className="self-end sm:self-center">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing fabric structure...
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={handleUpload}
              disabled={!originalFile || uploading || ocrLoading}
              className="w-full bg-primary hover:bg-primary/90 h-12 flex-1"
            >
              {uploading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
              ) : (
                <><Upload className="mr-2 h-4 w-4" /> Upload & Analyze</>
              )}
            </Button>
            <Button
              onClick={handleOCR}
              disabled={!originalFile || uploading || ocrLoading}
              variant="outline"
              className="w-full h-12 flex-1"
            >
              {ocrLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reading Tag...</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4 text-amber-500" /> Read Care Label (OCR)</>
              )}
            </Button>
          </div>

          {ocrText && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <Card className="bg-muted/30 border-dashed">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" /> Extracted Text
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm font-mono bg-background p-3 rounded-md border">
                    {ocrText.trim() || "No text detected."}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

