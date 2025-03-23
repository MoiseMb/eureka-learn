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
  GraduationCap,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { evaluationTypeConfig, type Subject } from "@/types/entities";
import { FileViewerDialog } from "@/components/file-viewer-dialog";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { downloadFile } from "@/utils/file-helpers";
import { Player } from "@lottiefiles/react-lottie-player";

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
  const router = useRouter();

  if (!evaluation) return null;

  const config = evaluationTypeConfig[evaluation.evaluationType];
  const submissionCount = evaluation.submissions?.length ?? 0;
  const correctedCount =
    evaluation.submissions?.filter((s) => s.isCorrected).length ?? 0;

  const handleDownload = () => {
    downloadFile(
      evaluation.fileUrl,
      `${evaluation.title}.${evaluation.type.toLowerCase()}`
    ).catch(() => {
      toast.error("Erreur lors du téléchargement du fichier");
    });
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-[600px] sm:w-[540px] p-0 bg-gradient-to-br from-white to-slate-50 my-6 ml-6 mr-4 rounded-xl shadow-2xl"
        >
          <div className="h-full flex flex-col">
            <SheetHeader className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-t-xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold">{evaluation.title}</h2>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-white/10 text-white border-none hover:bg-white/20"
                >
                  {config.label}
                </Badge>
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {/* Status Card */}
                <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-none shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-emerald-700">
                          État de l'évaluation
                        </p>
                        <p className="text-sm text-emerald-600">
                          {correctedCount}/{submissionCount} copies corrigées
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {evaluation.isCorrecting && (
                  <Card className="overflow-hidden border-none shadow-sm">
                    <div className="p-4 bg-blue-50">
                      <Player
                        autoplay
                        loop
                        src={
                          "https://lottie.host/c9e9dae2-3bbf-485a-86ab-d4da15462536/U0GRLjtp7C.json"
                        }
                        style={{ height: "70%", width: "50%" }}
                      />
                      <p className="text-center text-blue-700 font-medium mt-2">
                        L'IA analyse actuellement le sujet...
                      </p>
                    </div>
                  </Card>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-50">
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
                      <div className="p-2 rounded-full bg-purple-50">
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

                <Card className="p-6 bg-white shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {evaluation.description}
                  </p>
                </Card>
              </div>
            </ScrollArea>

            <div className="p-6 border-t bg-white/50 backdrop-blur-sm rounded-b-xl">
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/20"
                  onClick={() =>
                    router.push(`/professor/evaluation/${evaluation.id}/grades`)
                  }
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Accéder aux notes
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="bg-white hover:bg-gray-50/80"
                    onClick={() => setIsViewerOpen(true)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visualiser
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white hover:bg-gray-50/80"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-white hover:bg-gray-50/80"
                  onClick={onClose}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
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
