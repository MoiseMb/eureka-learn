import React from "react";
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
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Calendar,
  FileText,
  Activity,
  Star,
  AlertCircle,
  BookMarked,
  Timer
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Correction, evaluationTypeConfig } from "@/types";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

export function StudentDashboard({ data }: any) {
  const router = useRouter();

  const stats = data || {
    totalSubmissions: 0,
    correctedSubmissions: 0,
    pendingSubmissions: 0,
    averageScore: 0,
    submissionsBySubject: [],
    recentCorrections: []
  };

  const completionRate =
    stats.totalSubmissions > 0
      ? (stats.correctedSubmissions / stats.totalSubmissions) * 100
      : 0;

  const successRate =
    stats.totalSubmissions > 0 && stats.successCount
      ? (stats.successCount / stats.totalSubmissions) * 100
      : 0;

  const onTimeRate =
    stats.totalSubmissions > 0 && stats.onTimeSubmissions
      ? (stats.onTimeSubmissions / stats.totalSubmissions) * 100
      : 0;

  // Données pour le graphique en camembert
  const submissionsBySubject =
    stats.submissionsBySubject?.map((item: any) => ({
      name: `Sujet ${item.subjectId}`,
      value: item._count
    })) || [];

  // Données pour le graphique d'évolution des notes
  const scoreEvolution = [
    { month: "Jan", score: 12 },
    { month: "Fév", score: 14 },
    { month: "Mar", score: 13 },
    { month: "Avr", score: 15 },
    { month: "Mai", score: 16 },
    { month: "Juin", score: 15.5 }
  ];

  const COLORS = ["#4ade80", "#f97316", "#3b82f6", "#a855f7", "#ec4899"];

  // Calcul du statut global
  const getStatusInfo = () => {
    if (stats.averageScore >= 16) {
      return {
        icon: Star,
        label: "Excellent",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100"
      };
    } else if (stats.averageScore >= 14) {
      return {
        icon: CheckCircle,
        label: "Très bien",
        color: "text-green-600",
        bgColor: "bg-green-100"
      };
    } else if (stats.averageScore >= 12) {
      return {
        icon: TrendingUp,
        label: "Bien",
        color: "text-blue-600",
        bgColor: "bg-blue-100"
      };
    } else if (stats.averageScore >= 10) {
      return {
        icon: Clock,
        label: "Passable",
        color: "text-orange-600",
        bgColor: "bg-orange-100"
      };
    } else {
      return {
        icon: AlertCircle,
        label: "À améliorer",
        color: "text-red-600",
        bgColor: "bg-red-100"
      };
    }
  };

  const status = getStatusInfo();

  return (
    <ContentLayout title="Tableau de bord étudiant">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {/* Carte de statut global */}
        <Card className="md:col-span-1 border-t-4 border-t-blue-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Statut global</CardTitle>
            <CardDescription>Votre performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <div className={`p-4 rounded-full ${status.bgColor} mb-3`}>
                {React.createElement(status.icon, {
                  className: `h-8 w-8 ${status.color}`
                })}
              </div>
              <div className="text-2xl font-bold">
                {stats.averageScore.toFixed(1)}/20
              </div>
              <Badge className="mt-2" variant="outline">
                {status.label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Carte des statistiques de rendus */}
        <Card className="md:col-span-2 border-t-4 border-t-green-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Rendus</CardTitle>
            <CardDescription>Suivi de vos travaux</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-500 mb-1" />
                <div className="text-xl font-bold">
                  {stats.totalSubmissions}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500 mb-1" />
                <div className="text-xl font-bold">
                  {stats.correctedSubmissions}
                </div>
                <div className="text-xs text-muted-foreground">Corrigés</div>
              </div>
              <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
                <Clock className="h-6 w-6 text-orange-500 mb-1" />
                <div className="text-xl font-bold">
                  {stats.pendingSubmissions}
                </div>
                <div className="text-xs text-muted-foreground">En attente</div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Taux de complétion</span>
                  <span className="font-medium">
                    {completionRate.toFixed(0)}%
                  </span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carte de progression */}
        <Card className="md:col-span-1 border-t-4 border-t-purple-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Progression</CardTitle>
            <CardDescription>Votre évolution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Taux de réussite</span>
                  <span className="font-medium">{successRate.toFixed(0)}%</span>
                </div>
                <Progress value={successRate} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Assiduité</span>
                  <span className="font-medium">{onTimeRate.toFixed(0)}%</span>
                </div>
                <Progress value={onTimeRate} className="h-2" />
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <BookMarked className="h-4 w-4 text-green-500" />
                    Meilleure matière
                  </span>
                  <span className="font-medium">
                    {stats.bestSubject || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Timer className="h-4 w-4 text-orange-500" />
                    Temps moyen
                  </span>
                  <span className="font-medium">
                    {stats.averageSubmissionTime || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-blue-500" />
                    Meilleure note
                  </span>
                  <span className="font-medium">
                    {stats.bestScore || "N/A"}/20
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Graphique de répartition des rendus */}
        <Card className="md:col-span-2 border-t-4 border-t-orange-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Répartition des rendus
            </CardTitle>
            <CardDescription>Par matière</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {submissionsBySubject.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={submissionsBySubject}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {submissionsBySubject.map((entry: any, index: any) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Rendus"]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aucune donnée disponible</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-t-4 border-t-red-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Évolution des notes
            </CardTitle>
            <CardDescription>Sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreEvolution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip formatter={(value) => [`${value}/20`, "Note"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    activeDot={{ r: 8 }}
                    name="Note moyenne"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full border-t-4 border-t-teal-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Corrections récentes
            </CardTitle>
            <CardDescription>Dernières évaluations corrigées</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentCorrections && stats.recentCorrections.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.recentCorrections.map((correction: Correction) => {
                  const subject = correction.submission.subject;
                  const config = evaluationTypeConfig[subject.evaluationType];

                  return (
                    <div
                      key={correction.id}
                      className="flex flex-col p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`p-2 rounded-full ${config?.color
                            .replace("text-", "bg-")
                            .replace("600", "100")}`}
                        >
                          {React.createElement(config?.icon || FileText, {
                            className: `h-5 w-5 ${config?.color}`
                          })}
                        </div>
                        <div>
                          <h3 className="font-medium">{subject.title}</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {format(
                                new Date(correction.correctedAt),
                                "dd MMM yyyy",
                                {
                                  locale: fr
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <Badge
                          variant="outline"
                          className={`${
                            correction?.score >= 10
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          Note: {correction.score}/20
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            router.push(
                              `/student/submissions/${correction.submissionId}`
                            )
                          }
                        >
                          Voir
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucune correction récente</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Button
              variant="outline"
              onClick={() => router.push("/student/results")}
            >
              Voir tous les résultats
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ContentLayout>
  );
}
