"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, Maximize2, Minimize2 } from "lucide-react";
import { PDFViewer } from "./pdf-viewer";
import { toast } from "sonner";

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`${
          isFullscreen ? "max-w-[95vw] h-[95vh]" : "max-w-4xl"
        } p-0`}
      >
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
          <DialogTitle className="text-lg">{fileName}</DialogTitle>
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
        </DialogHeader>

        <div className={`${isFullscreen ? "h-[calc(95vh-8rem)]" : "h-[70vh]"}`}>
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

        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
