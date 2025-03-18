"use client";

import React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { useCreateResource, useGetList } from "@/providers/dataProvider";
import { toast } from "sonner";
import { EvaluationType, Classroom } from "@/types/entities";
import FileUpload from "@/components/file-upload";
import { motion } from "framer-motion";
import {
  Book,
  Calendar,
  FileText,
  Clock,
  Users,
  School,
  Code2,
  Database,
  Binary,
  Terminal,
  Braces,
  FileCode2,
  GraduationCap,
  Hash,
  Blocks,
  Network
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ContentLayout } from "@/components/admin-panel/content-layout";

const evaluationTypeConfig = {
  POO_JAVA: {
    label: "Programmation Orientée Objet (Java)",
    icon: Braces,
    color: "text-red-500",
    description: "Concepts et pratiques de la POO en Java"
  },
  C_LANGUAGE: {
    label: "Langage C",
    icon: Code2,
    color: "text-blue-500",
    description: "Programmation bas niveau et gestion de la mémoire"
  },
  SQL: {
    label: "Base de données (SQL)",
    icon: Database,
    color: "text-green-500",
    description: "Requêtes et conception de bases de données"
  },
  PYTHON: {
    label: "Python",
    icon: Hash,
    color: "text-yellow-500",
    description: "Programmation Python et ses frameworks"
  },
  ALGORITHMS: {
    label: "Algorithmes",
    icon: Network,
    color: "text-purple-500",
    description: "Conception et analyse d'algorithmes"
  },
  DATA_STRUCTURES: {
    label: "Structures de Données",
    icon: Blocks,
    color: "text-orange-500",
    description: "Implémentation et utilisation des structures de données"
  }
} as const;

export default function CreateEvaluationPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    evaluationType: "" as EvaluationType,
    startDate: new Date(),
    endDate: new Date(),
    fileUrl: "",
    classroomId: ""
  });

  const { data: classroomsData } = useGetList("classroom/my-classes", {
    limit: 100,
    page: 1
  });
  const classrooms = classroomsData?.data ?? [];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: createEvaluation } = useCreateResource("evaluation");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createEvaluation(formData, {
        onSuccess: () => {
          toast.success("Évaluation créée avec succès");
          setFormData({
            title: "",
            description: "",
            evaluationType: "" as EvaluationType,
            startDate: new Date(),
            endDate: new Date(),
            fileUrl: "",
            classroomId: ""
          });
        },
        onError: (error: Error) => {
          toast.error(error.message || "Erreur lors de la création");
        }
      });
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContentLayout title="Nouvelle évaluation">
      <div className="max-w-4xl mx-auto">
        <Card className="border-t-4 border-t-primary shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Book className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Créer une évaluation</CardTitle>
                <CardDescription>
                  Remplissez les informations pour créer une nouvelle évaluation
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="classroomId"
                    className="flex items-center gap-2"
                  >
                    <School className="h-4 w-4 text-muted-foreground" />
                    Classe
                  </Label>
                  <Select
                    value={formData.classroomId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, classroomId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une classe" />
                    </SelectTrigger>
                    <SelectContent>
                      {classrooms.map((classroom: Classroom) => (
                        <SelectItem
                          key={classroom.id}
                          value={classroom.id.toString()}
                        >
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {classroom.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>

              <Separator />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Label
                  htmlFor="description"
                  className="flex items-center gap-2"
                >
                  <Book className="h-4 w-4 text-muted-foreground" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description détaillée de l'évaluation"
                  className="min-h-[100px] border-primary/20"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <Label className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  Type d'évaluation
                </Label>
                <Select
                  value={formData.evaluationType}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      evaluationType: value as EvaluationType
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner le type d'évaluation">
                      {formData.evaluationType && (
                        <div className="flex items-center gap-2">
                          {evaluationTypeConfig[
                            formData.evaluationType as keyof typeof evaluationTypeConfig
                          ].icon && (
                            <div
                              className={`${
                                evaluationTypeConfig[
                                  formData.evaluationType as keyof typeof evaluationTypeConfig
                                ].color
                              }`}
                            >
                              {React.createElement(
                                evaluationTypeConfig[
                                  formData.evaluationType as keyof typeof evaluationTypeConfig
                                ].icon,
                                { size: 16 }
                              )}
                            </div>
                          )}
                          {
                            evaluationTypeConfig[
                              formData.evaluationType as keyof typeof evaluationTypeConfig
                            ].label
                          }
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(evaluationTypeConfig).map(
                      ([type, config]) => {
                        const Icon = config.icon;
                        return (
                          <SelectItem
                            key={type}
                            value={type}
                            className="flex items-center gap-2 py-3"
                          >
                            <div className="flex items-center gap-2 w-full">
                              <div className={`p-1 rounded-md ${config.color}`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {config.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {config.description}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      }
                    )}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid gap-6 md:grid-cols-2"
              >
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
                    minDate={new Date()}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Date de fin
                  </Label>
                  <DateTimePicker
                    value={formData.endDate}
                    onChange={(date) =>
                      setFormData({ ...formData, endDate: date || new Date() })
                    }
                    minDate={formData.startDate}
                  />
                </div>
              </motion.div>

              <div className="space-y-2">
                <Label>Fichier d'évaluation</Label>
                <FileUpload
                  acceptedFileTypes={{
                    "application/pdf": [".pdf"],
                    "application/msword": [".doc", ".docx"]
                  }}
                  allowMultiple={false}
                  onFileSelect={(files) =>
                    setFormData({
                      ...formData,
                      fileUrl: files[0] ? URL.createObjectURL(files[0]) : ""
                    })
                  }
                  hideSubmitButton={true}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" className="w-32">
                  Annuler
                </Button>
                <Button type="submit" className="w-32" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4 animate-spin" />
                      Création...
                    </motion.div>
                  ) : (
                    "Créer"
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
