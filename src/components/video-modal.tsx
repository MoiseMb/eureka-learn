"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  driveFileId: string;
}

export function VideoModal({ isOpen, onClose, driveFileId }: VideoModalProps) {
  // Convertir l'URL Google Drive en URL d'intégration
  const embedUrl = `https://drive.google.com/file/d/${driveFileId}/preview`;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg border p-0 overflow-hidden w-[90vw] max-w-4xl"
          )}
        >
          <div className="relative pt-[56.25%]">
            <iframe
              src={embedUrl}
              allow="autoplay"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
