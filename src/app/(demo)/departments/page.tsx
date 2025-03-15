"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/common/empty-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Building2, MoreHorizontal, Pencil, Trash2, UserX } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Drawer } from "@/components/ui/drawer";
import { Users } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { tableStyles } from "@/components/ui/data-table/styles";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type Department = {
  id: string;
  name: string;
  plannedRevenue: number;
  plannedExpenses: number;
  manager: {
    firstName: string;
    lastName: string;
    id: string;
  } | null;
};

type AvailableManager = {
  id: string;
  firstName: string;
  lastName: string;
};

export default function DepartmentsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    managerId: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [pageSize] = useState(10);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [availableManagers, setAvailableManagers] = useState<
    AvailableManager[]
  >([]);

  const fetchAvailableManagers = async () => {
    try {
      const response = await fetch("/api/department-managers/available");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setAvailableManagers(data.managers);
    } catch (error) {
      toast.error("Erreur lors du chargement des responsables disponibles");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAvailableManagers();
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (session?.user.role === "SUPER_ADMIN") {
      fetchDepartments();
    }
  }, [session, debouncedSearchQuery, pagination.currentPage]);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/departments?page=${pagination.currentPage}&limit=${pageSize}&search=${debouncedSearchQuery}`
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des départements");
      }

      const data = await response.json();
      setDepartments(data.departments);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        total: data.total
      });
    } catch (err) {
      toast.error("Erreur lors du chargement des départements");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleEdit = (department: Department, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      managerId: department.manager?.id || ""
    });
    setIsDrawerOpen(false);
    setTimeout(() => setIsOpen(true), 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingDepartment
        ? `/api/departments/${editingDepartment.id}`
        : "/api/departments";

      const method = editingDepartment ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          managerId: formData.managerId === "null" ? null : formData.managerId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      toast.success(
        editingDepartment
          ? "Département modifié avec succès"
          : "Département créé avec succès"
      );

      setIsOpen(false);
      setEditingDepartment(null);
      setFormData({
        name: "",
        managerId: ""
      });
      fetchDepartments();
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer ce département ?")
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      toast.success("Département supprimé avec succès");
      setIsDrawerOpen(false);
      fetchDepartments();
    } catch (error) {
      toast.error("Erreur lors de la suppression du département");
    }
  };

  const handleViewDetails = (department: Department) => {
    setSelectedDepartment(department);
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      header: "Nom",
      accessorKey: "name" as const,
      cell: (department: Department) => (
        <div className="flex items-center gap-3">
          <div className={tableStyles.icon.container}>
            <Building2
              className={cn(tableStyles.icon.base, "text-muted-foreground")}
            />
          </div>
          <span className={tableStyles.text.primary}>{department.name}</span>
        </div>
      )
    },
    {
      header: "Responsable",
      accessorKey: "manager" as const,
      cell: (department: Department) =>
        department.manager ? (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={tableStyles.badge.success}>
              <Users className="h-3 w-3" />
              {`${department.manager.firstName} ${department.manager.lastName}`}
            </Badge>
          </div>
        ) : (
          <Badge variant="outline" className={tableStyles.badge.secondary}>
            <UserX className="h-3 w-3" />
            Non assigné
          </Badge>
        )
    },
    {
      header: "Actions",
      accessorKey: "id" as const,
      className: "w-[70px]",
      cell: (department: Department) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={tableStyles.actions.menu}>
            <DropdownMenuItem
              onClick={(e) => handleEdit(department, e)}
              className={tableStyles.actions.menuItem}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => handleDelete(department.id, e)}
              className={tableStyles.actions.menuItemDanger}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  if (isLoading) {
    return (
      <ContentLayout title="Départements">
        <Card>
          <CardContent className="p-0">
            <TableSkeleton columns={5} rows={5} />
          </CardContent>
        </Card>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Départements">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Liste des départements</h1>
          <Dialog
            open={isOpen}
            onOpenChange={(open) => {
              setIsOpen(open);
              if (!open) {
                setEditingDepartment(null);
                setFormData({
                  name: "",
                  managerId: ""
                });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 h-14 text-lg">
                Nouveau département
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center mb-6">
                  {editingDepartment
                    ? "Modifier le département"
                    : "Créer un nouveau département"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-lg font-semibold">
                      Nom du département
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="h-14 text-lg mt-2"
                      placeholder="Entrez le nom du département"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="managerId"
                      className="text-lg font-semibold"
                    >
                      Responsable
                    </Label>
                    <Select
                      value={formData.managerId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, managerId: value })
                      }
                    >
                      <SelectTrigger className="h-14 text-lg mt-2">
                        <SelectValue placeholder="Sélectionner un responsable" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">Non assigné</SelectItem>
                        {availableManagers.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.firstName} {manager.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-6">
                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-14 px-6 text-xl"
                        onClick={() => {
                          setEditingDepartment(null);
                          setIsOpen(false);
                        }}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        className="h-14 px-6 text-xl bg-teal-600 hover:bg-teal-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Traitement..."
                          : editingDepartment
                          ? "Modifier le département"
                          : "Créer le département"}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Rechercher un département..."
              className="pl-10 h-12"
            />
          </div>
        </div>

        {departments.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <DataTable
                data={departments}
                columns={columns}
                onRowClick={handleViewDetails}
                isLoading={isLoading}
                emptyMessage={
                  searchQuery
                    ? `Aucun département trouvé pour "${searchQuery}"`
                    : "Aucun département disponible"
                }
              />
              {pagination.totalPages > 1 && (
                <div className="p-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => {
                            if (pagination.currentPage > 1) {
                              handlePageChange(pagination.currentPage - 1);
                            }
                          }}
                          className={cn(
                            "hover:bg-muted",
                            pagination.currentPage === 1 &&
                              "pointer-events-none opacity-50"
                          )}
                        />
                      </PaginationItem>
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink
                            onClick={() => handlePageChange(i + 1)}
                            isActive={pagination.currentPage === i + 1}
                            className={cn(
                              pagination.currentPage === i + 1
                                ? "bg-teal-600 text-white hover:bg-teal-700"
                                : "hover:bg-muted"
                            )}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => {
                            if (
                              pagination.currentPage < pagination.totalPages
                            ) {
                              handlePageChange(pagination.currentPage + 1);
                            }
                          }}
                          className={cn(
                            "hover:bg-muted",
                            pagination.currentPage === pagination.totalPages &&
                              "pointer-events-none opacity-50"
                          )}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <EmptyState
                icon={Building2}
                title="Aucun département"
                description="Il n'y a aucun département pour le moment. Commencez par en créer un."
                action={{
                  label: "Créer un département",
                  onClick: () => setIsOpen(true)
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>

      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        className={`p-0 transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedDepartment && (
          <div className="h-full">
            <div className="bg-muted/50 p-6 border-b">
              <h2 className="text-2xl font-bold mb-2">
                {selectedDepartment.name}
              </h2>
              <p className="text-muted-foreground">Détails du département</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-100 dark:bg-teal-900/20 rounded-lg">
                    <Building2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Département</p>
                    <p className="font-medium">{selectedDepartment.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Responsable</p>
                    <p className="font-medium">
                      {selectedDepartment.manager
                        ? `${selectedDepartment.manager.firstName} ${selectedDepartment.manager.lastName}`
                        : "Non assigné"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(selectedDepartment, e);
                  }}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                >
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      window.confirm(
                        "Êtes-vous sûr de vouloir supprimer ce département ?"
                      )
                    ) {
                      handleDelete(selectedDepartment.id, e);
                    }
                  }}
                  className="flex-1"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </ContentLayout>
  );
}
