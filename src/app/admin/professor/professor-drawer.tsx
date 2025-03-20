"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, CalendarDays, Pencil, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import type { User, Classroom } from "@/types/entities";
import { formatDate } from "@/lib/utils";

interface ProfessorSheetProps {
  professor: User | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (professor: User) => void;
}

export function ProfessorSheet({
  professor,
  isOpen,
  onClose,
  onEdit
}: ProfessorSheetProps) {
  if (!professor) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[600px] sm:w-[540px] p-0 bg-gradient-to-br from-white to-slate-50 my-6 ml-6 mr-4 rounded-xl shadow-2xl"
      >
        <SheetHeader className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8" />
              <h2 className="text-2xl font-bold">
                {professor.firstName} {professor.lastName}
              </h2>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-16rem)] p-6">
          <div className="space-y-6">
            {/* Email Section */}
            <Card className="p-6 bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Email</h3>
              <p className="text-muted-foreground leading-relaxed">
                {professor.email}
              </p>
            </Card>

            {/* Classes Count Section */}
            <Card className="p-6 bg-white shadow-sm">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Classes</h3>
              </div>
              <Separator className="my-3" />
              <Badge variant="secondary" className="rounded-full">
                {professor.teaching?.length || 0} classes
              </Badge>
            </Card>

            {/* Information Section */}
            <Card className="p-6 bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Informations</h3>
              <Separator className="my-3" />
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
            </Card>

            {/* Classes List Section */}
            {professor.teaching && professor.teaching.length > 0 && (
              <Card className="p-6 bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-3">
                  Liste des classes
                </h3>
                <Separator className="my-3" />
                <div className="grid gap-2">
                  {professor.teaching.map((classroom: Classroom) => (
                    <div
                      key={classroom.id}
                      className="flex items-center gap-2 p-2 rounded-lg border bg-card"
                    >
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{classroom.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
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
                onEdit(professor);
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
