"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useGetResourceWithoutParams } from "@/providers/dataProvider";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Role } from "@/types";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { ProfessorDashboard } from "@/components/dashboard/professor-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: dashboardData, isLoading } = useGetResourceWithoutParams(
    "analytics/dashboard"
  );

  if (isLoading) {
    return (
      <ContentLayout title="Tableau de bord">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[180px] w-full" />
          ))}
        </div>
      </ContentLayout>
    );
  }

  switch (session?.user?.role) {
    case Role.STUDENT:
      return <StudentDashboard data={dashboardData} />;
    case Role.PROFESSOR:
      return <ProfessorDashboard data={dashboardData} />;
    case Role.ADMIN:
      return <AdminDashboard data={dashboardData as any} />;
    default:
      return (
        <ContentLayout title="Tableau de bord">
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          </div>
        </ContentLayout>
      );
  }
}
