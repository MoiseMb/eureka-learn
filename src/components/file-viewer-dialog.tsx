"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Download, X, Maximize2, Minimize2 } from "lucide-react";
import { PDFViewer } from "./pdf-viewer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
}

export function FileViewerDialog({
  isOpen,
  onClose,
  fileUrl,
  fileName
}: FileViewerDialogProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const isPDF =
    fileUrl?.toLowerCase().endsWith(".pdf") ||
    fileUrl?.toLowerCase().includes("pdf");

  const handleDownload = async () => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement du fichier");
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg border p-0 overflow-hidden",
            isFullscreen
              ? "w-[95vw] h-[95vh]"
              : "w-[75vw] max-w-[900px] h-[85vh] max-h-[850px]"
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="p-4 border-b flex flex-row items-center justify-between">
            <DialogPrimitive.Title className="text-lg font-semibold">
              {fileName}
            </DialogPrimitive.Title>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div
            className="flex-1 overflow-auto"
            style={{
              height: isFullscreen ? "calc(95vh - 8rem)" : "calc(85vh - 8rem)"
            }}
          >
            {isPDF ? (
              <PDFViewer fileUrl={fileUrl} height="100%" width="100%" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-slate-100">
                <iframe
                  src={fileUrl}
                  className="w-full h-full border-0"
                  title={fileName}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex flex-row-reverse gap-2">
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
