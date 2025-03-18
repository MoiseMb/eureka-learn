"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, FileText, Download, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { evaluationTypeConfig } from "@/types/entities";

function PDFViewer({ url }: { url: string }) {
  return (
    <div className="w-full">
      <div className="flex justify-center">
        <iframe
          src={url}
          className="w-[700px] h-[400px] border rounded-lg"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
}

export function EvaluationDrawer({ evaluation, isOpen, onClose }: any) {
  if (!evaluation) return null;

  const evaluationType =
    evaluationTypeConfig[
      evaluation.evaluationType as keyof typeof evaluationTypeConfig
    ];
  const isPDF = evaluation?.fileUrl?.toLowerCase().endsWith(".pdf");

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[85vh] max-w-[800px] mx-auto rounded-t-xl">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-6 w-6" />
              {evaluation?.title}
            </DrawerTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Description
              </h3>
              <p className="text-sm">{evaluation?.description}</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Aperçu du document
              </h3>
              <div className="flex justify-center">
                {isPDF ? (
                  <PDFViewer url={evaluation?.fileUrl} />
                ) : (
                  <div className="text-center p-4 border rounded-lg">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Aperçu non disponible. Cliquez sur télécharger pour voir
                      le document.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Informations
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Début:{" "}
                    {format(new Date(evaluation?.startDate), "Pp", {
                      locale: fr
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary" className="rounded-full">
                    {evaluation?.classroom?.name || "Aucune classe"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t p-4">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              className="flex-1 mr-2"
              onClick={() => window.open(evaluation?.fileUrl, "_blank")}
            >
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
