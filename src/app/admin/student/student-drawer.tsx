"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  User,
  GraduationCap,
  Mail,
  CalendarDays,
  Pencil,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { User as Student } from "@/types";
import { formatDate } from "@/lib/utils";

interface StudentDrawerProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (student: Student) => void;
}

export function StudentDrawer({
  student,
  isOpen,
  onClose,
  onEdit
}: StudentDrawerProps) {
  if (!student) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="top">
      <DrawerContent className=" w-[400px] my-auto">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center gap-2 text-xl">
              <User className="h-6 w-6" />
              {student.firstName} {student.lastName}
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
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{student.email}</p>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Classe
              </h3>
              <Separator className="my-2" />
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                {student.classroom ? (
                  <Badge variant="secondary" className="rounded-full">
                    {student.classroom.name}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">Non assigné</span>
                )}
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
                  <span>Créé le {formatDate(student.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>Modifié le {formatDate(student.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t p-4">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            <Button
              onClick={() => {
                onEdit(student);
                onClose();
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
