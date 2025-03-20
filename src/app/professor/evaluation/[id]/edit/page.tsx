"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetResource, useUpdateResource } from "@/providers/dataProvider";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Book, School, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  EvaluationType,
  evaluationTypeConfig,
  SubjectType,
  subjectTypeConfig,
  Subject
} from "@/types/entities";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import FileUpload from "@/components/file-upload";

export default function EditEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    evaluationType: "" as EvaluationType,
    subjectType: "PDF" as SubjectType,
    startDate: new Date(),
    endDate: new Date(),
    classroomId: 0,
    fileUrl: ""
  });

  const { data: evaluation, isLoading } = useGetResource<Subject>(
    "subject",
    params.id as string
  );

  const { mutateAsync: updateEvaluation } = useUpdateResource("subject");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (evaluation) {
      setFormData({
        title: evaluation.title,
        description: evaluation.description || "",
        evaluationType: evaluation.evaluationType as EvaluationType,
        subjectType: (evaluation.type as SubjectType) || "PDF",
        startDate: new Date(evaluation.startDate),
        endDate: new Date(evaluation.endDate),
        classroomId: evaluation.classroomId,
        fileUrl: evaluation.fileUrl
      });
    }
  }, [evaluation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "startDate" || key === "endDate") {
          formDataToSend.append(key, (value as Date).toISOString());
        } else {
          formDataToSend.append(key, String(value));
        }
      });

      await updateEvaluation({
        id: params.id as string,
        data: formDataToSend
      });

      toast.success("Évaluation modifiée avec succès");
      router.push("/professor/evaluation");
    } catch (error) {
      toast.error("Erreur lors de la modification de l&apos;évaluation");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ContentLayout title="Modifier l'évaluation">
        <div className="flex items-center justify-center min-h-[400px]">
          <Clock className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Modifier l'évaluation">
      <div className="max-w-4xl mx-auto">
        <Card className="border-t-4 border-t-primary shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Book className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">
                  Modifier l&apos;évaluation
                </CardTitle>
                <CardDescription>
                  Modifiez les informations de l&apos;évaluation
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Titre */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Titre
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Titre de l'évaluation"
                    className="border-primary/20"
                    required
                  />
                </div>

                {/* Classe */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    Classe
                  </Label>
                  <Select
                    value={formData.classroomId.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, classroomId: Number(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une classe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class1">Classe 1</SelectItem>
                      <SelectItem value="class2">Classe 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Description de l'évaluation"
                    className="min-h-[100px] border-primary/20"
                  />
                </div>

                {/* Type d'évaluation */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Type d'évaluation
                  </Label>
                  <Select
                    value={formData.evaluationType}
                    onValueChange={(value: EvaluationType) =>
                      setFormData({ ...formData, evaluationType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(evaluationTypeConfig).map(
                        ([type, config]) => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              {React.createElement(config.icon, {
                                className: `h-4 w-4 ${config.color}`
                              })}
                              {config.label}
                            </div>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Type de sujet
                  </Label>
                  <Select
                    value={formData.subjectType}
                    onValueChange={(value: SubjectType) =>
                      setFormData({ ...formData, subjectType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(subjectTypeConfig).map(
                        ([type, config]) => (
                          <SelectItem key={type} value={type}>
                            {config.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Date de début
                  </Label>
                  <DateTimePicker
                    value={formData.startDate}
                    onChange={(date) =>
                      setFormData({
                        ...formData,
                        startDate: date || new Date()
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Date de fin
                  </Label>
                  <DateTimePicker
                    value={formData.endDate}
                    onChange={(date) =>
                      setFormData({ ...formData, endDate: date || new Date() })
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <FileUpload
                    title="Modifier le sujet"
                    description="Formats acceptés : PDF"
                    buttonText="Choisir un fichier"
                    acceptedFileTypes={{
                      "application/pdf": [".pdf"]
                    }}
                    onFileSelect={(files) => {
                      if (files.length > 0) {
                        setSelectedFile(files[0]);
                      }
                    }}
                    hideSubmitButton
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/professor/evaluation")}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 animate-spin" />
                      Modification...
                    </div>
                  ) : (
                    "Enregistrer"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
