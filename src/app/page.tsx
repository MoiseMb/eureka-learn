import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, AlertCircle, Clock, LineChart, ClipboardCheck } from "lucide-react";
import Link from "next/link"; // Import de Link pour la navigation

export default function StudentDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminPanelLayout hideSidebar={true}> {/* On masque la sidebar */}
      <ContentLayout title="Tableau de bord">
        <div className="flex h-screen">
          {/* Sidebar - Nouveau menu étudiant */}
          <div className="w-64 bg-blue-100 p-6 flex flex-col space-y-6 min-h-screen">
            {/* Logo Eureka Learn */}
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg shadow-lg mr-2">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl text-blue-900">Eureka</span>
              <span className="ml-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-2 py-0.5 rounded-md text-lg shadow-sm">
                Learn
              </span>
            </div>

            {/* Menu étudiant */}
            <div className="flex flex-col space-y-4">
              <Link href="/traiter-un-sujet">
                <div className="flex items-center space-x-2 p-2 hover:bg-blue-200 rounded-lg cursor-pointer">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-900">Traiter un sujet</span>
                </div>
              </Link>
              <Link href="/consulter-correction">
                <div className="flex items-center space-x-2 p-2 hover:bg-blue-200 rounded-lg cursor-pointer">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-900">Consulter la correction</span>
                </div>
              </Link>
              <Link href="/Depot reponse">
                <div className="flex items-center space-x-2 p-2 hover:bg-blue-200 rounded-lg cursor-pointer">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-900">Joindre ma réponse</span>
                </div>
              </Link>
              <Link href="/suivre-performance">
                <div className="flex items-center space-x-2 p-2 hover:bg-blue-200 rounded-lg cursor-pointer">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-900">Suivre Performance</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Contenu principal bien aligné à droite */}
          <div className="flex-1 p-6">
            {/* Bannière Bleue */}
            <div className="bg-blue-400 text-white p-10 rounded-2xl shadow-lg mb-6">
              <h1 className="text-3xl font-bold text-center">
                Bienvenue sur le Système d'Évaluation Automatisée
              </h1>
              <p className="text-center text-lg mt-2">Tableau de bord étudiant</p>

              {/* Section des cartes */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Carte 1 - Mes cours */}
                <div className="bg-blue-300 bg-opacity-50 p-6 rounded-xl text-center shadow-md">
                  <BookOpen className="h-10 w-10 mx-auto mb-3" />
                  <h2 className="text-xl font-bold">Sujets </h2>
                  <p className="text-sm mt-2">
                    Consultez vos sujets d'examen à traiter 
                  </p>
                </div>

                {/* Carte 2 - Mes performances */}
                <div className="bg-blue-300 bg-opacity-50 p-6 rounded-xl text-center shadow-md">
                  <LineChart className="h-10 w-10 mx-auto mb-3" />
                  <h2 className="text-xl font-bold">Mes performances</h2>
                  <p className="text-sm mt-2">
                    Suivez vos progrès et vos résultats.
                  </p>
                </div>

                {/* Carte 3 - Mes corrections */}
                <div className="bg-blue-300 bg-opacity-50 p-6 rounded-xl text-center shadow-md">
                  <ClipboardCheck className="h-10 w-10 mx-auto mb-3" />
                  <h2 className="text-xl font-bold">Mes corrections</h2>
                  <p className="text-sm mt-2">
                    Voir les corrections proposées par vos enseignants.
                  </p>
                </div>
              </div>
            </div>

    
          </div>
        </div>
      </ContentLayout>
    </AdminPanelLayout>
  );
}
