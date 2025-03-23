"use client";

import React, { useState } from "react";
import { useGetList } from "@/providers/dataProvider";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileViewerDialog } from "@/components/file-viewer-dialog";
import { Correction, evaluationTypeConfig } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import Image from "next/image";

export default function StudentResultsPage() {
  const [page, setPage] = useState(1);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    name: string;
  } | null>(null);

  const { data: correctionsData } = useGetList("correction/my-corrections", {
    limit: 10,
    page: page
  });

  const corrections = correctionsData?.data ?? [];
  const totalPages = Math.ceil((correctionsData?.total ?? 0) / 10);

  const evaluationTypes = Object.keys(evaluationTypeConfig) as Array<
    keyof typeof evaluationTypeConfig
  >;

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-8 text-center px-4">
      <Image
        src="/empty.svg"
        alt="Aucun résultat"
        width={150}
        height={150}
        className="mb-4 w-24 h-24 md:w-32 md:h-32 lg:w-[150px] lg:h-[150px]"
      />
      <h3 className="text-base font-semibold mb-2">
        Aucun résultat disponible
      </h3>
      <p className="text-sm text-muted-foreground max-w-[280px] md:max-w-sm">
        {message}
      </p>
    </div>
  );

  return (
    <ContentLayout title="Mes résultats">
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-lg">
              Historique des évaluations
            </CardTitle>
            <CardDescription className="text-sm">
              Consultez vos résultats et les commentaires des professeurs
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 md:px-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start mb-4 flex-wrap h-auto gap-2 bg-transparent p-0">
                <TabsTrigger
                  value="all"
                  className="flex items-center gap-2 text-xs md:text-sm data-[state=active]:bg-primary/10"
                >
                  <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
                  Toutes
                </TabsTrigger>
                {evaluationTypes.map((type) => (
                  <TabsTrigger
                    key={type}
                    value={type}
                    className="flex items-center gap-2 text-xs md:text-sm data-[state=active]:bg-primary/10"
                  >
                    {React.createElement(evaluationTypeConfig[type].icon, {
                      className: `h-3 w-3 md:h-4 md:w-4 ${evaluationTypeConfig[type].color}`
                    })}
                    <span className="hidden md:inline">
                      {evaluationTypeConfig[type].label}
                    </span>
                    <span className="md:hidden">
                      {evaluationTypeConfig[type].shortLabel}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="mt-2">
                {corrections.length === 0 ? (
                  <EmptyState message="Vous n'avez pas encore de résultats d'évaluation. Ils apparaîtront ici une fois que vos travaux auront été corrigés." />
                ) : (
                  <div className="space-y-3">
                    {corrections.map((correction: any) => (
                      <CorrectionCard
                        key={correction.id}
                        correction={correction}
                        onViewFile={(url, name) => {
                          setSelectedFile({ url, name });
                          setIsViewerOpen(true);
                        }}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              {evaluationTypes.map((type) => (
                <TabsContent key={type} value={type} className="mt-2">
                  {corrections.filter((c: any) => c.evaluationType === type)
                    .length === 0 ? (
                    <EmptyState
                      message={`Vous n'avez pas encore de résultats pour ce type d'évaluation.`}
                    />
                  ) : (
                    <div className="space-y-3">
                      {corrections
                        .filter((c: any) => c.evaluationType === type)
                        .map((correction: any) => (
                          <CorrectionCard
                            key={correction.id}
                            correction={correction}
                            onViewFile={(url, name) => {
                              setSelectedFile({ url, name });
                              setIsViewerOpen(true);
                            }}
                          />
                        ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>

            {corrections.length > 0 && totalPages > 1 && (
              <div className="mt-4 flex justify-center overflow-x-auto py-2">
                <Pagination>
                  <PaginationContent className="flex-wrap gap-1">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNumber) => (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setPage(pageNumber)}
                            isActive={page === pageNumber}
                            className="h-8 w-8"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <FileViewerDialog
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        fileUrl={selectedFile?.url || ""}
        fileName={selectedFile?.name || ""}
      />
    </ContentLayout>
  );
}

function CorrectionCard({
  correction,
  onViewFile
}: {
  correction: Correction;
  onViewFile: (url: string, name: string) => void;
}) {
  const config = evaluationTypeConfig[correction.evaluationType];

  const getScoreColor = (score: number) => {
    return score < 10
      ? "text-red-600 dark:text-red-500"
      : "text-green-600 dark:text-green-500";
  };

  const getProgressColor = (score: number) => {
    return score < 10 ? "bg-red-600" : "bg-green-600";
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base flex items-center gap-2">
                {React.createElement(config.icon, {
                  className: `h-4 w-4 ${config.color}`
                })}
                <span className="hidden md:inline">{config.label}</span>
                <span className="md:hidden">{config.shortLabel}</span>
              </h3>
              <Badge
                variant={
                  correction.score !== undefined ? "default" : "secondary"
                }
              >
                {correction.score !== undefined ? "Corrigé" : "En correction"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Corrigé le{" "}
              {format(new Date(correction.correctedAt), "dd MMMM yyyy", {
                locale: fr
              })}
            </p>
          </div>

          {correction.score !== undefined && (
            <div className="text-right">
              <span
                className={cn(
                  "text-xl font-bold",
                  getScoreColor(correction.score)
                )}
              >
                {correction.score}/20
              </span>
            </div>
          )}

          {correction.score !== undefined && (
            <>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Note obtenue</span>
                  <span className={getScoreColor(correction.score)}>
                    {((correction.score / 20) * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={(correction.score / 20) * 100}
                  className={cn("h-2", getProgressColor(correction.score))}
                />
              </div>

              {correction.notes && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs font-medium">
                    Commentaire du professeur :
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {correction.notes}
                  </p>
                </div>
              )}
            </>
          )}

          <Separator className="my-2" />

          <div className="flex flex-col items-stretch gap-2">
            <Button
              variant="outline"
              className="flex-1 text-xs"
              onClick={() =>
                onViewFile(
                  correction.submission.fileUrl,
                  correction.submission.subject.title
                )
              }
            >
              Voir mon travail
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-xs"
              onClick={() =>
                onViewFile(correction.submission.subject.fileUrl, "Correction")
              }
              disabled={correction.score === undefined}
            >
              Voir la correction
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
