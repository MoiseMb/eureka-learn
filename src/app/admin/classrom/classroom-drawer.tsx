"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, CalendarDays, Pencil, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Classroom } from "@/types";
import { formatDate } from "@/lib/utils";

interface ClassroomDrawerProps {
  classroom: Classroom | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (classroom: Classroom) => void;
}

export function ClassroomDrawer({
  classroom,
  isOpen,
  onClose,
  onEdit
}: ClassroomDrawerProps) {
  if (!classroom) return null;

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent side="right">
        <div className="relative bg-background p-6 pt-0">
          <div className="sticky top-0 z-20 bg-background pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                {classroom.name}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Description
              </h3>
              <Separator className="my-2" />
              <p className="text-sm">
                {classroom.description || "Aucune description"}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Élèves
              </h3>
              <Separator className="my-2" />
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary" className="rounded-full">
                  {classroom.students?.length || 0} élèves
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Informations
              </h3>
              <Separator className="my-2" />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>Créé le {formatDate(classroom.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>Modifié le {formatDate(classroom.updatedAt)}</span>
                </div>
              </div>
            </div>

            {classroom.students && classroom.students.length > 0 && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Liste des élèves
                </h3>
                <Separator className="my-2" />
                <div className="grid gap-2">
                  {classroom.students.map((student: any) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-2 p-2 rounded-lg border bg-card"
                    >
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {student.firstName} {student.lastName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <Button variant="outline" className="w-[48%]" onClick={onClose}>
                  Fermer
                </Button>
                <Button
                  className="w-[48%] bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => {
                    onEdit(classroom);
                    onClose();
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
