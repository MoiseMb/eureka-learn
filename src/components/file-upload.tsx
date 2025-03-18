"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FileWithPreview extends File {
    preview: string;
}
interface MultiFileUploadProps {
    title?: string;
    description?: string;
    buttonText?: string;
    onSubmit?: ((files: File[], formData: FormData) => Promise<void>) | null;
    onSuccess?: (response: any) => void;
    onError?: (error: any) => void;
    allowMultiple?: boolean;
    acceptedFileTypes?: Record<string, string[]>;
    additionalData?: Record<string, any>;
    onFileSelect?: (files: File[]) => void;
    hideSubmitButton?: boolean;
    anonymizeFileNames?: boolean;
}
export default function MultiFileUpload({
    title = "Uploader les documents",
    description = "",
    buttonText = "uploader",
    onSubmit,
    onSuccess,
    onError,
    allowMultiple = false,
    acceptedFileTypes = {
        "image/*": [],
        "application/pdf": [],
    },
    additionalData = {},
    onFileSelect,
    hideSubmitButton = false,
    anonymizeFileNames = false,
}: MultiFileUploadProps) {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (!allowMultiple && acceptedFiles.length > 1) {
                setError("Veuillez sélectionner un seul fichier");
                return;
            }

            setFiles((prevFiles) => [
                ...prevFiles,
                ...acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                ),
            ]);

            onFileSelect?.(acceptedFiles);
            setError(null);
        },
        [allowMultiple, onFileSelect]
    );
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: acceptedFileTypes,
        multiple: allowMultiple,
    });
    const removeFile = (file: FileWithPreview) => {
        setFiles((prevFiles) => {
            const newFiles = prevFiles.filter((f) => f !== file);
            onFileSelect?.(newFiles);
            return newFiles;
        });
    };
    const handleUpload = async () => {
        if (files.length === 0) {
            setError("Veuillez sélectionner au moins un fichier");
            return;
        }

        setLoading(true);
        setError(null);
        setUploadProgress(0);
        try {
            const formData = new FormData();
            files.forEach((file, index) => {
                formData.append(`file${allowMultiple ? `[${index}]` : ""}`, file);
            });
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, value);
            });
            await onSubmit?.(files, formData);
            onSuccess?.({ message: "Upload réussi" });
            setFiles([]);
            setUploadProgress(100);
            setTimeout(() => {
                setUploadProgress(0);
            }, 1000);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || "Une erreur s'est produite";
            setError(errorMessage);
            onError?.(err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container mx-auto py-8">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-center">{title}</CardTitle>
                    <CardDescription className="text-center">{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center w-full">
                        <motion.div
                            {...getRootProps({
                                onClick: (e) => {
                                    e.stopPropagation();
                                    open();
                                },
                            })}
                            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Cliquez pour uploader</span> ou faites glisser et déposez
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, ou TXT (MAX. 10MB)</p>
                            </div>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        className="p-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <ul className="space-y-2">
                            {files.map((file, index) => (
                                <motion.li
                                    key={file.name}
                                    className="flex items-center justify-between bg-gray-100 p-3 rounded-md mb-2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2, delay: index * 0.1 }}
                                >
                                    <div className="flex items-center">
                                        <FileText className="w-5 h-5 text-blue-500" />
                                        <span className="text-sm text-gray-700">{anonymizeFileNames ? `Candidat ${index + 1}` : file.name}</span>
                                    </div>
                                    <motion.button
                                        onClick={() => removeFile(file)}
                                        className="text-red-500 hover:text-red-700"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <X size={18} />
                                    </motion.button>
                                </motion.li>
                            ))}
                        </ul>
                        {uploadProgress > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        )}
                        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

                        {!hideSubmitButton &&
                            <div className="w-full flex justify-center">
                                <Button
                                    onClick={handleUpload}
                                    size={"lg"}
                                    className="mx-auto mt-4"
                                    disabled={loading}
                                >
                                    {loading ? "en cours..." : buttonText}
                                </Button>
                            </div>
                        }

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}