"use client";

import { useState } from "react";
import { useGetList } from "@/providers/dataProvider";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  Upload,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  GraduationCap,
  BookOpen,
  ArrowUpRight
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { evaluationTypeConfig, Subject } from "@/types/entities";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Badge } from "@/components/ui/badge";
import { EvaluationDrawer } from "./evaluation-drawer";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function StudentEvaluationListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedEvaluation, setSelectedEvaluation] = useState<Subject | null>(
    null
  );
  const router = useRouter();
  const { data: session } = useSession();

  const { data: evaluationsData } = useGetList("subject", {
    limit: 100,
    page: 1
  });

  const evaluations = evaluationsData?.data ?? [];

  const getStatusInfo = (evaluation: Subject) => {
    const now = new Date();
    const startDate = new Date(evaluation.startDate);
    const endDate = new Date(evaluation.endDate);
    const submission = evaluation.submissions?.find(
      (s) => s.studentId === session?.user?.id
    );

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
          label: "En correction",
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

  const getStatusBadge = (evaluation: Subject) => {
    const status = getStatusInfo(evaluation);
    return (
      <Badge variant="outline" className={`${status.bgColor} ${status.color}`}>
        {React.createElement(status.icon, { className: "h-4 w-4 mr-1" })}
        {status.label}
      </Badge>
    );
  };

  const filteredEvaluations = evaluations.filter((evaluation: any) => {
    const matchesSearch = evaluation.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "ALL" || evaluation.evaluationType === selectedType;

    const status = getStatusInfo(evaluation);
    const matchesStatus =
      selectedStatus === "ALL" || status.label === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <ContentLayout title="Mes évaluations">
      <div className="space-y-6">
        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  Mes évaluations
                </CardTitle>
                <CardDescription>
                  Consultez et déposez vos évaluations
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{evaluations.length} évaluation(s)</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Rechercher une évaluation..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type d'évaluation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les types</SelectItem>
                  {Object.entries(evaluationTypeConfig).map(
                    ([type, config]) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          {React.createElement(config.icon, {
                            className: `h-4 w-4 ${config.color}`
                          })}
                          {config.label}
                        </div>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[200px]">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="État" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les états</SelectItem>
                  <SelectItem value="UPCOMING">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />À venir
                    </div>
                  </SelectItem>
                  <SelectItem value="IN_PROGRESS">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      En cours
                    </div>
                  </SelectItem>
                  <SelectItem value="ENDED">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Terminé
                    </div>
                  </SelectItem>
                  <SelectItem value="SUBMITTED">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Rendu
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <AnimatePresence>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvaluations.map((evaluation: any) => {
                  const status = getStatusInfo(evaluation);
                  const now = new Date();
                  const startDate = new Date(evaluation.startDate);
                  const endDate = new Date(evaluation.endDate);
                  const hasSubmitted = evaluation.submissions?.some(
                    (submission: any) =>
                      submission.studentId === session?.user?.id
                  );
                  const canSubmit =
                    !hasSubmitted && now >= startDate && now <= endDate;

                  return (
                    <motion.div
                      key={evaluation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="group"
                    >
                      <Card className="h-full hover:border-primary transition-colors">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {evaluation.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {evaluation.description}
                              </p>
                            </div>
                            {getStatusBadge(evaluation)}
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Jusqu'au{" "}
                                {format(
                                  new Date(evaluation.endDate),
                                  "dd MMM yyyy",
                                  {
                                    locale: fr
                                  }
                                )}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {React.createElement(
                                evaluationTypeConfig[
                                  evaluation.evaluationType as keyof typeof evaluationTypeConfig
                                ].icon,
                                {
                                  className: `h-4 w-4 ${
                                    evaluationTypeConfig[
                                      evaluation.evaluationType as keyof typeof evaluationTypeConfig
                                    ].color
                                  }`
                                }
                              )}
                              <span className="text-sm">
                                {
                                  evaluationTypeConfig[
                                    evaluation.evaluationType as keyof typeof evaluationTypeConfig
                                  ].label
                                }
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2"
                                onClick={() =>
                                  setSelectedEvaluation(evaluation)
                                }
                              >
                                <Eye className="h-4 w-4" />
                                Voir
                                <ArrowUpRight className="h-3 w-3" />
                              </Button>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2"
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(
                                        evaluation.fileUrl
                                      );
                                      const blob = await response.blob();
                                      const url =
                                        window.URL.createObjectURL(blob);
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
                                  Sujet
                                </Button>
                                {canSubmit && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="flex items-center gap-2"
                                    onClick={() =>
                                      router.push(
                                        `/student/evaluation/${evaluation.id}/submit`
                                      )
                                    }
                                  >
                                    <Upload className="h-4 w-4" />
                                    Déposer
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}

                {filteredEvaluations.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-8 text-muted-foreground"
                  >
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune évaluation trouvée</p>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      <EvaluationDrawer
        evaluation={selectedEvaluation}
        isOpen={!!selectedEvaluation}
        onClose={() => setSelectedEvaluation(null)}
      />
    </ContentLayout>
  );
}
