"use client";

import { useState } from "react";
import { useGetList } from "@/providers/dataProvider";
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
  Pencil,
  Trash2,
  Plus,
  FileText,
  Users,
  Code2,
  Terminal,
  Database,
  FileCode2,
  Binary,
  Blocks
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { evaluationTypeConfig, subjectTypeConfig } from "@/types/entities";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { EvaluationDrawer } from "./evaluation-drawer";
import { toast } from "sonner";

export default function EvaluationListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedClassroom, setSelectedClassroom] = useState<string>("ALL");
  const router = useRouter();
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null);

  const { data: evaluationsData, isLoading } = useGetList("subject", {
    limit: 100,
    page: 1
  });

  const { data: classroomsData } = useGetList("classroom/my-classes", {
    limit: 100,
    page: 1
  });

  const evaluations = evaluationsData?.data ?? [];
  const classrooms = classroomsData?.data ?? [];

  const filteredEvaluations = evaluations.filter((evaluation: any) => {
    const matchesSearch = evaluation.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "ALL"
        ? true
        : evaluation.evaluationType === selectedType;
    const matchesClassroom =
      selectedClassroom === "ALL"
        ? true
        : evaluation.classroomId === selectedClassroom;
    return matchesSearch && matchesType && matchesClassroom;
  });

  const getEvaluationTypeConfig = (type: string) => {
    const icons = {
      POO_JAVA: Code2,
      C_LANGUAGE: Terminal,
      SQL: Database,
      PYTHON: FileCode2,
      ALGORITHMS: Binary,
      DATA_STRUCTURES: Blocks
    };

    return {
      label: type,
      icon: icons[type as keyof typeof icons] || FileText,
      color: "text-gray-500",
      description: type
    };
  };

  const getSubjectTypeConfig = (type: string) => {
    return {
      label: type,
      icon: FileText,
      color: "text-gray-500"
    };
  };

  return (
    <ContentLayout title="Liste des évaluations">
      <div className="space-y-6">
        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Mes évaluations</CardTitle>
                <CardDescription>
                  Gérez et consultez vos évaluations
                </CardDescription>
              </div>
              <Button
                onClick={() => router.push("/professor/evaluation/create")}
                className="flex items-center gap-2 h-12 text-lg"
              >
                <Plus className="h-4 w-4" />
                Nouvelle évaluation
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
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
                  <SelectValue placeholder="Type d'évaluation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Tous les types
                    </div>
                  </SelectItem>
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

              <Select
                value={selectedClassroom}
                onValueChange={setSelectedClassroom}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrer par classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Toutes les classes
                    </div>
                  </SelectItem>
                  {classrooms.map((classroom: any) => (
                    <SelectItem key={classroom.id} value={classroom.id}>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {classroom.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <AnimatePresence>
              <div className="grid gap-4">
                {filteredEvaluations.map((evaluation: any, index: number) => (
                  <motion.div
                    key={evaluation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              {React.createElement(
                                getEvaluationTypeConfig(evaluation.type).icon,
                                {
                                  className: `h-5 w-5 ${
                                    getEvaluationTypeConfig(evaluation.type)
                                      .color
                                  }`
                                }
                              )}
                              <h3 className="text-lg font-semibold">
                                {evaluation.title}
                              </h3>
                              <Badge variant="outline">
                                {getEvaluationTypeConfig(evaluation.type).label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <Badge
                                variant="secondary"
                                className={`${
                                  getEvaluationTypeConfig(
                                    evaluation.evaluationType
                                  ).color
                                } bg-opacity-10`}
                              >
                                <div className="flex items-center gap-2">
                                  {React.createElement(
                                    getEvaluationTypeConfig(
                                      evaluation.evaluationType
                                    ).icon,
                                    {
                                      className: "h-4 w-4"
                                    }
                                  )}
                                  {
                                    getEvaluationTypeConfig(
                                      evaluation.evaluationType
                                    ).label
                                  }
                                </div>
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`${
                                  getSubjectTypeConfig(evaluation.type).color
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {React.createElement(
                                    getSubjectTypeConfig(evaluation.type).icon,
                                    {
                                      className: "h-4 w-4"
                                    }
                                  )}
                                  {getSubjectTypeConfig(evaluation.type).label}
                                </div>
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(evaluation.startDate), "Pp", {
                                  locale: fr
                                })}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {evaluation.classroom?.name || "Aucune classe"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setSelectedEvaluation(evaluation)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={async () => {
                                try {
                                  const response = await fetch(
                                    evaluation.fileUrl
                                  );
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
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                router.push(
                                  `/professor/evaluation/${evaluation.id}/edit`
                                )
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {filteredEvaluations.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-muted-foreground"
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
