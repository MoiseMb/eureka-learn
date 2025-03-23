"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  BarChart2,
  Database,
  Users,
  Upload,
  Shield,
  Code2,
  Sparkles,
  Sun,
  Moon,
  Terminal,
  FileCode2,
  Binary,
  Blocks,
  Braces,
  Cpu
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Lottie from "lottie-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import girlCodeImage from "@/../public/images/girlCode.jpg";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

enum EvaluationType {
  POO_JAVA = "POO_JAVA",
  C_LANGUAGE = "C_LANGUAGE",
  SQL = "SQL",
  PYTHON = "PYTHON",
  ALGORITHMS = "ALGORITHMS",
  DATA_STRUCTURES = "DATA_STRUCTURES"
}

const evaluationTypeConfig = {
  [EvaluationType.POO_JAVA]: {
    icon: Braces,
    color: "from-orange-500 to-red-500",
    label: "Programmation Orientée Objet Java",
    animation: "/animations/java.json"
  },
  [EvaluationType.C_LANGUAGE]: {
    icon: Terminal,
    color: "from-blue-500 to-cyan-500",
    label: "Langage C",
    animation: "/animations/c.json"
  },
  [EvaluationType.SQL]: {
    icon: Database,
    color: "from-indigo-500 to-purple-500",
    label: "SQL",
    animation: "/animations/database.json"
  },
  [EvaluationType.PYTHON]: {
    icon: FileCode2,
    color: "from-yellow-500 to-amber-500",
    label: "Python",
    animation: "/animations/python.json"
  },
  [EvaluationType.ALGORITHMS]: {
    icon: Binary,
    color: "from-green-500 to-emerald-500",
    label: "Algorithmes",
    animation: "/animations/algorithm.json"
  },
  [EvaluationType.DATA_STRUCTURES]: {
    icon: Blocks,
    color: "from-pink-500 to-rose-500",
    label: "Structures de Données",
    animation: "/animations/data-structure.json"
  }
};

function App() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [activeType, setActiveType] = useState<EvaluationType>(
    EvaluationType.SQL
  );
  const [isHovering, setIsHovering] = useState(false);

  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [typesRef, typesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Effet pour éviter l'hydration mismatch avec le thème
  useEffect(() => {
    setMounted(true);
  }, []);

  // Animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const handleTypeChange = async (type: EvaluationType) => {
    try {
      setActiveType(type);
    } finally {
    }
  };

  const getBgClass = () => {
    return theme === "dark"
      ? "bg-[#030712] text-white"
      : "bg-gray-50 text-gray-900";
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`min-h-screen ${getBgClass()} overflow-hidden transition-colors duration-300`}
    >
      {/* Grille de fond */}
      <div
        className={`absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] ${
          theme === "dark" ? "opacity-20" : "opacity-10"
        }`}
      ></div>

      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              theme === "dark" ? "bg-blue-500/20" : "bg-blue-500/10"
            }`}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              times: [0, 0.5, 1]
            }}
          />
        ))}
      </div>

      <header className="relative">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            theme === "dark"
              ? "from-blue-500/5 via-transparent to-purple-500/5"
              : "from-blue-500/10 via-transparent to-purple-500/10"
          } pointer-events-none`}
        ></div>
        <nav className="container mx-auto px-6 py-6 relative z-10">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <Sparkles
                className={`h-8 w-8 ${
                  theme === "dark" ? "text-blue-500" : "text-blue-600"
                }`}
              />
              <span
                className={`text-2xl font-bold bg-gradient-to-r ${
                  theme === "dark"
                    ? "from-blue-500 via-blue-400 to-purple-500"
                    : "from-blue-600 via-blue-500 to-purple-600"
                } text-transparent bg-clip-text`}
              >
                Eureka-Learn
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:flex space-x-8"
            >
              {["Fonctionnalités", "Solutions", "Ressources", "Prix"].map(
                (item, i) => (
                  <a
                    key={i}
                    href={`#${item.toLowerCase()}`}
                    className={`${
                      theme === "dark"
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    } transition-colors duration-200 text-sm font-medium`}
                  >
                    {item}
                  </a>
                )
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-4"
            >
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`p-2 rounded-full ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-200"
                    : "bg-gray-200 text-gray-800"
                } transition-colors duration-200`}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              {session ? (
                <button
                  onClick={() => router.push("/dashboard")}
                  className={`flex items-center space-x-2 px-4 py-2 ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-100 hover:bg-gray-200"
                  } rounded-lg transition-colors duration-200`}
                >
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium">Mon espace</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/login")}
                    className={`px-4 py-2 text-sm font-medium ${
                      theme === "dark"
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    } transition-colors duration-200`}
                  >
                    Se connecter
                  </button>
                  <button
                    className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200 ${
                      theme === "dark"
                        ? "shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
                        : "shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                    }`}
                  >
                    Essai gratuit
                  </button>
                </>
              )}
            </motion.div>
          </div>
        </nav>

        <div
          ref={heroRef}
          className="container mx-auto px-6 pt-20 pb-32 relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full ${
                theme === "dark"
                  ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                  : "bg-blue-500/20 border border-blue-500/30 text-blue-600"
              } text-sm mb-6`}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Assistant IA de correction de code
            </div>
            <h1
              className={`text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r ${
                theme === "dark"
                  ? "from-white via-blue-100 to-purple-200"
                  : "from-gray-900 via-blue-800 to-purple-900"
              } text-transparent bg-clip-text leading-tight`}
            >
              Corrigez les travaux de programmation avec l'IA
            </h1>
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } mb-8 max-w-2xl mx-auto`}
            >
              Gagnez du temps dans la correction des travaux de programmation
              grâce à notre IA. Analyse approfondie du code, retours détaillés
              et suggestions d'amélioration automatiques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-8 py-4 bg-blue-500 rounded-xl text-white font-medium flex items-center justify-center group relative overflow-hidden ${
                  theme === "dark"
                    ? "shadow-[0_0_25px_rgba(59,130,246,0.3)]"
                    : "shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                }`}
              >
                <span className="relative z-10">Commencer gratuitement</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform translate-y-full transition-transform group-hover:translate-y-0"></div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-8 py-4 ${
                  theme === "dark"
                    ? "bg-white/5 backdrop-blur-xl text-white border border-white/10 hover:bg-white/10"
                    : "bg-gray-900/5 backdrop-blur-xl text-gray-900 border border-gray-900/10 hover:bg-gray-900/10"
                } rounded-xl font-medium flex items-center justify-center transition-colors duration-200`}
              >
                <Code2 className="h-5 w-5 mr-2" />
                Voir une Démo
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20"
          >
            <div className="relative mx-auto max-w-5xl">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl transform rotate-1 scale-105 opacity-10 blur-2xl ${
                  theme === "dark" ? "" : "opacity-20"
                }`}
              ></div>
              <div
                className={`relative rounded-2xl shadow-2xl ${
                  theme === "dark"
                    ? "border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800"
                    : "border border-gray-200/50 bg-gradient-to-br from-white to-gray-100"
                } p-8 overflow-hidden`}
              >
                {/* Animation Lottie en fonction du type d'évaluation actif */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeType}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.1 }}
                    className="w-full h-[400px] flex items-center justify-center"
                  >
                    {activeType === EvaluationType.SQL && (
                      <Lottie
                        animationData={require("@/../public/animations/database-animation.json")}
                        className="w-full max-w-lg"
                      />
                    )}
                    {activeType === EvaluationType.POO_JAVA && (
                      <Lottie
                        animationData={require("@/../public/animations/java.json")}
                        className="w-full max-w-lg"
                      />
                    )}
                    {activeType === EvaluationType.C_LANGUAGE && (
                      <Lottie
                        animationData={require("@/../public/animations/c.json")}
                        className="w-full max-w-lg"
                      />
                    )}
                    {activeType === EvaluationType.PYTHON && (
                      <Lottie
                        animationData={require("@/../public/animations/python.json")}
                        className="w-full max-w-lg"
                      />
                    )}
                    {activeType === EvaluationType.ALGORITHMS && (
                      <Lottie
                        animationData={require("@/../public/animations/algorithm-animation.json")}
                        className="w-full max-w-lg"
                      />
                    )}
                    {activeType === EvaluationType.DATA_STRUCTURES && (
                      <Lottie
                        animationData={require("@/../public/animations/data-structure-animation.json")}
                        className="w-full max-w-lg"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  {Object.entries(evaluationTypeConfig).map(
                    ([type, config]) => (
                      <Button
                        key={type}
                        onClick={() => handleTypeChange(type as EvaluationType)}
                        className={`relative flex items-center gap-3 px-6 py-3 min-w-[200px] transition-all duration-200 ${
                          activeType === type
                            ? `bg-gradient-to-r ${config.color} text-white shadow-lg scale-105`
                            : `${
                                theme === "dark"
                                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                  : "bg-white text-gray-700 hover:bg-gray-100"
                              } border ${
                                theme === "dark"
                                  ? "border-gray-700"
                                  : "border-gray-200"
                              }`
                        }`}
                      >
                        <div className="absolute inset-0 rounded-lg overflow-hidden">
                          <div
                            className={`absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-200 ${
                              theme === "dark" ? "bg-white" : "bg-black"
                            }`}
                          />
                        </div>
                        <config.icon
                          className={`h-5 w-5 flex-shrink-0 ${
                            activeType === type ? "text-white" : config.color
                          }`}
                        />
                        <span className="text-base font-medium whitespace-nowrap">
                          {config.label}
                        </span>
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-6 -mb-24 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className={`grid md:grid-cols-4 gap-8 ${
              theme === "dark"
                ? "bg-white/5 backdrop-blur-xl border border-white/10"
                : "bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg"
            } p-8 rounded-2xl`}
          >
            {[
              { value: "10K+", label: "Copies corrigées" },
              { value: "98%", label: "Précision de l'IA" },
              { value: "50K+", label: "Retours générés" },
              { value: "-70%", label: "Temps de correction" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`text-center p-4 rounded-xl ${
                  theme === "dark"
                    ? "bg-white/5 backdrop-blur-sm border border-white/5"
                    : "bg-gray-50 border border-gray-200/50"
                }`}
              >
                <div
                  className={`text-3xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  {stat.value}
                </div>
                <div
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } text-sm`}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className={`py-32 relative ${
          theme === "dark"
            ? "bg-gradient-to-b from-gray-900 to-gray-950"
            : "bg-gradient-to-b from-gray-50 to-gray-100"
        }`}
      >
        <div className="container mx-auto px-6">
          <motion.div
            variants={container}
            initial="hidden"
            animate={featuresInView ? "show" : "hidden"}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2
              className={`text-4xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Une IA conçue pour les enseignants
            </h2>
            <p
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } text-lg`}
            >
              Des outils avancés pour une correction efficace et pertinente de
              tous les travaux de programmation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Correction instantanée",
                description:
                  "Téléchargez les travaux de vos étudiants et obtenez une analyse détaillée en quelques secondes",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: CheckCircle,
                title: "Analyse intelligente",
                description:
                  "Notre IA évalue la qualité du code, détecte les erreurs et suggère des améliorations pertinentes",
                color: "from-green-500 to-green-600"
              },
              {
                icon: BarChart2,
                title: "Rapports détaillés",
                description:
                  "Générez des retours personnalisés pour chaque étudiant avec des explications claires et des exemples",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: Shield,
                title: "Détection de plagiat",
                description:
                  "Identifiez automatiquement les similitudes entre les travaux pour garantir l'intégrité académique",
                color: "from-red-500 to-orange-500"
              },
              {
                icon: Cpu,
                title: "Feedback pédagogique",
                description:
                  "L'IA fournit des explications adaptées au niveau de l'étudiant et des ressources d'apprentissage",
                color: "from-indigo-500 to-blue-500"
              },
              {
                icon: Users,
                title: "Suivi de progression",
                description:
                  "Suivez l'évolution des compétences de vos étudiants et identifiez les points à renforcer",
                color: "from-amber-500 to-yellow-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    theme === "dark" ? "" : "from-blue-500/10 to-purple-500/10"
                  }`}
                ></div>
                <div
                  className={`relative ${
                    theme === "dark"
                      ? "bg-gray-900 border border-white/10 hover:border-white/20"
                      : "bg-white border border-gray-200/50 hover:border-gray-300/50 shadow-md"
                  } rounded-2xl p-8 transition-colors duration-300`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3
                    className={`text-xl font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    } mb-4`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Types d'évaluation Section */}
      <section
        ref={typesRef}
        className={`py-32 relative ${
          theme === "dark" ? "bg-gray-950" : "bg-white"
        }`}
      >
        <div className="container mx-auto px-6">
          <motion.div
            variants={container}
            initial="hidden"
            animate={typesInView ? "show" : "hidden"}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2
              className={`text-4xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Tous les langages supportés
            </h2>
            <p
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } text-lg`}
            >
              Notre plateforme prend en charge une large gamme de langages et de
              concepts de programmation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeIn} className="relative">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl transform rotate-1 scale-105 opacity-10 blur-2xl ${
                  theme === "dark" ? "" : "opacity-20"
                }`}
              ></div>
              <div
                className={`relative rounded-2xl overflow-hidden ${
                  theme === "dark"
                    ? "border border-white/10"
                    : "border border-gray-200/50 shadow-lg"
                }`}
              >
                <Image
                  src={girlCodeImage}
                  alt="Girl coding"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </motion.div>

            <motion.div variants={container} className="space-y-6">
              {Object.entries(evaluationTypeConfig).map(
                ([type, config], index) => (
                  <motion.div
                    key={type}
                    variants={item}
                    className={`p-6 rounded-xl ${
                      theme === "dark"
                        ? "bg-gray-900 border border-white/10"
                        : "bg-white border border-gray-200/50 shadow-md"
                    } transition-all duration-300 hover:shadow-lg`}
                    onMouseEnter={() =>
                      handleTypeChange(type as EvaluationType)
                    }
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${config.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <config.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3
                          className={`text-xl font-semibold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          } mb-2`}
                        >
                          {config.label}
                        </h3>
                        <p
                          className={`${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {getTypeDescription(type as EvaluationType)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        ref={testimonialsRef}
        className={`py-32 relative ${
          theme === "dark"
            ? "bg-gradient-to-b from-gray-950 to-gray-900"
            : "bg-gradient-to-b from-white to-gray-50"
        }`}
      ></section>

      {/* CTA Section */}
      <section
        className={`py-20 relative ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="container mx-auto px-6">
          <div
            className={`rounded-2xl ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-white/10"
                : "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100/50"
            } p-12 relative overflow-hidden`}
          >
            <div className="absolute inset-0 overflow-hidden">
              <Lottie
                animationData={require("@/../public/animations/wave-animation.json")}
                className="w-full h-full opacity-10"
              />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2
                className={`text-3xl md:text-4xl font-bold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Prêt à révolutionner votre façon de corriger ?
              </h2>
              <p
                className={`text-lg mb-8 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Rejoignez les enseignants qui font confiance à notre IA pour une
                correction plus rapide, plus précise et plus pédagogique.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg"
                >
                  Commencer gratuitement
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-8 py-4 ${
                    theme === "dark"
                      ? "bg-white/10 hover:bg-white/15 text-white"
                      : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
                  } rounded-xl font-medium transition-all duration-200`}
                >
                  Demander une démo
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`${
          theme === "dark"
            ? "bg-gray-950 text-white border-t border-white/10"
            : "bg-white text-gray-900 border-t border-gray-200"
        } py-20`}
      >
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles
                  className={`h-8 w-8 ${
                    theme === "dark" ? "text-blue-500" : "text-blue-600"
                  }`}
                />
                <span
                  className={`text-2xl font-bold bg-gradient-to-r ${
                    theme === "dark"
                      ? "from-blue-500 to-purple-500"
                      : "from-blue-600 to-purple-600"
                  } text-transparent bg-clip-text`}
                >
                  Eureka-Learn
                </span>
              </div>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                La nouvelle génération d'apprentissage de la programmation.
              </p>
            </div>
            {[
              {
                title: "Produit",
                links: ["Fonctionnalités", "Solutions", "Ressources", "Prix"]
              },
              {
                title: "Entreprise",
                links: ["À propos", "Blog", "Carrières", "Contact"]
              },
              {
                title: "Légal",
                links: ["Confidentialité", "CGU", "Cookies"]
              }
            ].map((column, index) => (
              <div key={index}>
                <h4
                  className={`text-lg font-semibold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {column.title}
                </h4>
                <ul className="space-y-2">
                  {column.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className={`${
                          theme === "dark"
                            ? "text-gray-400 hover:text-white"
                            : "text-gray-600 hover:text-gray-900"
                        } transition-colors duration-200`}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className={`border-t ${
              theme === "dark" ? "border-white/10" : "border-gray-200"
            } mt-12 pt-8 text-center ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <p>&copy; 2025 Eureka-Learn. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function getTypeDescription(type: EvaluationType): string {
  switch (type) {
    case EvaluationType.POO_JAVA:
      return "Évaluez les concepts de programmation orientée objet en Java, y compris l'héritage, le polymorphisme et l'encapsulation.";
    case EvaluationType.C_LANGUAGE:
      return "Testez les compétences en langage C, de la gestion de la mémoire aux structures de données et aux pointeurs.";
    case EvaluationType.SQL:
      return "Évaluez les requêtes SQL, les jointures, les sous-requêtes et l'optimisation des bases de données.";
    case EvaluationType.PYTHON:
      return "Testez les compétences en Python, des concepts de base aux bibliothèques avancées comme NumPy et Pandas.";
    case EvaluationType.ALGORITHMS:
      return "Évaluez la compréhension et l'implémentation d'algorithmes classiques et avancés.";
    case EvaluationType.DATA_STRUCTURES:
      return "Testez la maîtrise des structures de données comme les arbres, les graphes et les tables de hachage.";
    default:
      return "Évaluez les compétences en programmation avec notre plateforme intelligente.";
  }
}

export default App;
