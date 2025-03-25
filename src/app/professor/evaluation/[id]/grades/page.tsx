"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetResource, useUpdateResource } from "@/providers/dataProvider";
import EvaluationGradesView from "@/components/mark-list";
import { toast } from "sonner";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function MarksPage() {
  const params = useParams();
  const { data, isLoading, error } = useGetResource(
    `subject/students-grades`,
    params.id as string
  );

  const { mutateAsync: updateGrade } = useUpdateResource(`correction`);

  const handleSaveGrade = async (
    studentId: number,
    submissionId: number,
    score: number,
    notes: string
  ) => {
    try {
      await updateGrade({
        id: submissionId,
        score,
        notes
      });
    } catch (error) {
      throw error;
    }
  };

  const handleViewSubmission = (fileUrl: string, studentName: string) => {
    window.open(fileUrl, "_blank");
  };

  if (error) {
    toast.error("Erreur", {
      description: "Impossible de charger les notes. Veuillez réessayer."
    });
    return null;
  }

  if (!data || isLoading) return null;

  return (
    <ContentLayout title="Notes" showBackButton={true}>
      <EvaluationGradesView
        data={data as any}
        onViewSubmission={handleViewSubmission}
        onSaveGrade={handleSaveGrade}
      />
    </ContentLayout>
  );
}
