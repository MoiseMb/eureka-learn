"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, X, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { evaluationTypeConfig, Subject } from "@/types/entities";
import { FileViewerDialog } from "@/components/file-viewer-dialog";
import { toast } from "sonner";

interface EvaluationDrawerProps {
  evaluation: Subject;
  isOpen: boolean;
  onClose: () => void;
}

export function EvaluationDrawer({
  evaluation,
  isOpen,
  onClose
}: EvaluationDrawerProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  if (!evaluation) return null;

  const config = evaluationTypeConfig[evaluation.evaluationType];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-[600px] sm:w-[540px]">
          <SheetHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-bold">
                {evaluation.title}
              </SheetTitle>
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-10rem)] py-6">
            <div className="space-y-6 pr-6">
              {/* Informations de base */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {React.createElement(config.icon, {
                    className: `h-5 w-5 ${config.color}`
                  })}
                  <Badge variant="outline" className={config.color}>
                    {config.label}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(evaluation.startDate), "dd MMMM yyyy", {
                        locale: fr
                      })}
                    </span>
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{evaluation.classrooms?.name}</span>
                  </div> */}
                </div>

                <p className="text-muted-foreground">
                  {evaluation.description}
                </p>
              </div>

              {/* Actions pour le fichier */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setIsViewerOpen(true)}
                >
                  <Eye className="h-4 w-4" />
                  Visualiser
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  asChild
                  onClick={async () => {
                    try {
                      const response = await fetch(evaluation.fileUrl);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `${
                        evaluation.title
                      }.${evaluation.type.toLowerCase()}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error("Erreur lors du téléchargement:", error);
                      toast.error("Erreur lors du téléchargement du fichier");
                    }
                  }}
                >
                  <Download className="h-4 w-4" />
                  Télécharger
                </Button>
              </div>
            </div>
          </ScrollArea>

          <SheetFooter className="border-t pt-4">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <FileViewerDialog
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        fileUrl={evaluation.fileUrl}
        fileName={evaluation.title}
      />
    </>
  );
}
