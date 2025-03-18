"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
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
import { toast } from "sonner";
import {
  useCreateResource,
  useUpdateResource,
  useGetList
} from "@/providers/dataProvider";
import type { User, Classroom, Role } from "@/types/entities";

interface StudentDialogProps {
  student: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function StudentDialog({
  student,
  isOpen,
  onOpenChange,
  onSuccess
}: StudentDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    classroomId: "",
    password: ""
  });

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        classroomId: student.classroomId?.toString() || "",
        password: ""
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        classroomId: "",
        password: ""
      });
    }
  }, [student, isOpen]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: createStudent } = useCreateResource("user");
  const { mutateAsync: updateStudent } = useUpdateResource("user");
  const { data: classroomsData } = useGetList("classroom", { limit: 100 });
  const classrooms = classroomsData?.data || [];

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        classroomId: student.classroomId?.toString() || "",
        password: ""
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        classroomId: "",
        password: ""
      });
    }
  }, [student, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        role: "STUDENT" as Role.STUDENT,
        classroomId:
          formData.classroomId && formData.classroomId !== "null"
            ? parseInt(formData.classroomId)
            : null
      };

      if (student) {
        await updateStudent(
          { id: student.id.toString(), ...payload },
          {
            onSuccess: () => {
              toast.success("Élève modifié avec succès");
              onOpenChange(false);
              onSuccess();
            },
            onError: (error: Error) => {
              toast.error(error.message || "Erreur lors de la modification");
            }
          }
        );
      } else {
        await createStudent(payload, {
          onSuccess: () => {
            toast.success("Élève créé avec succès");
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {student ? "Modifier l'élève" : "Ajouter un élève"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder="Prénom de l'élève"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="Nom de l'élève"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email de l'élève"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Mot de passe de l'élève"
              required={!student}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="classroomId">Classe</Label>
            <Select
              value={formData.classroomId}
              onValueChange={(value) =>
                setFormData({ ...formData, classroomId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une classe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">Aucune classe</SelectItem>
                {classrooms.map((classroom: Classroom) => (
                  <SelectItem
                    key={classroom.id}
                    value={classroom.id.toString()}
                  >
                    {classroom.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
