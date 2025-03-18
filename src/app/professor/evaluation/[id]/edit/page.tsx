"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetResource, useUpdateResource } from "@/providers/dataProvider";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent } from "@/components/ui/card";
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
import { FileText, Calendar } from "lucide-react";
import { toast } from "sonner";
import { evaluationTypeConfig, Subject } from "@/types/entities";
import { motion } from "framer-motion";
import { DateTimePicker } from "@/components/ui/date-time-picker";

interface FormData {
  title: string;
  description: string;
  evaluationType: string;
  startDate: Date;
  endDate: Date;
  classroomId: string;
  fileUrl: string;
}

export default function EditEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    evaluationType: "",
    startDate: new Date(),
    endDate: new Date(),
    classroomId: "",
    fileUrl: ""
  });

  const { data: evaluation, isLoading } = useGetResource<Subject>(
    "subject",
    params.id.toString()
  );

  const { mutateAsync: updateEvaluation } = useUpdateResource("subject");

  useEffect(() => {
    if (evaluation) {
      setFormData({
        title: evaluation.title,
        description: evaluation.description || "",
        evaluationType: evaluation.evaluationType,
        startDate: new Date(evaluation.startDate),
        endDate: new Date(evaluation.endDate),
        classroomId: evaluation.classroomId?.toString() || "",
        fileUrl: evaluation.fileUrl
      });
    }
  }, [evaluation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToUpdate = {
        title: formData.title,
        description: formData.description,
        evaluationType: formData.evaluationType,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        classroomId: formData.classroomId
      };

      await updateEvaluation({
        id: params.id as string,
        data: dataToUpdate
      });

      toast.success("Évaluation modifiée avec succès");
      router.push("/professor/evaluation");
    } catch (error) {
      toast.error("Erreur lors de la modification de l'évaluation");
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <ContentLayout title="Modifier l'évaluation">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Titre
                </Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Titre de l'évaluation"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Description
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description de l'évaluation"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Type d'évaluation
                </Label>
                <Select
                  value={formData.evaluationType}
                  onValueChange={(value) =>
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
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
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
                </motion.div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/professor/evaluation")}
                >
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
