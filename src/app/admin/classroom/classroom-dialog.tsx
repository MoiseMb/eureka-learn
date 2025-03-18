"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateResource,
  useUpdateResource,
  useGetList
} from "@/providers/dataProvider";
import { toast } from "sonner";
import { Classroom, User, Role } from "@/types/entities";

interface ClassroomDialogProps {
  classroom: Classroom | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ClassroomDialog({
  classroom,
  isOpen,
  onOpenChange,
  onSuccess
}: ClassroomDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teacherId: ""
  });

  const { mutateAsync: createClassroom } = useCreateResource("classroom");
  const { mutateAsync: updateClassroom } = useUpdateResource("classroom");

  const { data: teachersData } = useGetList("user", {
    limit: 100,
    page: 1,
    filters: {
      role: Role.PROFESSOR
    }
  });
  const teachers = teachersData?.data ?? [];

  useEffect(() => {
    if (classroom) {
      setFormData({
        name: classroom.name,
        description: classroom.description || "",
        teacherId: classroom.teacherId?.toString() || ""
      });
    } else {
      setFormData({
        name: "",
        description: "",
        teacherId: ""
      });
    }
  }, [classroom, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        description: formData.description || null,
        teacherId:
          formData.teacherId === "null"
            ? null
            : formData.teacherId
            ? parseInt(formData.teacherId)
            : null
      };

      if (classroom) {
        await updateClassroom(
          {
            id: classroom.id.toString(),
            data: payload
          },
          {
            onSuccess: () => {
              toast.success("Classe modifiée avec succès");
              onOpenChange(false);
              onSuccess();
            },
            onError: (error: Error) => {
              toast.error(error.message || "Erreur lors de la modification");
            }
          }
        );
      } else {
        await createClassroom(payload, {
          onSuccess: () => {
            toast.success("Classe créée avec succès");
            onOpenChange(false);
            onSuccess();
          },
          onError: (error: Error) => {
            toast.error(error.message || "Erreur lors de la création");
          }
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {classroom ? "Modifier la classe" : "Créer une classe"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nom de la classe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description de la classe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacherId">Professeur principal</Label>
            <Select
              value={formData.teacherId || "null"}
              onValueChange={(value) =>
                setFormData({ ...formData, teacherId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un professeur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">Aucun professeur</SelectItem>
                {teachers.map((teacher: User) => (
                  <SelectItem key={teacher.id} value={teacher.id.toString()}>
                    {teacher.firstName} {teacher.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">{classroom ? "Modifier" : "Créer"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
