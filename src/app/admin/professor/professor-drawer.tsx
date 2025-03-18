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
import type { User, Classroom } from "@/types/entities";
import { formatDate } from "@/lib/utils";

interface ProfessorDrawerProps {
  professor: User | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (professor: User) => void;
}

export function ProfessorDrawer({
  professor,
  isOpen,
  onClose,
  onEdit
}: ProfessorDrawerProps) {
  if (!professor) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="h-[98%] w-[400px] my-auto">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center gap-2 text-xl">
              <GraduationCap className="h-6 w-6" />
              {professor.firstName} {professor.lastName}
            </DrawerTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Email
              </h3>
              <Separator className="my-2" />
              <p className="text-sm">{professor.email}</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Classes
              </h3>
              <Separator className="my-2" />
              {/* <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary" className="rounded-full">
                  {professor.classrooms?.length || 0} classes
                </Badge>
              </div> */}
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Informations
              </h3>
              <Separator className="my-2" />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>Créé le {formatDate(professor.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>Modifié le {formatDate(professor.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* {professor.classrooms && professor.classrooms.length > 0 && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Liste des classes
                </h3>
                <Separator className="my-2" />
                <div className="grid gap-2">
                  {professor.classrooms.map((classroom: Classroom) => (
                    <div
                      key={classroom.id}
                      className="flex items-center gap-2 p-2 rounded-lg border bg-card"
                    >
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{classroom.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t p-4">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            <Button onClick={() => onEdit(professor)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
