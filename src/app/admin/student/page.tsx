"use client";

import { useState } from "react";
import {
  useGetList,
  useDeleteResource,
  ListParams
} from "@/providers/dataProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StudentDialog } from "./student-dialog";
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
  User,
  GraduationCap
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
import { Role, User as Student } from "@/types";
import { DataTable } from "@/components/ui/data-table/data-table";
import { StudentSheet } from "./student-drawer";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function StudentsPage() {
  const [params, setParams] = useState<ListParams>({
    page: 1,
    limit: 10,
    sortBy: "lastName",
    sortOrder: "desc",
    search: "",
    filters: {
      role: Role.STUDENT
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    classroomId: ""
  });

  const { data, isLoading, refetch } = useGetList("user", params);
  const { mutate: deleteStudent } = useDeleteResource("student");
  const students = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleEdit = (student: Student, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      classroomId: student.classroomId?.toString() || ""
    });
    setIsDrawerOpen(false);
    setTimeout(() => setIsOpen(true), 300);
  };

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setAlertDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;

    try {
      await deleteStudent(selectedStudent.id.toString(), {
        onSuccess: () => {
          toast.success("Élève supprimé avec succès");
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

  const handleRowClick = (student: Student) => {
    setSelectedStudent(student);
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      accessorKey: "firstName",
      header: "Prénom",
      cell: (row: any) => (
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-blue-500"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStudent(row.original);
            setIsDrawerOpen(true);
          }}
        >
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.firstName}</span>
        </div>
      ),
      sortable: true
    },
    {
      accessorKey: "lastName",
      header: "Nom",
      cell: (row: any) => row.lastName,
      sortable: true
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (row: any) => row.email
    },
    {
      accessorKey: "classroom",
      header: "Classe",
      cell: (row: any) => {
        const classroom = row.classroom;
        return (
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            {classroom ? (
              <Badge variant="secondary">{classroom.name}</Badge>
            ) : (
              <span className="text-muted-foreground">Non assigné</span>
            )}
          </div>
        );
      }
    },
    {
      id: "actions",
      cell: (row: Student) => {
        const student = row;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => handleEdit(student, e)}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(student);
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
    <ContentLayout title="Élèves">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gestion des Élèves</CardTitle>
                <CardDescription>
                  Gérez vos élèves et leurs informations
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  setSelectedStudent(null);
                  setIsOpen(true);
                }}
                className="h-12 text-lg bg-blue-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un élève
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un élève..."
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
              data={students}
              isLoading={isLoading}
              onRowClick={(row) => handleRowClick(row as Student)}
            />
          </CardContent>
        </Card>

        <StudentDialog
          student={selectedStudent}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onSuccess={refetch}
        />

        <AlertDialog
          isOpen={alertDialogOpen}
          onClose={() => setAlertDialogOpen(false)}
          title="Êtes-vous sûr ?"
          description={`Cette action est irréversible. Cela supprimera définitivement l'élève "${selectedStudent?.firstName} ${selectedStudent?.lastName}" et toutes ses données associées.`}
          onConfirm={handleDeleteConfirm}
          confirmText="Supprimer"
          cancelText="Annuler"
        />

        <StudentSheet
          student={selectedStudent}
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedStudent(null);
          }}
          onEdit={(student) => {
            handleEdit(student, {
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
