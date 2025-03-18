"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { Document, Page } from "react-pdf";
import { useState } from "react";

interface FileViewerDialogProps {
  url: string;
  title: string;
}

export function FileViewerDialog({ url, title }: FileViewerDialogProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const isPDF = url?.toLowerCase().endsWith(".pdf");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isPDF ? (
            <div className="flex flex-col items-center">
              <Document
                file={url}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                className="max-h-[70vh] overflow-auto"
              >
                <Page
                  pageNumber={pageNumber}
                  width={800}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
              {numPages && numPages > 1 && (
                <div className="flex items-center gap-4 mt-4">
                  <Button
                    onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                    disabled={pageNumber <= 1}
                  >
                    Précédent
                  </Button>
                  <span>
                    Page {pageNumber} sur {numPages}
                  </span>
                  <Button
                    onClick={() =>
                      setPageNumber(Math.min(numPages, pageNumber + 1))
                    }
                    disabled={pageNumber >= numPages}
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8">
              <p>Ce type de fichier ne peut pas être prévisualisé.</p>
              <Button
                className="mt-4"
                onClick={() => window.open(url, "_blank")}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger le fichier
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
