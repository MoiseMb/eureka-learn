"use client";

import { useSession, signOut } from "next-auth/react";
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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { AlertDialog } from "../ui/alert-dialog";
import { User, LayoutGrid } from "lucide-react";

export function UserNav() {
  const { data: session } = useSession();
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [open, setOpen] = useState(false);

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
      PROFESSOR: "Professeur",
      STUDENT: "Étudiant",
      ADMIN: "Administrateur"
    };
    return roles[role as keyof typeof roles] || role;
  };
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full bg-blue-500 text-white"
          >
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-muted">
              {getInitials()}
            </div>
          </Button>
        </DropdownMenuTrigger>

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
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex items-center">
                <LayoutGrid className="w-4 h-4 mr-3" />
                Tableau de bord
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account" className="flex items-center">
                <User className="w-4 h-4 mr-3" />
                Mon profil
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 cursor-pointer"
            onClick={() => {
              setOpen(false);
              setShowSignOutDialog(true);
            }}
          >
            Se déconnecter
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        isOpen={showSignOutDialog}
        onClose={() => setShowSignOutDialog(false)}
        title="Se déconnecter"
        description="Êtes-vous sûr de vouloir vous déconnecter ?"
        onConfirm={handleLogout}
        confirmText="Se déconnecter"
        cancelText="Annuler"
      />
    </>
  );
}
