"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, ArrowRight, Loader2, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      setError(error.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-blue-200 rounded-lg rotate-12" />
          <div className="absolute bottom-10 right-10 w-20 h-20 border-2 border-indigo-200 rounded-full" />
          <div className="absolute top-1/2 right-20 w-16 h-16 border-2 border-purple-200 rotate-45" />
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 border-2 border-blue-200 rounded-full animate-spin-slow" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center gap-3 z-10"
        >
          <Lightbulb className="h-12 w-12 text-blue-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Eureka Learn
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20"></div>
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm relative">
            <CardContent className="p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2 mb-8 text-center"
              >
                <h2 className="text-3xl font-bold text-gray-900">
                  Bienvenue !
                </h2>
                <p className="text-gray-600">
                  Connectez-vous pour accéder à votre espace de correction
                  intelligente
                </p>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50/50 backdrop-blur-sm text-red-500 p-4 rounded-lg mb-6 border border-red-100 flex items-center gap-2"
                >
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <Mail className="h-4 w-4 text-blue-500" />
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-12 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                      <Lock className="h-4 w-4 text-blue-500" />
                      Mot de passe
                    </label>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="h-12 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center"
                      >
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Connexion en cours...
                      </motion.div>
                    ) : (
                      <motion.div
                        className="flex items-center justify-center"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        Se connecter
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/homework.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Correction Intelligente d'Exercices
          </h2>
          <p className="text-white/90">
            Une plateforme innovante qui utilise l'intelligence artificielle
            pour corriger vos exercices de programmation et vous aider à
            progresser
          </p>
        </motion.div>
      </div>
    </div>
  );
}
