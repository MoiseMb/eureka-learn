export const runtime = "edge";

("use client");
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useGetList } from "@/providers/dataProvider";
import { Card, CardContent } from "@/components/ui/card";
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
  Blocks,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Eye,
  GraduationCap
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { evaluationTypeConfig } from "@/types/entities";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { EvaluationDrawer } from "./evaluation-drawer";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-mobile";
import { downloadFile } from "@/utils/file-helpers";

export default function EvaluationListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedClassroom, setSelectedClassroom] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const itemsPerPage = 6;

  const router = useRouter();

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

  // Pagination logic
  const totalPages = Math.ceil(filteredEvaluations.length / itemsPerPage);
  const paginatedEvaluations = filteredEvaluations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedClassroom]);

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
      label:
        evaluationTypeConfig[type as keyof typeof evaluationTypeConfig]
          ?.label || type,
      icon: icons[type as keyof typeof icons] || FileText,
      color:
        evaluationTypeConfig[type as keyof typeof evaluationTypeConfig]
          ?.color || "text-gray-500"
    };
  };

  const handleDownload = async (evaluation: any) => {
    try {
      await downloadFile(
        evaluation.fileUrl,
        `${evaluation.title}.${evaluation.type.toLowerCase()}`
      );
      toast.success("Téléchargement réussi");
    } catch (error) {
      toast.error("Erreur lors du téléchargement du fichier");
    }
  };

  const renderSkeletons = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <Card key={`skeleton-${index}`} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-32" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ));
  };

  const FilterContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Type d'évaluation</label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Type d'évaluation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Tous les types
              </div>
            </SelectItem>
            {Object.entries(evaluationTypeConfig).map(([type, config]) => (
              <SelectItem key={type} value={type}>
                <div className="flex items-center gap-2">
                  {React.createElement(config.icon, {
                    className: `h-4 w-4 ${config.color}`
                  })}
                  {config.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Classe</label>
        <Select value={selectedClassroom} onValueChange={setSelectedClassroom}>
          <SelectTrigger className="w-full">
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
    </div>
  );

  return (
    <ContentLayout title="Liste des évaluations">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Mes évaluations
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez et consultez vos évaluations
            </p>
          </div>
          <Button
            onClick={() => router.push("/professor/evaluation/create")}
            className="flex items-center gap-2 h-12"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            Nouvelle évaluation
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher une évaluation..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isMobile ? (
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden flex gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtres
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[60vh]">
                <SheetHeader className="mb-4">
                  <div className="flex items-center justify-between">
                    <SheetTitle>Filtres</SheetTitle>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>
                <FilterContent />
                <div className="mt-6">
                  <SheetClose asChild>
                    <Button className="w-full">Appliquer les filtres</Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <>
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
            </>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            renderSkeletons()
          ) : (
            <AnimatePresence>
              {paginatedEvaluations.map((evaluation: any, index: number) => (
                <motion.div
                  key={evaluation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4"
                    style={{
                      borderLeftColor: getEvaluationTypeConfig(
                        evaluation.evaluationType
                      ).color.includes("text-")
                        ? `var(--${getEvaluationTypeConfig(
                            evaluation.evaluationType
                          ).color.replace("text-", "")})`
                        : getEvaluationTypeConfig(evaluation.evaluationType)
                            .color
                    }}
                  >
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 rounded-full p-2 text-primary">
                              {React.createElement(
                                getEvaluationTypeConfig(
                                  evaluation.evaluationType
                                ).icon,
                                {
                                  className: "h-5 w-5"
                                }
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg line-clamp-1">
                                {evaluation.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {evaluation.classroom?.name || "Aucune classe"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Calendar className="h-3 w-3" />
                              {format(
                                new Date(evaluation.startDate),
                                "d MMM yyyy",
                                {
                                  locale: fr
                                }
                              )}
                            </Badge>
                            <Badge variant="outline">
                              {
                                getEvaluationTypeConfig(
                                  evaluation.evaluationType
                                ).label
                              }
                            </Badge>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:text-primary"
                              onClick={() => setSelectedEvaluation(evaluation)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/professor/evaluation/${evaluation.id}/grades`
                                )
                              }
                            >
                              <GraduationCap className="h-4 w-4 mr-2" />
                              Notes
                            </Button>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDownload(evaluation)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  router.push(
                                    `/professor/evaluation/${evaluation.id}/edit`
                                  )
                                }
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {paginatedEvaluations.length === 0 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 col-span-full bg-muted/20 rounded-lg"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="font-medium text-lg">
                      Aucune évaluation trouvée
                    </h3>
                    <p className="text-muted-foreground">
                      Ajustez vos filtres ou créez une nouvelle évaluation
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedType("ALL");
                        setSelectedClassroom("ALL");
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
              {Math.min(currentPage * itemsPerPage, filteredEvaluations.length)}{" "}
              sur {filteredEvaluations.length} évaluations
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <EvaluationDrawer
        evaluation={selectedEvaluation}
        isOpen={!!selectedEvaluation}
        onClose={() => setSelectedEvaluation(null)}
      />
    </ContentLayout>
  );
}
