import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface PDFViewerProps {
  fileUrl: string;
  fileName?: string;
  height?: string | number;
  width?: string | number;
}

export function PDFViewer({
  fileUrl,
  fileName,
  height = "100%",
  width = "100%"
}: PDFViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier si l'URL est valide
  useEffect(() => {
    if (!fileUrl) {
      setError("URL du fichier non spécifiée");
      setLoading(false);
      return;
    }

    // Vérifier si c'est un PDF
    if (
      !fileUrl.toLowerCase().endsWith(".pdf") &&
      !fileUrl.toLowerCase().includes("pdf")
    ) {
      setError("Le fichier n'est pas un PDF");
      setLoading(false);
    }
  }, [fileUrl]);

  // Gérer le chargement
  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setError("Impossible de charger le PDF");
    setLoading(false);
  };

  // Construire l'URL pour Google PDF Viewer
  const pdfViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
    fileUrl
  )}&embedded=true`;

  return (
    <div className="relative w-full h-full flex flex-col">
      {fileName && (
        <div className="bg-slate-100 p-2 text-sm font-medium border-b">
          {fileName}
        </div>
      )}

      <div className="relative flex-1" style={{ height, width }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-sm text-slate-600">
              Chargement du document...
            </span>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-600 p-4">
            <p>{error}</p>
          </div>
        ) : (
          <iframe
            src={pdfViewerUrl}
            className="w-full h-full border-0"
            onLoad={handleLoad}
            onError={handleError}
            title={fileName || "PDF Viewer"}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )}
      </div>
    </div>
  );
}
