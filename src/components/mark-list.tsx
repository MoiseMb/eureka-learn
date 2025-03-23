"use client";

import { useState, useMemo } from "react";
import {
  Eye,
  ArrowUpDown,
  Edit2,
  Save,
  X,
  Filter,
  CheckCircle,
  XCircle,
  FileText,
  Users,
  Calendar,
  ChevronDown
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileViewerDialog } from "@/components/file-viewer-dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { StudentGradesResponse } from "@/types";

export type EvaluationGradesViewProps = {
  data: StudentGradesResponse;
  onViewSubmission: (fileUrl: string, studentName: string) => void;
  onSaveGrade: (
    studentId: number,
    submissionId: number,
    score: number,
    notes: string
  ) => Promise<void>;
  maxScore?: number;
};

export default function EvaluationGradesView({
  data,
  onViewSubmission,
  onSaveGrade,
  maxScore = 20
}: EvaluationGradesViewProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [editingStudent, setEditingStudent] = useState<number | null>(null);
  const [editScore, setEditScore] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "lastName",
    direction: "asc"
  });
  const [filter, setFilter] = useState<
    "all" | "submitted" | "passed" | "failed"
  >("all");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState({
    url: "",
    studentName: ""
  });
  const [viewMode, setViewMode] = useState<"table" | "cards">(
    isMobile ? "cards" : "table"
  );

  // Statistiques
  const submittedCount = data.students.filter(
    (student) => student.submission !== null
  ).length;

  const grades = data.students
    .filter(
      (student) =>
        student.submission?.correction?.score !== null &&
        student.submission?.correction?.score !== undefined
    )
    .map((student) => student.submission!.correction!.score!);

  const averageGrade =
    grades.length > 0
      ? Math.round(
          (grades.reduce((sum, grade) => sum + grade, 0) / grades.length) * 100
        ) / 100
      : 0;

  const highestGrade = grades.length > 0 ? Math.max(...grades) : 0;
  const lowestGrade = grades.length > 0 ? Math.min(...grades) : 0;
  const passedCount = grades.filter((grade) => grade >= maxScore / 2).length;

  // Filtrage et tri des étudiants
  const filteredStudents = useMemo(() => {
    let result = [...data.students];

    switch (filter) {
      case "submitted":
        result = result.filter((student) => student.submission !== null);
        break;
      case "passed":
        result = result.filter(
          (student) =>
            student.submission?.correction?.score !== null &&
            student.submission?.correction?.score !== undefined &&
            student.submission?.correction?.score >= maxScore / 2
        );
        break;
      case "failed":
        result = result.filter(
          (student) =>
            student.submission?.correction?.score !== null &&
            student.submission?.correction?.score !== undefined &&
            student.submission?.correction?.score < maxScore / 2
        );
        break;
    }

    result.sort((a, b) => {
      if (sortConfig.key === "lastName") {
        return sortConfig.direction === "asc"
          ? a.lastName.localeCompare(b.lastName)
          : b.lastName.localeCompare(a.lastName);
      }

      if (sortConfig.key === "score") {
        const scoreA = a.submission?.correction?.score ?? -1;
        const scoreB = b.submission?.correction?.score ?? -1;
        return sortConfig.direction === "asc"
          ? scoreA - scoreB
          : scoreB - scoreA;
      }

      if (sortConfig.key === "submittedAt") {
        const dateA = a.submission?.submittedAt
          ? new Date(a.submission.submittedAt).getTime()
          : 0;
        const dateB = b.submission?.submittedAt
          ? new Date(b.submission.submittedAt).getTime()
          : 0;
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      return 0;
    });

    return result;
  }, [data.students, filter, sortConfig, maxScore]);

  // Gestionnaires d'événements
  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const startEditing = (student: StudentGradesResponse["students"][0]) => {
    if (!student.submission || student.submission.isCorrecting) return;

    setEditingStudent(student.id);
    setEditScore(student.submission.correction?.score ?? null);
    setEditNotes(student.submission.correction?.notes ?? "");
  };

  const cancelEditing = () => {
    setEditingStudent(null);
    setEditScore(null);
    setEditNotes("");
  };

  const saveGrade = async (student: StudentGradesResponse["students"][0]) => {
    if (
      !student.submission ||
      editScore === null ||
      student.submission.isCorrecting
    ) {
      return;
    }

    try {
      await onSaveGrade(
        student.id,
        student.submission.id,
        editScore,
        editNotes
      );
      toast.success("Note enregistrée", {
        description: `La note de ${student.firstName} ${student.lastName} a été mise à jour.`
      });
      cancelEditing();
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible d'enregistrer la note. Veuillez réessayer."
      });
    }
  };

  const handleViewSubmission = (fileUrl: string, studentName: string) => {
    setSelectedFile({ url: fileUrl, studentName });
    setIsViewerOpen(true);
  };

  // Utilitaires
  const getScoreColor = (score: number) => {
    const percentage = score / maxScore;
    if (percentage < 0.5) return "text-red-500 dark:text-red-400";
    if (percentage < 0.7) return "text-orange-500 dark:text-orange-400";
    if (percentage < 0.9) return "text-emerald-500 dark:text-emerald-400";
    return "text-green-600 dark:text-green-400";
  };

  // Mise à jour du mode d'affichage en fonction de la taille de l'écran
  React.useEffect(() => {
    setViewMode(isMobile ? "cards" : "table");
  }, [isMobile]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {data.subject.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground mt-1">
            <Users className="h-4 w-4" />
            <span>{data.subject.classroom.name}</span>
            <span className="text-muted-foreground/50">•</span>
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(data.subject.endDate), "d MMMM yyyy", {
                locale: fr
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setViewMode(viewMode === "table" ? "cards" : "table")
            }
          >
            {viewMode === "table" ? (
              <div className="flex items-center gap-1">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-1.5 h-1.5 rounded-sm bg-current"></div>
                  <div className="w-1.5 h-1.5 rounded-sm bg-current"></div>
                  <div className="w-1.5 h-1.5 rounded-sm bg-current"></div>
                  <div className="w-1.5 h-1.5 rounded-sm bg-current"></div>
                </div>
                <span className="ml-1.5">Cartes</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span className="ml-1.5">Tableau</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 dark:text-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Soumissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {submittedCount}/{data.students.length}
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              {Math.round((submittedCount / data.students.length) * 100)}% de
              participation
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 dark:text-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {averageGrade}/{maxScore}
            </div>
            <p className="text-sm text-emerald-600 dark:text-emerald-300">
              {passedCount} élèves ont la moyenne (
              {Math.round((passedCount / (grades.length || 1)) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 dark:text-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Note la plus haute
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {highestGrade}/{maxScore}
            </div>
            <p className="text-sm text-green-600 dark:text-green-300">
              {grades.filter((g) => g === highestGrade).length} élève(s)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 dark:text-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
              Note la plus basse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              {lowestGrade}/{maxScore}
            </div>
            <p className="text-sm text-red-600 dark:text-red-300">
              {grades.filter((g) => g === lowestGrade).length} élève(s)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {filter === "all" && "Tous les élèves"}
              {filter === "submitted" && "Soumissions uniquement"}
              {filter === "passed" && "Élèves ayant la moyenne"}
              {filter === "failed" && "Élèves n'ayant pas la moyenne"}
              <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilter("all")}>
              <FileText className="h-4 w-4 mr-2" />
              Tous les élèves
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("submitted")}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Soumissions uniquement
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("passed")}>
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Élèves ayant la moyenne
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("failed")}>
              <XCircle className="h-4 w-4 mr-2 text-red-500" />
              Élèves n'ayant pas la moyenne
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden md:flex gap-2">
          <Badge
            variant={filter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("all")}
          >
            Tous
          </Badge>
          <Badge
            variant={filter === "submitted" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("submitted")}
          >
            Soumis uniquement
          </Badge>
          <Badge
            variant={filter === "passed" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("passed")}
          >
            Moyenne ≥ {maxScore / 2}
          </Badge>
          <Badge
            variant={filter === "failed" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("failed")}
          >
            Moyenne &lt; {maxScore / 2}
          </Badge>
        </div>
      </div>

      {/* Contenu principal - Tableau ou Cartes */}
      {viewMode === "table" ? (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort("lastName")}
                  >
                    Élève
                    <ArrowUpDown
                      className={`h-4 w-4 ${
                        sortConfig.key === "lastName"
                          ? "opacity-100"
                          : "opacity-40"
                      }`}
                    />
                  </div>
                </TableHead>
                <TableHead>
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort("submittedAt")}
                  >
                    Date de soumission
                    <ArrowUpDown
                      className={`h-4 w-4 ${
                        sortConfig.key === "submittedAt"
                          ? "opacity-100"
                          : "opacity-40"
                      }`}
                    />
                  </div>
                </TableHead>
                <TableHead>
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort("score")}
                  >
                    Note
                    <ArrowUpDown
                      className={`h-4 w-4 ${
                        sortConfig.key === "score"
                          ? "opacity-100"
                          : "opacity-40"
                      }`}
                    />
                  </div>
                </TableHead>
                <TableHead>Commentaire</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Aucun élève ne correspond aux critères de filtrage.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.firstName} {student.lastName}
                      <div className="text-xs text-muted-foreground">
                        {student.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.submission ? (
                        <div className="space-y-1">
                          <div>
                            {format(
                              new Date(student.submission.submittedAt),
                              "dd/MM/yyyy HH:mm",
                              { locale: fr }
                            )}
                          </div>
                          {student.submission.isCorrected ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                            >
                              Corrigé
                            </Badge>
                          ) : student.submission.isCorrecting ? (
                            <Badge
                              variant="outline"
                              className="bg-orange-50 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                            >
                              En cours
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            >
                              À corriger
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          Non soumis
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingStudent === student.id ? (
                        <Input
                          type="number"
                          min={0}
                          max={maxScore}
                          step={0.5}
                          value={editScore ?? ""}
                          onChange={(e) => setEditScore(Number(e.target.value))}
                          className="w-20"
                        />
                      ) : student.submission?.correction?.score != null ? (
                        <span
                          className={getScoreColor(
                            student.submission.correction.score
                          )}
                        >
                          {student.submission.correction.score}/{maxScore}
                        </span>
                      ) : student.submission ? (
                        <span className="text-muted-foreground">Non noté</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingStudent === student.id ? (
                        <Textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Commentaire sur la copie..."
                          className="min-h-[80px]"
                        />
                      ) : (
                        <div className="max-w-xs truncate">
                          {student.submission?.correction?.notes || (
                            <span className="text-muted-foreground italic">
                              Aucun commentaire
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {student.submission && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleViewSubmission(
                                student.submission!.fileUrl,
                                `${student.firstName} ${student.lastName}`
                              )
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}

                        {student.submission &&
                          !student.submission.isCorrecting &&
                          (editingStudent === student.id ? (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => saveGrade(student)}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={cancelEditing}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditing(student)}
                              disabled={student.submission.isCorrecting}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <XCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Aucun élève trouvé</h3>
              <p className="text-muted-foreground mt-1 max-w-md">
                Aucun élève ne correspond à vos critères de filtrage.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setFilter("all")}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <Card key={student.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {student.firstName[0]}
                        {student.lastName[0]}
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {student.firstName} {student.lastName}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {student.submission ? (
                      <>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">
                              Soumis le
                            </p>
                            <p className="text-sm">
                              {format(
                                new Date(student.submission.submittedAt),
                                "dd/MM/yyyy HH:mm",
                                { locale: fr }
                              )}
                            </p>
                          </div>
                          {student.submission.isCorrected ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                            >
                              Corrigé
                            </Badge>
                          ) : student.submission.isCorrecting ? (
                            <Badge
                              variant="outline"
                              className="bg-orange-50 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                            >
                              En cours
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            >
                              À corriger
                            </Badge>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">
                              Note
                            </p>
                            {editingStudent === student.id ? (
                              <Input
                                type="number"
                                min={0}
                                max={maxScore}
                                step={0.5}
                                value={editScore ?? ""}
                                onChange={(e) =>
                                  setEditScore(Number(e.target.value))
                                }
                                className="w-20 mt-1"
                              />
                            ) : student.submission?.correction?.score !=
                              null ? (
                              <p
                                className={`text-xl font-bold ${getScoreColor(
                                  student.submission.correction.score
                                )}`}
                              >
                                {student.submission.correction.score}/{maxScore}
                              </p>
                            ) : (
                              <p className="text-muted-foreground">Non noté</p>
                            )}
                          </div>
                        </div>

                        {(editingStudent === student.id ||
                          student.submission?.correction?.notes) && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">
                              Commentaire
                            </p>
                            {editingStudent === student.id ? (
                              <Textarea
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                placeholder="Commentaire sur la copie..."
                                className="min-h-[80px] mt-1"
                              />
                            ) : (
                              <p className="text-sm mt-1">
                                {student.submission?.correction?.notes || (
                                  <span className="text-muted-foreground italic">
                                    Aucun commentaire
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleViewSubmission(
                                student.submission!.fileUrl,
                                `${student.firstName} ${student.lastName}`
                              )
                            }
                          >
                            <Eye className="h-4 w-4 mr-1" /> Voir
                          </Button>

                          {!student.submission.isCorrecting &&
                            (editingStudent === student.id ? (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => saveGrade(student)}
                                >
                                  <Save className="h-4 w-4 mr-1" /> Enregistrer
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={cancelEditing}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditing(student)}
                                disabled={student.submission.isCorrecting}
                              >
                                <Edit2 className="h-4 w-4 mr-1" /> Modifier
                              </Button>
                            ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <XCircle className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Non soumis</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Visualiseur de fichier */}
      <FileViewerDialog
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        fileUrl={selectedFile.url}
        fileName={`Copie de ${selectedFile.studentName}`}
      />
    </div>
  );
}
