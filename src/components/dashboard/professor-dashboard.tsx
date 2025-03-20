"use client";

import React, { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Users,
  FileText,
  Clock,
  Calendar,
  BookOpen,
  Activity,
  Eye,
  FileCode,
  Bot,
  BrainCircuit,
  GraduationCap
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { evaluationTypeConfig, subjectTypeConfig } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from "recharts";
import { FileViewerDialog } from "../file-viewer-dialog";

export interface ProfessorStats {
  totalSubjects: number;
  totalStudents: number;
  submissionMetrics: {
    total: number;
    correcting: number;
    corrected: number;
    pending: number;
  };
  correctionsByType: any[];
  recentSubmissions: any[];
  correctionProgress: number;
}

export function ProfessorDashboard(props: any) {
  const router = useRouter();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isSubmissionViewerOpen, setIsSubmissionViewerOpen] = useState(false);

  const [file, setFile] = useState<string>("");
  const data = props.data || {};

  const stats: ProfessorStats = {
    totalSubjects: data.totalSubjects || 0,
    totalStudents: data.totalStudents || 0,
    submissionMetrics: data.submissionMetrics || {
      total: 0,
      correcting: 0,
      corrected: 0,
      pending: 0
    },
    correctionsByType: data.correctionsByType || [],
    recentSubmissions: data.recentSubmissions || [],
    correctionProgress: data.correctionProgress || 0
  };

  const correctionsByType = stats.correctionsByType.map(
    (item: {
      evaluationType: keyof typeof evaluationTypeConfig;
      _count: number;
    }) => ({
      name:
        evaluationTypeConfig[item.evaluationType]?.label || item.evaluationType,
      value: item._count || 0
    })
  );

  const activityData = [
    { name: "Lun", corrections: 4 },
    { name: "Mar", corrections: 7 },
    { name: "Mer", corrections: 5 },
    { name: "Jeu", corrections: 8 },
    { name: "Ven", corrections: 12 },
    { name: "Sam", corrections: 3 },
    { name: "Dim", corrections: 1 }
  ];

  const progressData = [
    {
      name: "Corrigés",
      value: stats.submissionMetrics.corrected,
      fill: "#3b82f6"
    },
    {
      name: "En cours",
      value: stats.submissionMetrics.correcting,
      fill: "#f59e0b"
    },
    {
      name: "En attente",
      value: stats.submissionMetrics.pending,
      fill: "#d1d5db"
    }
  ];

  const subjectTypesData = [
    { name: "PDF", value: 8, fill: "#ef4444" },
    { name: "Texte", value: 3, fill: "#3b82f6" },
    { name: "Markdown", value: 1, fill: "#10b981" }
  ];

  return (
    <ContentLayout title="Tableau de bord professeur">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
              <CardDescription>Nombre total d'étudiants</CardDescription>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalStudents}
            </div>
            <Progress value={100} className="h-1.5 mt-3 bg-blue-500" />
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Matières</CardTitle>
              <CardDescription>Nombre total de matières</CardDescription>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.totalSubjects}
            </div>
            <Progress value={100} className="h-1.5 mt-3 bg-green-500" />
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">À corriger</CardTitle>
              <CardDescription>Rendus en attente</CardDescription>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {stats.submissionMetrics.pending}
            </div>
            <Progress value={100} className="h-1.5 mt-3 bg-amber-500" />
            {stats.submissionMetrics.pending > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full text-amber-600 border-amber-300 hover:bg-amber-50"
                onClick={() => router.push("/professor/submissions")}
              >
                <Eye className="mr-2 h-4 w-4" />
                Voir les rendus
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                Activité récente
              </CardTitle>
              <CardDescription>Corrections par jour</CardDescription>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activityData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="corrections"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#3b82f6" }}
                    activeDot={{ r: 5, fill: "#2563eb" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Deuxième ligne - Statistiques détaillées */}
        <Card className="md:col-span-2 border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Répartition des corrections
            </CardTitle>
            <CardDescription>Par type d'évaluation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {correctionsByType.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={correctionsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {correctionsByType.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={Object.values(evaluationTypeConfig)
                            [
                              index % Object.values(evaluationTypeConfig).length
                            ].color.replace("text-", "#")
                            .replace("500", "")}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [value, "Corrections"]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        border: "none"
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune donnée disponible</p>
                  <p className="text-sm mt-2 max-w-md text-center">
                    Les données de répartition des corrections par type
                    d'évaluation s'afficheront ici une fois que des évaluations
                    auront été soumises et corrigées.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Progression des corrections
            </CardTitle>
            <CardDescription>État actuel des soumissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-blue-700">
                    Corrigés
                  </h3>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  {stats.submissionMetrics.corrected}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {stats.submissionMetrics.total > 0
                    ? `${Math.round(
                        (stats.submissionMetrics.corrected /
                          stats.submissionMetrics.total) *
                          100
                      )}% du total`
                    : "0% du total"}
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-amber-700">
                    En cours
                  </h3>
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-amber-600 mt-2">
                  {stats.submissionMetrics.correcting}
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  {stats.submissionMetrics.total > 0
                    ? `${Math.round(
                        (stats.submissionMetrics.correcting /
                          stats.submissionMetrics.total) *
                          100
                      )}% du total`
                    : "0% du total"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">
                    En attente
                  </h3>
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-600 mt-2">
                  {stats.submissionMetrics.pending}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {stats.submissionMetrics.total > 0
                    ? `${Math.round(
                        (stats.submissionMetrics.pending /
                          stats.submissionMetrics.total) *
                          100
                      )}% du total`
                    : "0% du total"}
                </p>
              </div>
            </div>

            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={progressData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [value, "Soumissions"]}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      border: "none"
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Troisième ligne - Rendus récents et informations sur EurekaLearn */}
        <Card className="md:col-span-3 border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Rendus récents
            </CardTitle>
            <CardDescription>
              Derniers travaux soumis par les étudiants
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentSubmissions && stats.recentSubmissions.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.recentSubmissions.map((submission) => {
                  // Récupération des configurations pour le type d'évaluation
                  const evaluationType = (submission.subject?.evaluationType ||
                    "POO_JAVA") as keyof typeof evaluationTypeConfig;
                  const evalConfig = evaluationTypeConfig[evaluationType];

                  // Récupération des configurations pour le type de sujet
                  const subjectType = (submission.type ||
                    "PDF") as keyof typeof subjectTypeConfig;
                  const typeConfig = subjectTypeConfig[subjectType];

                  // Détermination du statut
                  let statusBadge;
                  if (submission.isCorrected) {
                    statusBadge = (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        Corrigé
                      </Badge>
                    );
                  } else if (submission.isCorrecting) {
                    statusBadge = (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                        En cours
                      </Badge>
                    );
                  } else {
                    statusBadge = (
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                        En attente
                      </Badge>
                    );
                  }

                  return (
                    <div
                      key={submission.id}
                      className="flex flex-col p-4 border rounded-lg hover:bg-blue-50 transition-colors shadow-sm hover:shadow"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`p-2 rounded-full ${evalConfig.color
                            .replace("text-", "bg-")
                            .replace("500", "100")}`}
                        >
                          {React.createElement(evalConfig.icon || FileText, {
                            className: `h-5 w-5 ${evalConfig.color}`
                          })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">
                            {submission.subject?.title || "Sans titre"}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Users className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">
                              {submission.student?.firstName || ""}{" "}
                              {submission.student?.lastName || ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>
                              {format(
                                new Date(submission.submittedAt),
                                "dd MMM yyyy",
                                {
                                  locale: fr
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t">
                        {statusBadge}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={() => {
                            setFile(submission.fileUrl), setIsViewerOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Voir le sujet
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucun rendu récent</p>
                <p className="text-sm mt-2 max-w-md mx-auto">
                  Les rendus soumis par vos étudiants apparaîtront ici. Vous
                  pourrez suivre leur progression et consulter les corrections
                  automatiques.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Button
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => router.push("/professor/submissions")}
            >
              <Eye className="mr-2 h-4 w-4" />
              Voir tous les rendus
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-1 border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-blue-600" />
                EurekaLearn IA
              </div>
            </CardTitle>
            <CardDescription>Correction automatique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-center mb-4">
                <div className="relative h-32 w-32">
                  <div className="absolute inset-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        innerRadius="60%"
                        outerRadius="100%"
                        data={[
                          {
                            name: "Progress",
                            value: stats.correctionProgress * 100,
                            fill: "#3b82f6"
                          }
                        ]}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <RadialBar
                          background
                          dataKey="value"
                          cornerRadius={10}
                          fill="#3b82f6"
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {Math.round(stats.correctionProgress * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="font-medium text-center mb-2">Correction IA</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Notre IA analyse et corrige automatiquement les travaux de vos
                étudiants pour vous faire gagner du temps.
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    Analyse intelligente des réponses
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    Notation objective et cohérente
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Statistiques détaillées</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <FileViewerDialog
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        fileUrl={file}
        fileName={"evaluation"}
      />
    </ContentLayout>
  );
}

function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
