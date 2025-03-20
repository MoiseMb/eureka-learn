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
  Users,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  BarChart as BarChartIcon,
  BookOpen,
  Activity,
  School
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { evaluationTypeConfig } from "@/types";
import { ProfessorStats } from "@/types/analytics";
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
  Cell
} from "recharts";

export function ProfessorDashboard(data: any) {
  const router = useRouter();

  console.log(data);

  // Valeurs par défaut sécurisées avec les bons types
  const stats: ProfessorStats = data || {
    totalSubjects: 0,
    totalStudents: 0,
    submissionsToCorrect: 0,
    correctionsByType: [],
    recentSubmissions: []
  };

  //   const correctionsByType = stats.correctionsByType?.map((item) => ({
  //     name:
  //       evaluationTypeConfig[item.evaluationType]?.label || item.evaluationType,
  //     value: item._count
  //   }));

  const COLORS = [
    "#4ade80",
    "#f97316",
    "#3b82f6",
    "#a855f7",
    "#ec4899",
    "#facc15"
  ];

  return (
    <ContentLayout title="Tableau de bord professeur">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {/* Statistiques générales */}
        <Card className="md:col-span-1 border-t-4 border-t-blue-500 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
              <CardDescription>Nombre total d'étudiants</CardDescription>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 border-t-4 border-t-green-500 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Matières</CardTitle>
              <CardDescription>Nombre total de matières</CardDescription>
            </div>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubjects}</div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 border-t-4 border-t-red-500 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">À corriger</CardTitle>
              <CardDescription>Rendus en attente</CardDescription>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.submissionsToCorrect}
            </div>
            {stats.submissionsToCorrect > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => router.push("/professor/submissions")}
              >
                Voir les rendus
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Répartition des corrections par type */}
        <Card className="md:col-span-2 md:row-span-2 border-t-4 border-t-purple-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Répartition des corrections
            </CardTitle>
            <CardDescription>Par type d'évaluation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {/* {correctionsByType.length > 0 ? (
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
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Corrections"]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aucune donnée disponible</p>
                  </div>
                </div>
              )} */}
            </div>
          </CardContent>
        </Card>

        {/* Rendus récents */}
        <Card className="col-span-full border-t-4 border-t-amber-500 shadow-md">
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
                  const config =
                    evaluationTypeConfig[submission.subject.evaluationType];

                  return (
                    <div
                      key={submission.id}
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
                          <h3 className="font-medium">
                            {submission.subject.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            <span>
                              {submission.student.firstName}{" "}
                              {submission.student.lastName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
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
                      <div className="flex items-center justify-end mt-auto">
                        <Button
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/professor/submissions/${submission.id}`
                            )
                          }
                        >
                          Corriger
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
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Button
              variant="outline"
              onClick={() => router.push("/professor/submissions")}
            >
              Voir tous les rendus
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ContentLayout>
  );
}
