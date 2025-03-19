"use client"
import React from 'react';
import { FileCheck, CheckCircle, BarChart2, Database, Users, MessageSquare, Mail, Github, Twitter, BookOpen, Upload, Download, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

function App() {
    const router= useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 text-transparent bg-clip-text">Eureka-Learn</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="text-blue-200 hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#roles" className="text-blue-200 hover:text-white transition-colors">Rôles</a>
            <a href="#workflow" className="text-blue-200 hover:text-white transition-colors">Processus</a>
            <a href="#faq" className="text-blue-200 hover:text-white transition-colors">FAQ</a>
          </div>
          <div>
            <button 
              onClick={() =>router.push('/login')}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              <span className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Connexion
              </span>
            </button>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-blue-100 to-white text-transparent bg-clip-text">
                Évaluation automatisée des exercices de bases de données
              </h1>
              <p className="text-xl mb-8 text-blue-200">
                Simplifiez la gestion et la correction de vos examens SQL avec notre plateforme d'évaluation intelligente.
              </p>
              <div className="flex space-x-4">
                <button className="flex items-center px-6 py-3 bg-gradient-to-r from-white to-blue-100 text-blue-900 rounded-lg hover:from-blue-50 hover:to-white transition-all duration-300 shadow-lg hover:shadow-white/25">
                  <Users className="h-5 w-5 mr-2" />
                  Espace professeur
                </button>
                <button className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Espace étudiant
                </button>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transform rotate-6 scale-105 opacity-25 blur-xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1600&q=80"
                  alt="Database Evaluation Platform"
                  className="relative rounded-lg shadow-2xl transform transition-transform hover:scale-105 duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-blue-900 to-blue-700 text-transparent bg-clip-text">Fonctionnalités principales</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-full inline-block mb-4 shadow-lg">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-blue-900">Dépôt simplifié</h3>
              <p className="text-gray-600">
                Téléchargez vos sujets et réponses en format PDF en quelques clics.
              </p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-full inline-block mb-4 shadow-lg">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-blue-900">Correction automatique</h3>
              <p className="text-gray-600">
                Évaluation instantanée des requêtes SQL avec feedback détaillé.
              </p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-full inline-block mb-4 shadow-lg">
                <BarChart2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-blue-900">Suivi des résultats</h3>
              <p className="text-gray-600">
                Tableau de bord complet pour suivre les corrections et les notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Pour chaque utilisateur</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Administrateurs</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li>• Gestion des comptes utilisateurs</li>
                <li>• Statistiques générales</li>
                <li>• Configuration système</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Professeurs</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li>• Création d'examens</li>
                <li>• Affectation aux classes</li>
                <li>• Validation des corrections</li>
                <li>• Publication des résultats</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FileCheck className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Étudiants</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li>• Accès aux examens</li>
                <li>• Dépôt des réponses</li>
                <li>• Suivi des corrections</li>
                <li>• Consultation des notes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Processus simplifié</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold mb-6">Pour les professeurs</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <Upload className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Création d'examen</h4>
                      <p className="text-gray-600">Déposez votre sujet et configurez les paramètres d'évaluation</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Attribution</h4>
                      <p className="text-gray-600">Assignez l'examen aux classes concernées</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Validation</h4>
                      <p className="text-gray-600">Vérifiez et validez les corrections automatiques</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-6">Pour les étudiants</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <Download className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Accès au sujet</h4>
                      <p className="text-gray-600">Téléchargez le sujet d'examen au format PDF</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <Upload className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Soumission</h4>
                      <p className="text-gray-600">Déposez votre réponse et recevez une confirmation</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <BarChart2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Résultats</h4>
                      <p className="text-gray-600">Consultez vos notes et le feedback détaillé</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Questions fréquentes</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Comment fonctionne la correction automatique ?</h3>
              <p className="text-gray-600">
                Notre système analyse les requêtes SQL soumises et les compare avec les solutions attendues, en tenant compte des différentes façons valides d'écrire une même requête.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Quels formats de fichiers sont acceptés ?</h3>
              <p className="text-gray-600">
                Les sujets et les réponses doivent être soumis au format PDF pour garantir une compatibilité optimale.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Comment sont gérées les données des étudiants ?</h3>
              <p className="text-gray-600">
                Toutes les données sont stockées de manière sécurisée et conforme au RGPD. Seuls les professeurs autorisés ont accès aux résultats de leurs étudiants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Besoin d'assistance ?</h2>
            <p className="text-gray-600 mb-8">
              Notre équipe technique est disponible pour vous aider dans la mise en place et l'utilisation de la plateforme.
            </p>
            <button className="flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
              <Mail className="h-5 w-5 mr-2" />
              Contacter le support
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Database className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 text-transparent bg-clip-text">Eureka-Learn</span>
              </div>
              <p className="text-blue-200">
                Plateforme d'évaluation automatisée pour vos exercices de bases de données.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-200">Navigation</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#roles" className="text-gray-400 hover:text-white transition-colors">Rôles</a></li>
                <li><a href="#workflow" className="text-gray-400 hover:text-white transition-colors">Processus</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-200">Légal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mentions légales</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">CGU</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-200">Suivez-nous</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-12 pt-8 text-center text-blue-200">
            <p>&copy; 2024 Eureka-Learn. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;