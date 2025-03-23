"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useGetResource,
  useCreateResource,
  useFileResource
} from "@/providers/dataProvider";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Upload,
  Download,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  evaluationTypeConfig,
  Subject,
  subjectTypeConfig
} from "@/types/entities";
import FileUpload from "@/components/file-upload";
import { toast } from "sonner";
import Lottie from "lottie-react";
import uploadAnimation from "@/../public/animations/upload.json";
import ocrAnimation from "@/../public/animations/ocr.json";
import { downloadFile } from "@/utils/file-helpers";

export default function SubmitEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadAnimation, setShowUploadAnimation] = useState(false);

  const { data: evaluation, isLoading } = useGetResource<Subject>(
    "subject",
    params.id as string
  );
  const { mutateAsync: createSubmission } = useFileResource("submission");

  if (isLoading) {
    return (
      <ContentLayout title="Dépôt d'évaluation">
        <div className="flex items-center justify-center min-h-[400px]">
          <Clock className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (!evaluation) {
    return (
      <ContentLayout title="Dépôt d'évaluation">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              Évaluation non trouvée
            </div>
          </CardContent>
        </Card>
      </ContentLayout>
    );
  }

  const now = new Date();
  const startDate = new Date(evaluation.startDate);
  const endDate = new Date(evaluation.endDate);
  const hasSubmitted = evaluation.submissions?.some(
    (submission) => submission.studentId === session?.user?.id
  );
  const canSubmit = now >= startDate && now <= endDate && !hasSubmitted;

  const getStatusInfo = () => {
    if (hasSubmitted) {
      return {
        icon: CheckCircle,
        label: "Rendu",
        color: "text-green-600",
        bgColor: "bg-green-50"
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

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    setIsSubmitting(true);
    setShowUploadAnimation(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("subjectId", evaluation.id.toString());
      formData.append("type", evaluation.type);

      await createSubmission(formData);

      toast.success("Votre travail a été déposé avec succès");

      setTimeout(() => {
        setShowUploadAnimation(false);
        router.push("/student/evaluation");
      }, 1500);
    } catch (error) {
      toast.error("Une erreur est survenue lors du dépôt");
      setShowUploadAnimation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submission = evaluation.submissions?.find(
    (s) => s.studentId === session?.user?.id
  );

  return (
    <ContentLayout title="Dépôt d'évaluation">
      {showUploadAnimation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-12 max-w-md w-full">
            <Lottie
              animationData={uploadAnimation}
              loop={true}
              style={{ width: 250, height: 250, margin: "0 auto" }}
            />
            <p className="text-center text-lg font-medium mt-4">
              Dépôt en cours...
            </p>
          </div>
        </div>
      )}

      {submission?.isCorrecting && (
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
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push("/student/evaluation")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux évaluations
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">{evaluation.title}</CardTitle>
                <CardDescription>
                  Déposez votre travail pour cette évaluation
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className={`${status.bgColor} ${status.color}`}
              >
                {React.createElement(status.icon, {
                  className: "h-4 w-4 mr-1"
                })}
                {status.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informations de l'évaluation */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Date de début</span>
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
                    <span>Date limite</span>
                  </div>
                  <div className="font-medium">
                    {format(endDate, "dd MMMM yyyy 'à' HH'h'mm", {
                      locale: fr
                    })}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Classe</span>
                </div>
                <div className="font-medium">{evaluation.classroom?.name}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground">{evaluation.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Sujet de l'évaluation</h3>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() =>
                  downloadFile(
                    evaluation.fileUrl,
                    `${evaluation.title}.${evaluation.type.toLowerCase()}`
                  )
                }
              >
                <Download className="h-4 w-4" />
                Télécharger le sujet
              </Button>
            </div>

            {canSubmit ? (
              <div className="space-y-4">
                <h3 className="font-semibold">Déposer votre travail</h3>
                <FileUpload
                  title="Déposer votre travail"
                  description={`Format accepté : ${evaluation.type}`}
                  buttonText="Choisir un fichier"
                  acceptedFileTypes={
                    subjectTypeConfig[evaluation.type].acceptedTypes
                  }
                  onFileSelect={handleFileSelect}
                  hideSubmitButton
                />
                {selectedFile && (
                  <div className="flex flex-col gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg text-blue-600 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <span>Fichier sélectionné : {selectedFile.name}</span>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedFile(null)}
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Clock className="h-4 w-4 animate-spin" />
                            Dépôt en cours...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Déposer le travail
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : hasSubmitted ? (
              <div className="p-4 bg-green-50 rounded-lg text-green-600 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Vous avez déjà rendu votre travail</span>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 rounded-lg text-yellow-600 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>
                  {now < startDate
                    ? "La période de soumission n'a pas encore commencé"
                    : "La période de soumission est terminée"}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
