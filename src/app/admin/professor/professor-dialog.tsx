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
import { toast } from "sonner";
import {
  useCreateResource,
  useUpdateResource,
  useGetList
} from "@/providers/dataProvider";
import { User, Role } from "@/types/entities";

interface ProfessorDialogProps {
  professor: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ProfessorDialog({
  professor,
  isOpen,
  onOpenChange,
  onSuccess
}: ProfessorDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
    // teaching: [] as number[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: classroomsData } = useGetList("classroom", {
    limit: 100,
    page: 1
  });
  const classrooms = classroomsData?.data ?? [];

  const { mutateAsync: createProfessor } = useCreateResource("user");
  const { mutateAsync: updateProfessor } = useUpdateResource("user");

  useEffect(() => {
    if (professor) {
      setFormData({
        firstName: professor.firstName,
        lastName: professor.lastName,
        email: professor.email,
        password: ""
        // teaching: professor.teaching?.map((c) => c.id) || []
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
        // teaching: []
      });
    }
  }, [professor, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        role: Role.PROFESSOR
      };

      if (professor) {
        await updateProfessor(
          { id: professor.id.toString(), data: payload },
          {
            onSuccess: () => {
              toast.success("Professeur modifié avec succès");
              onOpenChange(false);
              onSuccess();
            },
            onError: (error: Error) => {
              toast.error(error.message || "Erreur lors de la modification");
            }
          }
        );
      } else {
        await createProfessor(payload, {
          onSuccess: () => {
            toast.success("Professeur créé avec succès");
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
            {professor ? "Modifier le professeur" : "Ajouter un professeur"}
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
              placeholder="Prénom du professeur"
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
              placeholder="Nom du professeur"
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
              placeholder="Email du professeur"
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
              placeholder="Mot de passe du professeur"
              required={!professor}
            />
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
