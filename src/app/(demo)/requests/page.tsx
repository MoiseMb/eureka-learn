"use client";

import { useSession } from "next-auth/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, FileText } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { toast } from "sonner";

interface Request {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  category: string;
  status: string;
  createdAt: string;
}

export default function RequestsPage() {
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 0,
    unitPrice: 0,
    category: ""
  });

  const columns = [
    {
      header: "Nom",
      accessorKey: "name"
    },
    {
      header: "Catégorie",
      accessorKey: "category"
    },
    {
      header: "Description",
      accessorKey: "description"
    },
    {
      header: "Quantité",
      accessorKey: "quantity"
    },
    {
      header: "Prix unitaire",
      accessorKey: "unitPrice",
      cell: (row: Request) => `${row.unitPrice.toLocaleString("fr-FR")} FCFA`
    },
    {
      header: "Montant total",
      accessorKey: "totalAmount",
      cell: (row: Request) => `${row.totalAmount.toLocaleString("fr-FR")} FCFA`
    },
    {
      header: "Statut",
      accessorKey: "status",
      cell: (row: Request) => getStatusBadge(row.status)
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row: Request) => (
        <Button variant="ghost" size="sm">
          <FileText className="h-4 w-4" />
        </Button>
      )
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800"
    };
    const statusLabels = {
      PENDING: "En attente",
      APPROVED: "Approuvé",
      REJECTED: "Rejeté"
    };
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {statusLabels[status as keyof typeof statusLabels]}
      </Badge>
    );
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/requests");
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setRequests(data.requests);
    } catch (error) {
      toast.error("Erreur lors du chargement des demandes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      toast.success("Demande créée avec succès");
      setIsDialogOpen(false);
      fetchRequests();
    } catch (error) {
      toast.error("Erreur lors de la création de la demande");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const calculateTotalAmount = () => {
    return requests.reduce((total, request) => total + request.totalAmount, 0);
  };

  return (
    <ContentLayout title="Demandes de Budget">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Gestion des Demandes
            </h1>
            <p className="text-muted-foreground">
              Gérez vos demandes de budget et suivez leur statut
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 h-14 text-lg ">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouvelle Demande
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer une nouvelle demande</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nom de la demande"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Équipement">Équipement</option>
                    <option value="Fourniture">Fourniture</option>
                    <option value="Service">Service</option>
                    <option value="Formation">Formation</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Description de la demande"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantité</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value)
                      })
                    }
                    placeholder="Quantité"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Prix unitaire (FCFA)</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        unitPrice: parseInt(e.target.value)
                      })
                    }
                    placeholder="Prix unitaire"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Soumettre la demande
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Montant Total des Demandes</h3>
              <p className="text-3xl font-bold text-teal-600">
                {calculateTotalAmount().toLocaleString("fr-FR")} FCFA
              </p>
            </div>
          </div>
        </div>

        <DataTable
          data={requests}
          columns={columns as any}
          isLoading={isLoading}
          emptyMessage="Aucune demande trouvée"
        />
      </div>
    </ContentLayout>
  );
}
