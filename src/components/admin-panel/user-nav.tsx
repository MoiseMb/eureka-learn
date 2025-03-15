"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LayoutGrid, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useState } from "react";
import { LogOut, AlertCircle } from "lucide-react";

export function UserNav() {
  const { data: session } = useSession();
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [open, setOpen] = useState(false); // Add this state for dropdown

  const getInitials = () => {
    if (session?.user?.firstName && session?.user?.lastName) {
      return `${session.user.firstName[0]}${session.user.lastName[0]}`.toUpperCase();
    }
    return "UV";
  };

  const getFullName = () => {
    if (session?.user?.firstName && session?.user?.lastName) {
      return `${session.user.firstName} ${session.user.lastName}`;
    }
    return "Utilisateur";
  };

  const translateRole = (role: string) => {
    const roles = {
      SUPER_ADMIN: " Administrateur",
      ADMIN_DPT: "Responsable Département",
      USER: "Personnel"
    };
    return roles[role as keyof typeof roles] || role;
  };

  const handleSignOut = () => {
    setShowSignOutDialog(false);
    signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={getFullName()} />
                    <AvatarFallback className="bg-teal-500 text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Profile</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {getFullName()}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session?.user?.email}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {translateRole(session?.user?.role || "")}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <Link href="/dashboard" className="flex items-center">
                <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
                Acceuil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <Link href="/account" className="flex items-center">
                <User className="w-4 h-4 mr-3 text-muted-foreground" />
                Profile
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false); // Close dropdown
              setShowSignOutDialog(true);
            }}
          >
            Se déconnecter
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={showSignOutDialog}
        onOpenChange={(open) => {
          setShowSignOutDialog(open);
          if (!open) setOpen(false); // Ensure dropdown is closed when dialog closes
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-3">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100/80">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <DialogTitle className="text-center text-xl">
              Confirmation de déconnexion
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Vous êtes sur le point de vous déconnecter de votre session.
              Voulez-vous continuer ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center gap-2 sm:justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => setShowSignOutDialog(false)}
              className="h-14 text-lg mr-8"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="h-14 text-lg"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnecter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
