import Link from "next/link";
import { ShieldOff } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-lg w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 p-4 rounded-full text-white">
            <ShieldOff className="h-10 w-10" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Accès non autorisé</h1>
        <p className="text-gray-700 mb-6">
          Vous n'avez pas l'autorisation d'accéder à cette page ou elle n'existe pas.
        </p>
        <Link href="/">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow">
            Retour à l'accueil
          </button>
        </Link>
      </div>
    </div>
  );
}
