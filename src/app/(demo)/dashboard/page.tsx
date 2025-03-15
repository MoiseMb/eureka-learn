"use client";

import { useSession } from "next-auth/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  ClipboardList,
  Shield,
  TrendingUp,
  User2
} from "lucide-react";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function DashboardPage() {
  const { data: session } = useSession();
  // Update the refs with proper typing
  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const pieChartRef = useRef<HTMLCanvasElement | null>(null);

  // Données fictives pour les statistiques
  const budgetData = [
    { departement: "Informatique", budget: 75000000 },
    { departement: "Gestion", budget: 45000000 },
    { departement: "Mecanique", budget: 60000000 },
    { departement: "Biologie", budget: 55000000 }
  ];

  const repartitionData = [
    { categorie: "Équipement", montant: 35 },
    { categorie: "Recherche", montant: 25 },
    { categorie: "Formation", montant: 20 },
    { categorie: "Fonctionnement", montant: 20 }
  ];

  useEffect(() => {
    // Bar Chart
    const barCanvas = barChartRef.current;
    if (barCanvas) {
      const barCtx = barCanvas.getContext("2d");
      if (!barCtx) return;

      // Destroy existing chart if it exists
      if ((barCanvas as any).chart) {
        (barCanvas as any).chart.destroy();
      }

      const barChart = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: budgetData.map((item) => item.departement),
          datasets: [
            {
              label: "Budget (FCFA)",
              data: budgetData.map((item) => item.budget),
              backgroundColor: [
                "rgba(54, 162, 235, 0.7)",
                "rgba(75, 192, 192, 0.7)",
                "rgba(153, 102, 255, 0.7)",
                "rgba(255, 159, 64, 0.7)"
              ],
              borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)"
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return value.toLocaleString("fr-FR") + " FCFA";
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  let value = context.raw as number;
                  return `Budget: ${value.toLocaleString("fr-FR")} FCFA`;
                }
              }
            }
          },
          maintainAspectRatio: false
        }
      });

      // Store chart instance
      (barCanvas as any).chart = barChart;
    }

    // Pie Chart
    const pieCanvas = pieChartRef.current;
    if (pieCanvas) {
      const pieCtx = pieCanvas.getContext("2d");
      if (!pieCtx) return;

      // Destroy existing chart if it exists
      if ((pieCanvas as any).chart) {
        (pieCanvas as any).chart.destroy();
      }

      const pieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: repartitionData.map((item) => item.categorie),
          datasets: [
            {
              data: repartitionData.map((item) => item.montant),
              backgroundColor: [
                "rgba(54, 162, 235, 0.7)",
                "rgba(255, 99, 132, 0.7)",
                "rgba(255, 206, 86, 0.7)",
                "rgba(75, 192, 192, 0.7)"
              ],
              borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)"
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  let value = context.raw;
                  return `${value}%`;
                }
              }
            },
            legend: {
              position: "bottom"
            }
          },
          maintainAspectRatio: false
        }
      });

      // Store chart instance
      (pieCanvas as any).chart = pieChart;
    }

    // Cleanup
    return () => {
      if (barChartRef.current && (barChartRef.current as any).chart) {
        (barChartRef.current as any).chart.destroy();
      }
      if (pieChartRef.current && (pieChartRef.current as any).chart) {
        (pieChartRef.current as any).chart.destroy();
      }
    };
  }, []);

  return (
    <ContentLayout title="Tableau de bord">
      <div className="space-y-8">
        {/* Section Hero */}
        <div className="relative overflow-hidden rounded-lg border-none bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500">
          <div className="relative p-6 md:p-10 backdrop-blur-sm bg-black/5">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold text-white mb-4">
                Bienvenue sur le Système de Gestion Budgétaire
              </h1>
              <p className="text-lg text-white/90 mb-8">
                Plateforme de gestion des budgets de l&apos;Université Cheikh
                Anta Diop de Dakar
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/10 border-none">
                  <CardContent className="pt-6">
                    <ClipboardList className="h-8 w-8 text-white mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Demandes
                    </h3>
                    <p className="text-white/80">
                      Gérez vos demandes de budget en toute simplicité
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-none">
                  <CardContent className="pt-6">
                    <TrendingUp className="h-8 w-8 text-white mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Suivi
                    </h3>
                    <p className="text-white/80">
                      Suivez l&apos;évolution de vos budgets en temps réel
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-none">
                  <CardContent className="pt-6">
                    <Shield className="h-8 w-8 text-white mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Sécurité
                    </h3>
                    <p className="text-white/80">
                      Gestion sécurisée des données budgétaires
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nouvelle section statistiques */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <Card className="col-span-2 border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle>Budget par Département (FCFA)</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: "300px", position: "relative" }}>
              <canvas ref={barChartRef}></canvas>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-shadow mt-4">
          <CardHeader className="border-b">
            <CardTitle>Répartition Budgétaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: "300px", position: "relative" }}>
              <canvas ref={pieChartRef}></canvas>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section statistiques clés */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        <Card className="border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">235.000.000 FCFA</div>
            <p className="text-xs text-muted-foreground">Année 2024</p>
          </CardContent>
        </Card>

        <Card className="border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Taux d&apos;Exécution
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">
              +12% depuis le dernier trimestre
            </p>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
