"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Download,
  Eye,
  Users,
  FileText,
  Clock,
  GraduationCap,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { evaluationTypeConfig, type Subject } from "@/types/entities";
import { FileViewerDialog } from "@/components/file-viewer-dialog";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

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

  const handleDownload = async () => {
    try {
      const response = await fetch(evaluation.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${evaluation.title}.${evaluation.type.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Téléchargement réussi");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement du fichier");
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-[600px] sm:w-[540px] p-0 bg-gradient-to-br from-white to-slate-50 my-6 ml-6 mr-4 rounded-xl shadow-2xl"
        >
          <SheetHeader className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl w-full">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8" />
                <h2 className="text-2xl font-bold">{evaluation.title}</h2>
              </div>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-none"
              >
                {config.label}
              </Badge>
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-16rem)] p-6">
            <div className="space-y-8">
              {/* Status Card */}
              <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-none">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium text-emerald-700">
                    Évaluation en cours
                  </span>
                </div>
              </Card>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {format(
                          new Date(evaluation.startDate),
                          "dd MMMM yyyy",
                          {
                            locale: fr
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-purple-100">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Classe</p>
                      <p className="font-medium">
                        {evaluation.classroom?.name}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Description */}
              <Card className="p-6 bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {evaluation.description}
                </p>
              </Card>

              {/* File Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20"
                  onClick={() => setIsViewerOpen(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Visualiser
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-2 hover:bg-slate-50"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          </ScrollArea>

          <SheetFooter className="p-6 border-t">
            <Button variant="outline" onClick={onClose} className="w-full">
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
