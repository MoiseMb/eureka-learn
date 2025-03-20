"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter
} from "@/components/ui/sheet";
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
import { Card } from "@/components/ui/card";
import type { User as Student } from "@/types";
import { formatDate } from "@/lib/utils";

interface StudentSheetProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (student: Student) => void;
}

export function StudentSheet({
  student,
  isOpen,
  onClose,
  onEdit
}: StudentSheetProps) {
  if (!student) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[600px] sm:w-[540px] p-0 bg-gradient-to-br from-white to-slate-50 my-6 ml-6 mr-4 rounded-xl shadow-2xl"
      >
        <SheetHeader className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8" />
              <h2 className="text-2xl font-bold">
                {student.firstName} {student.lastName}
              </h2>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-16rem)] p-6">
          <div className="space-y-6">
            {/* Email Section */}
            <Card className="p-6 bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Email</h3>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <p className="text-muted-foreground leading-relaxed">
                  {student.email}
                </p>
              </div>
            </Card>

            {/* Classroom Section */}
            <Card className="p-6 bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Classe</h3>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                {student.classroom ? (
                  <Badge variant="secondary" className="rounded-full">
                    {student.classroom.name}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">Non assigné</span>
                )}
              </div>
            </Card>

            {/* Information Section */}
            <Card className="p-6 bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Informations</h3>
              <Separator className="my-3" />
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
            </Card>
          </div>
        </ScrollArea>

        <SheetFooter className="p-6 border-t">
          <div className="flex items-center justify-between w-full">
            <Button variant="outline" className="w-[48%]" onClick={onClose}>
              Fermer
            </Button>
            <Button
              className="w-[48%] bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => {
                onEdit(student);
                onClose();
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
