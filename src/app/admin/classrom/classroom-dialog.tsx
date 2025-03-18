import { useState, useEffect } from "react";
import { useCreateResource, useUpdateResource } from "@/providers/dataProvider";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Classroom } from "@/types";

interface ClassroomDialogProps {
  classroom?: Classroom | null;
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
    description: ""
  });

  const { mutate: createClassroom, isPending: isCreating } = useCreateResource<
    typeof formData,
    any
  >("classroom");
  const { mutate: updateClassroom, isPending: isUpdating } = useUpdateResource<
    typeof formData,
    any
  >("classroom");

  useEffect(() => {
    if (classroom) {
      setFormData({
        name: classroom.name,
        description: classroom.description || ""
      });
    } else {
      setFormData({ name: "", description: "" });
    }
  }, [classroom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const mutation = classroom ? updateClassroom : createClassroom;

    const data = classroom ? { id: classroom.id, ...formData } : formData;

    try {
      await mutation(data, {
        onSuccess: () => {
          toast.success(
            classroom
              ? "Classe modifiée avec succès"
              : "Classe créée avec succès"
          );
          onOpenChange(false);
          setFormData({ name: "", description: "" });
          onSuccess();
        },
        onError: (error: Error) => {
          toast.error(
            error.message ||
              `Erreur lors de la ${
                classroom ? "modification" : "création"
              } de la classe`
          );
        }
      });
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onOpenChange(false);
    setFormData({ name: "", description: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>
            {classroom ? "Modifier la classe" : "Nouvelle classe"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la classe</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Entrez le nom de la classe"
              required
              onClick={(e) => e.stopPropagation()}
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
              placeholder="Description de la classe (optionnel)"
              rows={4}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              onClick={(e) => e.stopPropagation()}
              className="bg-blue-500"
            >
              {isCreating || isUpdating
                ? "Enregistrement..."
                : classroom
                ? "Modifier"
                : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
