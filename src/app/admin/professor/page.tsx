"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfessorDialog } from "./professor-dialog";
import { ProfessorSheet } from "./professor-drawer";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Users,
  MoreHorizontal,
  Pencil,
  Trash2,
  GraduationCap,
  Book
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { User, Role, Classroom } from "@/types/entities";
import { useDeleteResource, useGetList } from "@/providers/dataProvider";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { DataTable } from "@/components/ui/data-table/data-table";

export default function ProfessorsPage() {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    sortBy: "lastName",
    sortOrder: "desc" as "desc" | "asc",
    search: "",
    filters: {
      role: Role.PROFESSOR
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<User | null>(null);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const { data, isLoading, refetch } = useGetList("user", params);
  const { mutate: deleteProfessor } = useDeleteResource("user");
  const professors = data?.data ?? [];

  const handleEdit = (professor: User, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedProfessor(professor);
    setFormData({
      firstName: professor.firstName,
      lastName: professor.lastName,
      email: professor.email,
      password: ""
    });
    setIsDrawerOpen(false);
    setTimeout(() => setIsOpen(true), 300);
  };

  const handleDeleteClick = (professor: User) => {
    setSelectedProfessor(professor);
    setAlertDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProfessor) return;

    try {
      await deleteProfessor(selectedProfessor.id.toString(), {
        onSuccess: () => {
          toast.success("Professeur supprimé avec succès");
          refetch();
        },
        onError: (error: Error) => {
          toast.error(error.message || "Erreur lors de la suppression");
        }
      });
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    }
    setAlertDialogOpen(false);
  };

  const handleRowClick = (professor: User) => {
    setSelectedProfessor(professor);
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      accessorKey: "firstName",
      header: "Prénom",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.firstName}</span>
        </div>
      )
    },
    {
      accessorKey: "lastName",
      header: "Nom"
    },
    {
      accessorKey: "email",
      header: "Email"
    },
    {
      accessorKey: "teaching",
      header: "Classes",
      cell: (row: any) => {
        const teaching = row.teaching || [];
        return (
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4 text-muted-foreground" />
            {teaching.length > 0 ? (
              <div className="flex gap-1">
                {teaching.map((classroom: Classroom) => (
                  <Badge key={classroom.id} variant="secondary">
                    {classroom.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">Aucune classe</span>
            )}
          </div>
        );
      }
    },
    {
      id: "actions",
      cell: (row: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => handleEdit(row, e)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(row.original);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <ContentLayout title="Professeurs">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Liste des professeurs</CardTitle>
                <CardDescription>
                  Gérez les professeurs et leurs matières
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  setSelectedProfessor(null);
                  setIsOpen(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 h-12 text-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un professeur
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un professeur..."
                  value={params.search}
                  onChange={(e) =>
                    setParams({ ...params, search: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <DataTable
              columns={columns as any}
              data={professors}
              isLoading={isLoading}
              onRowClick={handleRowClick}
            />
          </CardContent>
        </Card>

        <ProfessorDialog
          professor={selectedProfessor}
          isOpen={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) setSelectedProfessor(null);
          }}
          onSuccess={refetch}
        />

        <ProfessorSheet
          professor={selectedProfessor}
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedProfessor(null);
          }}
          onEdit={handleEdit}
        />

        <AlertDialog
          isOpen={alertDialogOpen}
          onClose={() => setAlertDialogOpen(false)}
          title="Êtes-vous sûr ?"
          description={`Cette action est irréversible. Cela supprimera définitivement le professeur "${selectedProfessor?.firstName} ${selectedProfessor?.lastName}" et toutes ses données associées.`}
          onConfirm={handleDeleteConfirm}
          confirmText="Supprimer"
          cancelText="Annuler"
        />
      </div>
    </ContentLayout>
  );
}
