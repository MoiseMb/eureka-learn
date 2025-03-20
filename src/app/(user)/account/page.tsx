"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
// Add Building2 to imports
import {
  User2,
  KeyRound,
  Save,
  Loader2,
  Building2,
  Shield
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AccountPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const translateRole = (role: string) => {
    const roles = {
      ADMIN: " Administrateur",
      TEACHER: "Enseignant",
      STUDENT: "Étudiant"
    };
    return roles[role as keyof typeof roles] || role;
  };
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        email: session.user.email
      }));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("Les mots de passe ne correspondent pas");
        }
      }

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          ...(formData.newPassword && {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          })
        })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du profil");
      }

      toast.success("Profil mis à jour avec succès");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContentLayout title="Mon profil">
      <div className="container max-w-4xl py-6">
        <div className="flex flex-col gap-8">
          <Card className="border-none bg-gradient-to-r from-blue-500 to-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center">
                  <User2 className="h-12 w-12 text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">
                    {session?.user?.firstName} {session?.user?.lastName}
                  </h2>
                  <p className="text-blue-100">{session?.user?.email}</p>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className="bg-white/10 text-white border-white/20"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {translateRole(session?.user?.role || "")}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <User2 className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-lg">
                  Informations personnelles
                </h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 mb-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex flex-col gap-2 p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <span className="text-sm">Rôle</span>
                    </div>
                    <span className="text-lg font-medium">
                      {translateRole(session?.user?.role || "")}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
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
                    />
                  </div>
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
                  />
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold text-lg">
                      Changer le mot de passe
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">
                        Mot de passe actuel
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currentPassword: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">
                          Nouveau mot de passe
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              newPassword: e.target.value
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirmer le mot de passe
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 h-12 text-md"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Enregistrer les modifications
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentLayout>
  );
}
