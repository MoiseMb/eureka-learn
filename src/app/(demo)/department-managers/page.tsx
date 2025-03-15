"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import {
  Search,
  Users,
  MoreHorizontal,
  Pencil,
  Trash2,
  Building2,
  UserX
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { tableStyles } from "@/components/ui/data-table/styles";
import { Drawer } from "@/components/ui/drawer";
import { User2, Mail, Building, X } from "lucide-react";

type DepartmentManager = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentName: string | null;
};

export default function DepartmentManagersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [managers, setManagers] = useState<DepartmentManager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingManager, setEditingManager] =
    useState<DepartmentManager | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [selectedManager, setSelectedManager] =
    useState<DepartmentManager | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewDetails = (manager: any) => {
    setSelectedManager(manager);
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    if (session?.user.role !== "SUPER_ADMIN") {
      router.push("/dashboard");
      return;
    }
    fetchManagers();
  }, [session, router]);

  const fetchManagers = async () => {
    try {
      const response = await fetch(
        `/api/department-managers?search=${searchQuery}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setManagers(data.managers);
    } catch (error) {
      toast.error("Erreur lors du chargement des responsables");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchManagers();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingManager
        ? `/api/department-managers/${editingManager.id}`
        : "/api/department-managers";

      const method = editingManager ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          password: formData.password || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success(
        editingManager
          ? "Responsable modifié avec succès"
          : "Responsable créé avec succès"
      );

      setIsOpen(false);
      setEditingManager(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
      });
      fetchManagers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer ce responsable ?")
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/department-managers/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      toast.success("Responsable supprimé avec succès");
      fetchManagers();
    } catch (error) {
      toast.error("Erreur lors de la suppression du responsable");
    }
  };

  const columns = [
    {
      header: "Prénom",
      accessorKey: "firstName"
    },
    {
      header: "Nom",
      accessorKey: "lastName"
    },
    {
      header: "Email",
      accessorKey: "email" as const
    },
    {
      header: "Département",
      accessorKey: "departmentName" as const,
      cell: (user: any) => {
        const departmentName = user.departmentName;
        return departmentName ? (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={tableStyles.badge.success}>
              <Building2 className="h-3 w-3" />
              {departmentName}
            </Badge>
          </div>
        ) : (
          <Badge variant="outline" className={tableStyles.badge.secondary}>
            <UserX className="h-3 w-3" />
            Non assigné
          </Badge>
        );
      }
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row: any) => {
        const manager = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <MoreHorizontal className={tableStyles.icon.base} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={tableStyles.actions.menu}
            >
              <DropdownMenuItem
                onClick={() => {
                  setEditingManager(manager);
                  setFormData({
                    firstName: manager.firstName,
                    lastName: manager.lastName,
                    email: manager.email,
                    password: ""
                  });
                  setIsOpen(true);
                }}
                className={tableStyles.actions.menuItem}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(manager.id)}
                className={tableStyles.actions.menuItemDanger}
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
    <ContentLayout title="Responsables de département">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            Responsables de département
          </h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 h-14 text-lg">
                <Users className="mr-2 h-4 w-4" />
                Nouveau responsable
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingManager
                    ? "Modifier le responsable"
                    : "Nouveau responsable"}
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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {editingManager
                      ? "Nouveau mot de passe (optionnel)"
                      : "Mot de passe"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required={!editingManager}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      setEditingManager(null);
                      setFormData({
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: ""
                      });
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    {isSubmitting
                      ? "Enregistrement..."
                      : editingManager
                      ? "Modifier"
                      : "Créer"}
                  </Button>
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
              placeholder="Rechercher un responsable..."
              className="pl-10 h-12"
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <DataTable
              data={managers}
              columns={columns as any}
              isLoading={isLoading}
              onRowClick={handleViewDetails}
              emptyMessage={
                searchQuery
                  ? `Aucun responsable trouvé pour "${searchQuery}"`
                  : "Aucun responsable disponible"
              }
            />
          </CardContent>
        </Card>
      </div>

      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        className="p-0"
      >
        <div className="relative bg-background p-6 pt-0">
          <div className="sticky top-0 z-20 bg-background pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Détails du responsable</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDrawerOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {selectedManager && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-center py-4">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                  <User2 className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>

              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <User2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Nom complet
                    </p>
                    <p className="text-lg font-medium">
                      {selectedManager.firstName} {selectedManager.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-lg font-medium">
                      {selectedManager.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Building className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Département
                    </p>
                    {selectedManager.departmentName ? (
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={tableStyles.badge.success}
                        >
                          <Building2 className="h-3 w-3 mr-1" />
                          {selectedManager.departmentName}
                        </Badge>
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className={tableStyles.badge.secondary}
                      >
                        <UserX className="h-3 w-3 mr-1" />
                        Non assigné
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      className="w-[48%]"
                      onClick={() => {
                        setEditingManager(selectedManager);
                        setFormData({
                          firstName: selectedManager.firstName,
                          lastName: selectedManager.lastName,
                          email: selectedManager.email,
                          password: ""
                        });
                        setIsOpen(true);
                        setIsDrawerOpen(false);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-[48%]"
                      onClick={() => {
                        handleDelete(selectedManager.id);
                        setIsDrawerOpen(false);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </ContentLayout>
  );
}
