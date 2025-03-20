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
import { useFileResource, useGetList } from "@/providers/dataProvider";
import { toast } from "sonner";
import {
  EvaluationType,
  Classroom,
  SubjectType,
  evaluationTypeConfig,
  subjectTypeConfig
} from "@/types/entities";
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
import Lottie from "lottie-react";
import uploadAnimation from "@/../public/animations/upload.json";

export default function CreateEvaluationPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    evaluationType: "" as EvaluationType,
    subjectType: "PDF" as SubjectType,
    startDate: new Date(),
    endDate: new Date(),
    classroomId: ""
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUploadAnimation, setShowUploadAnimation] = useState(false);

  const { mutateAsync: uploadEvaluation } = useFileResource<any>("subject");
  const { data: classroomsData } = useGetList("classroom/my-classes", {
    limit: 100,
    page: 1
  });
  const classrooms = classroomsData?.data ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    setIsSubmitting(true);
    setShowUploadAnimation(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("evaluationType", formData.evaluationType);
      formDataToSend.append("type", formData.subjectType);
      formDataToSend.append("startDate", formData.startDate.toISOString());
      formDataToSend.append("endDate", formData.endDate.toISOString());
      formDataToSend.append("classroomId", formData.classroomId);
      formDataToSend.append("file", selectedFile);

      await uploadEvaluation(formDataToSend);

      toast.success("Évaluation créée avec succès");

      setFormData({
        title: "",
        description: "",
        evaluationType: "" as EvaluationType,
        subjectType: "PDF" as SubjectType,
        startDate: new Date(),
        endDate: new Date(),
        classroomId: ""
      });
      setSelectedFile(null);

      setTimeout(() => {
        setShowUploadAnimation(false);
      }, 1500);
    } catch (error: any) {
      toast.error(
        error.message || "Une erreur est survenue lors de la création"
      );
      setShowUploadAnimation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContentLayout title="Nouvelle évaluation">
      {showUploadAnimation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-12 max-w-md w-full">
            <Lottie
              animationData={uploadAnimation}
              loop={true}
              style={{ width: 250, height: 250, margin: "0 auto" }}
            />
            <p className="text-center text-xl font-semibold mt-4">
              Création de l&apos;évaluation en cours...
            </p>
          </div>
        </div>
      )}

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
                  Type d&apos;évaluation
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

              <div className=" space-y-6 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Type de document
                  </Label>
                  <Select
                    value={formData.subjectType}
                    onValueChange={(value: SubjectType) =>
                      setFormData({ ...formData, subjectType: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner le type de document">
                        {formData.subjectType && (
                          <div className="flex items-center gap-2">
                            {React.createElement(
                              subjectTypeConfig[formData.subjectType].icon,
                              {
                                className: "h-4 w-4 text-muted-foreground"
                              }
                            )}
                            {subjectTypeConfig[formData.subjectType].label}
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(subjectTypeConfig).map(
                        ([type, config]) => {
                          const Icon = config.icon;
                          return (
                            <SelectItem
                              key={type}
                              value={type}
                              className="flex items-center gap-2 py-3"
                            >
                              <div className="flex items-center gap-2 w-full">
                                <div className="p-1 rounded-md bg-muted">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {config.label}
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
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Fichier d&apos;évaluation
                  </Label>
                  <FileUpload
                    acceptedFileTypes={
                      subjectTypeConfig[formData.subjectType].acceptedTypes
                    }
                    allowMultiple={false}
                    onFileSelect={(files) => {
                      if (files.length > 0) {
                        const file = files[0];
                        const fileExtension = `.${file.name
                          .split(".")
                          .pop()
                          ?.toLowerCase()}`;
                        const acceptedExtensions = Object.values(
                          subjectTypeConfig[formData.subjectType].acceptedTypes
                        ).flat();

                        if (acceptedExtensions.includes(fileExtension)) {
                          setSelectedFile(file);
                        } else {
                          toast.error(
                            `Type de fichier non autorisé. Types acceptés : ${acceptedExtensions.join(
                              ", "
                            )}`
                          );
                        }
                      }
                    }}
                    hideSubmitButton={true}
                  />
                </motion.div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedFile}
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    "Créer l'évaluation"
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
