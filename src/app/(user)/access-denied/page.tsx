"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AccessDenied() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
      <p className="mb-6">
        Vous navez pas les autorisations nécessaires pour accéder à cette page.
      </p>
      {session?.user && (
        <p className="mb-6">
          Connecté en tant que: {session.user.email} (Rôle: {session.user.role})
        </p>
      )}
      <Link href="/dashboard" className="text-blue-600 hover:underline">
        Retourner au tableau de bord
      </Link>
    </div>
  );
}
