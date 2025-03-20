"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
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
import {
  Calendar,
  Users,
  FileText,
  Download,
  X,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  GraduationCap,
  BookOpen,
  Info,
  School,
  Upload
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { evaluationTypeConfig, Subject } from "@/types/entities";
import { FileViewerDialog } from "@/components/file-viewer-dialog";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import ocrAnimation from "@/../public/animations/ocr.json";

interface EvaluationDrawerProps {
  evaluation: Subject | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EvaluationDrawer({
  evaluation,
  isOpen,
  onClose
}: EvaluationDrawerProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmissionViewerOpen, setIsSubmissionViewerOpen] = useState(false);

  if (!evaluation) return null;

  const now = new Date();
  const startDate = new Date(evaluation.startDate);
  const endDate = new Date(evaluation.endDate);
  const hasSubmitted = evaluation.submissions?.some(
    (submission) => submission.studentId === session?.user?.id
  );
  const canSubmit = !hasSubmitted && now >= startDate && now <= endDate;
  const config = evaluationTypeConfig[evaluation.evaluationType];

  const submission = evaluation.submissions?.find(
    (s) => s.studentId === session?.user?.id
  );

  const getStatusInfo = () => {
    if (submission) {
      if (submission.isCorrected) {
        return {
          icon: CheckCircle,
          label: "Corrigé",
          color: "text-green-600",
          bgColor: "bg-green-50"
        };
      }
      if (submission.isCorrecting) {
        return {
          icon: Clock,
          label: "En cours de correction",
          color: "text-blue-600",
          bgColor: "bg-blue-50"
        };
      }
      return {
        icon: CheckCircle,
        label: "Rendu",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50"
      };
    }

    if (now < startDate) {
      return {
        icon: Clock,
        label: "À venir",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50"
      };
    }
    if (now > endDate) {
      return {
        icon: XCircle,
        label: "Terminé",
        color: "text-red-600",
        bgColor: "bg-red-50"
      };
    }
    return {
      icon: Clock,
      label: "En cours",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    };
  };

  const status = getStatusInfo();

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-[600px]">
          <SheetHeader className="space-y-4">
            <div className="flex justify-between items-start">
              <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                <School className={`h-6 w-6 ${config.color}`} />
                {evaluation.title}
              </SheetTitle>
              <Badge
                variant="outline"
                className={`${status.bgColor} ${status.color} mt-3`}
              >
                {React.createElement(status.icon, {
                  className: "h-4 w-4 mr-1"
                })}
                {status.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {React.createElement(config.icon, {
                className: `h-4 w-4 ${config.color}`
              })}
              <span>{config.label}</span>
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="space-y-6 pb-6">
              <div className="rounded-lg border bg-card p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Début</span>
                    </div>
                    <div className="font-medium">
                      {format(startDate, "dd MMMM yyyy 'à' HH'h'mm", {
                        locale: fr
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Fin</span>
                    </div>
                    <div className="font-medium">
                      {format(endDate, "dd MMMM yyyy 'à' HH'h'mm", {
                        locale: fr
                      })}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Classe</span>
                  </div>
                  <div className="font-medium">
                    {evaluation.classroom?.name}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  Description
                </h3>
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-muted-foreground">
                    {evaluation.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  Sujet
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center gap-2"
                    onClick={() => setIsViewerOpen(true)}
                  >
                    <Eye className="h-4 w-4" />
                    Visualiser le sujet
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center gap-2"
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

              {hasSubmitted && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Statut de rendu
                  </h3>

                  <div
                    className={`rounded-lg ${status.bgColor} p-4 ${status.color} flex-col items-center justify-center gap-2`}
                  >
                    {submission?.isCorrecting && (
                      <Lottie
                        animationData={ocrAnimation}
                        loop={true}
                        style={{ width: 500, height: 200, margin: "0 auto" }}
                      />
                    )}

                    <span className="flex my-auto items-center justify-center">
                      {React.createElement(status.icon, {
                        className: "h-5 w-5 flex-shrink-0"
                      })}
                      {status.label === "Corrigé"
                        ? "Votre travail a été corrigé"
                        : status.label === "En cours de correction"
                        ? "Votre travail est en cours de correction"
                        : "Vous avez rendu votre travail"}
                    </span>

                    {submission && (
                      <div className="mt-4 flex items-center gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 flex items-center gap-2"
                          onClick={() => setIsSubmissionViewerOpen(true)}
                        >
                          <Eye className="h-4 w-4" />
                          Voir mon travail
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 flex items-center gap-2"
                          onClick={async () => {
                            try {
                              const response = await fetch(submission.fileUrl);
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.download = `${
                                evaluation.title
                              }_mon_travail.${evaluation.type.toLowerCase()}`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              window.URL.revokeObjectURL(url);
                            } catch (error) {
                              console.error(
                                "Erreur lors du téléchargement:",
                                error
                              );
                              toast.error(
                                "Erreur lors du téléchargement du fichier"
                              );
                            }
                          }}
                        >
                          <Download className="h-4 w-4" />
                          Télécharger
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {canSubmit && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Upload className="h-4 w-4 text-blue-600" />
                    Action disponible
                  </h3>
                  <div className="rounded-lg bg-blue-50 p-4 text-blue-600">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => {
                        onClose();
                        router.push(
                          `/student/evaluation/${evaluation.id}/submit`
                        );
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Déposer mon travail
                    </Button>
                  </div>
                </div>
              )}
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

      <FileViewerDialog
        isOpen={isSubmissionViewerOpen}
        onClose={() => setIsSubmissionViewerOpen(false)}
        fileUrl={submission?.fileUrl || ""}
        fileName={`${evaluation.title} - Mon travail`}
      />

      {/* {submission?.isCorrecting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-12 max-w-md w-full">
            <Lottie
              animationData={ocrAnimation}
              loop={true}
              style={{ width: 250, height: 250, margin: "0 auto" }}
            />
            <p className="text-center text-lg font-medium mt-4">
              Votre travail est en cours de correction...
            </p>
          </div>
        </div>
      )} */}
    </>
  );
}
