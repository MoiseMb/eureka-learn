"use client";

import { useState } from "react";
import { useGetList } from "@/providers/dataProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Users, BookOpen, GraduationCap } from "lucide-react";
import { Classroom } from "@/types/entities";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function MyClassesPage() {
  const [params, setParams] = useState({
    page: 1,
    limit: 8,
    search: ""
  });

  const { data, isLoading } = useGetList("classroom/my-classes", params);
  const classes = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <ContentLayout title="Mes Classes">
      <div className="space-y-6">
        <div className="relative max-w-md">
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

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                </Card>
              ))
            : classes.map((classroom: Classroom) => (
                <Card
                  key={classroom.id}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-white to-gray-50"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-bold">
                        {classroom.name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-sm">
                        {classroom.students?.length || 0} élèves
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {classroom.description || "Aucune description"}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span>Élèves actifs</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4 text-green-500" />
                        <span>Cours disponibles</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="h-4 w-4 text-purple-500" />
                        <span>Évaluations en cours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setParams((prev) => ({ ...prev, page: i + 1 }))}
                className={`w-8 h-8 rounded-full ${
                  params.page === i + 1
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
