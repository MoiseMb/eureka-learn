"use client";

import { useState } from "react";
import { useGetList, useDeleteResource } from "@/providers/dataProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClassroomDialog } from "./classroom-dialog";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  GraduationCap,
  Users
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Classroom } from "@/types";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ClassroomSheet } from "./classroom-drawer";
import { ContentLayout } from "@/components/admin-panel/content-layout";

interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  orderBy?: string;
  order: "asc" | "desc";
}

export default function ClassroomPage() {
  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    orderBy: "name",
    order: "desc",
    search: ""
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const { data, isLoading, refetch } = useGetList("classroom", params);
  const { mutate: deleteClassroom } = useDeleteResource("classroom");
  const classes = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleEdit = (classroom: Classroom, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedClassroom(classroom);
    setFormData({
      name: classroom.name,
      description: classroom.description || ""
    });
    setIsDrawerOpen(false);
    setTimeout(() => setIsOpen(true), 300);
  };

  const handleDeleteClick = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setAlertDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClassroom) return;

    try {
      await deleteClassroom(selectedClassroom.id.toString(), {
        onSuccess: () => {
          toast.success("Classe supprimée avec succès");
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

  const handleRowClick = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Nom",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <span>{row.name}</span>
        </div>
      )
    },
    {
      accessorKey: "teacher",
      header: "Professeur ",
      cell: (row: any) => {
        const teacher = row.teacher;
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            {teacher ? (
              <Badge variant="secondary">
                {teacher.firstName} {teacher.lastName}
              </Badge>
            ) : (
              <span className="text-muted-foreground">Non assigné</span>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (row: any) => row.description || "Aucune description"
    },
    {
      accessorKey: "students",
      header: "Élèves",
      cell: (row: any) => {
        const students = row.students as any[];
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary">{students?.length || 0} élèves</Badge>
          </div>
        );
      }
    },
    {
      id: "actions",
      cell: (row: Classroom) => {
        const classroom = row;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => handleEdit(classroom, e)}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(classroom);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  return (
    <ContentLayout title="Classe">
      <div className="space-y-4  ">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gestion des Classes</CardTitle>
                <CardDescription>
                  Gérez vos classes et leurs élèves
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  setSelectedClassroom(null);
                  setIsOpen(true);
                }}
                className="h-12 text-lg bg-blue-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une classe
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une classe..."
                  value={params.search}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      page: 1,
                      search: e.target.value
                    }))
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <DataTable
              columns={columns as any}
              data={classes}
              isLoading={isLoading}
              onRowClick={(row) => handleRowClick(row as Classroom)}
            />
          </CardContent>
        </Card>

        <ClassroomDialog
          classroom={selectedClassroom}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onSuccess={refetch}
        />

        <AlertDialog
          isOpen={alertDialogOpen}
          onClose={() => setAlertDialogOpen(false)}
          title="Êtes-vous sûr ?"
          description={`Cette action est irréversible. Cela supprimera définitivement la classe "${selectedClassroom?.name}" et toutes ses données associées.`}
          onConfirm={handleDeleteConfirm}
          confirmText="Supprimer"
          cancelText="Annuler"
        />

        <ClassroomSheet
          classroom={selectedClassroom}
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedClassroom(null);
          }}
          onEdit={(classroom) => {
            handleEdit(classroom, {
              stopPropagation: () => {},
              preventDefault: () => {}
            } as React.MouseEvent);
            setIsDrawerOpen(false);
          }}
        />
      </div>
    </ContentLayout>
  );
}
