"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useGetList } from "@/providers/dataProvider";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BookOpen,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";
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

  return (
    <ContentLayout title="Mes résultats">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Historique des évaluations
            </CardTitle>
            <CardDescription>
              Consultez vos résultats et les commentaires des professeurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start mb-4 flex-wrap">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Toutes les évaluations
                </TabsTrigger>
                {evaluationTypes.map((type) => (
                  <TabsTrigger
                    key={type}
                    value={type}
                    className="flex items-center gap-2"
                  >
                    {React.createElement(evaluationTypeConfig[type].icon, {
                      className: `h-4 w-4 ${evaluationTypeConfig[type].color}`
                    })}
                    {evaluationTypeConfig[type].label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="space-y-4">
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
              </TabsContent>

              {evaluationTypes.map((type) => (
                <TabsContent key={type} value={type} className="space-y-4">
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
                </TabsContent>
              ))}
            </Tabs>

            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        // disabled={page === 1}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNumber) => (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setPage(pageNumber)}
                            isActive={page === pageNumber}
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
                        // disabled={page === totalPages}
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

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {React.createElement(config.icon, {
                  className: `h-4 w-4 ${config.color}`
                })}
                {config.label}
              </h3>
              <Badge
                variant={
                  correction.score !== undefined ? "default" : "secondary"
                }
              >
                {correction.score !== undefined ? "Corrigé" : "En correction"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Corrigé le{" "}
              {format(new Date(correction.correctedAt), "dd MMMM yyyy", {
                locale: fr
              })}
            </p>
          </div>
          {correction.score !== undefined && (
            <div className="text-right">
              <span className="text-2xl font-bold text-green-600">
                {correction.score}/20
              </span>
            </div>
          )}
        </div>

        {correction.score !== undefined && (
          <>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Note obtenue</span>
                <span>{((correction.score / 20) * 100).toFixed(0)}%</span>
              </div>
              <Progress value={(correction.score / 20) * 100} className="h-2" />
            </div>

            {correction.notes && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">
                  Commentaire du professeur :
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {correction.notes}
                </p>
              </div>
            )}
          </>
        )}

        <Separator className="my-4" />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex-1"
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
            className="flex-1"
            onClick={() =>
              onViewFile(correction.submission.fileUrl, "Correction")
            }
            disabled={correction.score === undefined}
          >
            Voir la correction
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
