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
  UserX,
  User2,
  Mail,
  Building,
  X
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
import { Avatar } from "@/components/ui/avatar";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentName: string | null;
  role: string;
};

export default function UsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "USER"
  });

  useEffect(() => {
    if (session?.user.role !== "ADMIN_DPT") {
      router.push("/dashboard");
      return;
    }
    fetchUsers();
  }, [session, router]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      toast.success("Utilisateur supprimé avec succès");
      fetchUsers();
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };
  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleEdit = (user: User, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
      role: user.role
    });
    setIsDrawerOpen(false);
    setTimeout(() => setIsOpen(true), 300);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/users?search=${searchQuery}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setUsers(data.users);
    } catch (error) {
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchUsers();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";

      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success(
        editingUser
          ? "Utilisateur modifié avec succès"
          : "Utilisateur créé avec succès"
      );

      setIsOpen(false);
      setEditingUser(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "USER"
      });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
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
      accessorKey: "email"
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row: any) => {
        const user = row;
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
                onClick={(e) => {
                  handleEdit(user, e);
                }}
                className={tableStyles.actions.menuItem}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(user.id);
                }}
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
    <ContentLayout title="Gestion des utilisateurs">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Liste des utilisateurs</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 h-14 text-lg">
                <Users className="mr-2 h-4 w-4" />
                Nouvel utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? "Modifier" : "Ajouter"}
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
                    {editingUser
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
                    required={!editingUser}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      setEditingUser(null);
                      setFormData({
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                        role: "USER"
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
                      : editingUser
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
              placeholder="Rechercher un utilisateur..."
              className="pl-10 h-12"
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <DataTable
              data={users}
              columns={columns as any}
              isLoading={isLoading}
              onRowClick={handleViewDetails}
              emptyMessage={
                searchQuery
                  ? `Aucun utilisateur trouvé pour "${searchQuery}"`
                  : "Aucun utilisateur disponible"
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
              <h2 className="text-2xl font-semibold">
                Détails de l&apos;utilisateur
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDrawerOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {selectedUser && (
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
                      {selectedUser.firstName} {selectedUser.lastName}
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
                    <p className="text-lg font-medium">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      className="w-[48%]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingUser(selectedUser);
                        setFormData({
                          firstName: selectedUser.firstName,
                          lastName: selectedUser.lastName,
                          email: selectedUser.email,
                          password: "",
                          role: "USER"
                        });
                        setIsDrawerOpen(false);
                        setTimeout(() => setIsOpen(true), 300);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-[48%]"
                      onClick={() => {
                        handleDelete(selectedUser.id);
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
      ;
    </ContentLayout>
  );
}
