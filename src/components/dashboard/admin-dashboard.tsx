import React from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Users,
  UserCog,
  FileText,
  CheckCircle,
  TrendingUp,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Activity,
  Settings
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { evaluationTypeConfig } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

// Définition des types pour les données du dashboard
interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  avgResponseTime: number;
  requestsPerMinute: number;
}

interface ClassroomStat {
  id: number;
  name: string;
  studentCount: number;
  evaluationCount: number;
  completionRate: number;
  averageScore: number | null;
}

interface AdminStats {
  totalStudents: number;
  totalProfessors: number;
  totalEvaluations: number;
  totalSubmissions: number;
  completionRate: number;
  averageScore: number;
  activeEvaluations: number;
  totalClassrooms: number;
  systemStats: SystemStats;
}

interface EvaluationTypeData {
  type: string;
  count: number;
}

interface ScoreByType {
  type: string;
  averageScore: number;
}

interface SubmissionTimeData {
  date: string;
  submissions: number;
  evaluations: number;
}

interface AdminDashboardData {
  stats: AdminStats;
  evaluationsByType: EvaluationTypeData[];
  submissionsOverTime: SubmissionTimeData[];
  scoresByType: ScoreByType[];
  classroomStats: ClassroomStat[];
}

interface AdminDashboardProps {
  data: AdminDashboardData;
}

export function AdminDashboard(data: any) {
  const router = useRouter();

  const stats: AdminStats = data?.stats || {
    totalStudents: 0,
    totalProfessors: 0,
    totalEvaluations: 0,
    totalSubmissions: 0,
    completionRate: 0,
    averageScore: 0,
    activeEvaluations: 0,
    totalClassrooms: 0,
    systemStats: {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      avgResponseTime: 0,
      requestsPerMinute: 0
    }
  };

  const evaluationsByType: EvaluationTypeData[] = data?.evaluationsByType || [];
  const submissionsOverTime: SubmissionTimeData[] =
    data?.submissionsOverTime || [];
  const scoresByType: ScoreByType[] = data?.scoresByType || [];
  const classroomStats: ClassroomStat[] = data?.classroomStats || [];

  const COLORS = [
    "#4ade80",
    "#f97316",
    "#3b82f6",
    "#a855f7",
    "#ec4899",
    "#facc15"
  ];

  return (
    <ContentLayout title="Tableau de bord administrateur">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Statistiques générales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
              <CardDescription>Nombre total d'étudiants</CardDescription>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Répartis dans {stats.totalClassrooms} classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Professeurs</CardTitle>
              <CardDescription>Nombre total de professeurs</CardDescription>
            </div>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProfessors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Évaluations</CardTitle>
              <CardDescription>Nombre total d'évaluations</CardDescription>
            </div>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvaluations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.activeEvaluations} évaluations en cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Rendus</CardTitle>
              <CardDescription>Nombre total de rendus</CardDescription>
            </div>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Taux de complétion: {stats.completionRate.toFixed(1)}%
            </p>
            <Progress value={stats.completionRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        {/* Graphiques */}
        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle>Activité de la plateforme</CardTitle>
            <CardDescription>
              Évolution des rendus sur les 30 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {submissionsOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={submissionsOverTime}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="submissions"
                      name="Rendus"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="evaluations"
                      name="Évaluations créées"
                      stroke="#f97316"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aucune donnée d'activité disponible</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle>Répartition des évaluations</CardTitle>
            <CardDescription>Par type d'évaluation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {evaluationsByType.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={evaluationsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="type"
                      label={({
                        name,
                        percent
                      }: {
                        name: keyof typeof evaluationTypeConfig;
                        percent: number;
                      }) => {
                        const config = evaluationTypeConfig[name];
                        return config
                          ? `${config.label} ${(percent * 100).toFixed(0)}%`
                          : `${name} ${(percent * 100).toFixed(0)}%`;
                      }}
                    >
                      {evaluationsByType.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(
                        value,
                        name: keyof typeof evaluationTypeConfig
                      ) => {
                        const config = evaluationTypeConfig[name];
                        return [value, config ? config.label : name];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <PieChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aucune donnée disponible</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Notes moyennes par type d'évaluation</CardTitle>
            <CardDescription>Performance globale des étudiants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {scoresByType.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={scoresByType}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="type"
                      tickFormatter={(
                        value: keyof typeof evaluationTypeConfig
                      ) => {
                        const config = evaluationTypeConfig[value];
                        return config ? config.label : value;
                      }}
                    />
                    <YAxis domain={[0, 20]} />
                    <Tooltip
                      formatter={(value) => [`${value}/20`, "Note moyenne"]}
                      labelFormatter={(
                        value: keyof typeof evaluationTypeConfig
                      ) => {
                        const config = evaluationTypeConfig[value];
                        return config ? config.label : value;
                      }}
                    />
                    <Bar
                      dataKey="averageScore"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Note moyenne"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <BarChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aucune donnée de notes disponible</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistiques par classe */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Statistiques par classe</CardTitle>
            <CardDescription>
              Performance et activité par classe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {classroomStats.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Classe</th>
                      <th className="text-left py-3 px-4">Étudiants</th>
                      <th className="text-left py-3 px-4">Évaluations</th>
                      <th className="text-left py-3 px-4">
                        Taux de complétion
                      </th>
                      <th className="text-left py-3 px-4">Note moyenne</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classroomStats.map((classroom) => (
                      <tr
                        key={classroom.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-3 px-4 font-medium">
                          {classroom.name}
                        </td>
                        <td className="py-3 px-4">{classroom.studentCount}</td>
                        <td className="py-3 px-4">
                          {classroom.evaluationCount}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={classroom.completionRate}
                              className="h-2 w-24"
                            />
                            <span>{classroom.completionRate.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">
                            {classroom.averageScore
                              ? classroom.averageScore.toFixed(1)
                              : "N/A"}
                            /20
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune donnée de classe disponible</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistiques système */}
        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle>Performance système</CardTitle>
            <CardDescription>
              Statistiques de performance de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Utilisation CPU</span>
                  <span>{stats.systemStats.cpuUsage}%</span>
                </div>
                <Progress value={stats.systemStats.cpuUsage} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Utilisation mémoire</span>
                  <span>{stats.systemStats.memoryUsage}%</span>
                </div>
                <Progress
                  value={stats.systemStats.memoryUsage}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Espace disque</span>
                  <span>{stats.systemStats.diskUsage}%</span>
                </div>
                <Progress value={stats.systemStats.diskUsage} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    Temps de réponse moyen
                  </div>
                  <div className="text-xl font-semibold">
                    {stats.systemStats.avgResponseTime} ms
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    Requêtes par minute
                  </div>
                  <div className="text-xl font-semibold">
                    {stats.systemStats.requestsPerMinute}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>
                Accès rapide aux fonctionnalités principales
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push("/admin/users/create")}
              >
                <Users className="h-6 w-6" />
                <span>Ajouter un utilisateur</span>
              </Button>
              <Button
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push("/admin/classrooms/create")}
              >
                <Users className="h-6 w-6" />
                <span>Créer une classe</span>
              </Button>
              <Button
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                variant="outline"
                onClick={() => router.push("/admin/reports")}
              >
                <BarChartIcon className="h-6 w-6" />
                <span>Rapports détaillés</span>
              </Button>
              <Button
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                variant="outline"
                onClick={() => router.push("/admin/settings")}
              >
                <Settings className="h-6 w-6" />
                <span>Paramètres système</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
