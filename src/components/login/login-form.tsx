"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Lightbulb,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; speed: number }>
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      speed: Math.random() * 0.5 + 0.1
    }));
    setParticles(newParticles);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        setError(result.error);
        toast.error("Échec de la connexion");
      } else {
        setIsSuccess(true);
        toast.success("Connexion réussie ! Redirection...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      }
    } catch (error: any) {
      const errorMessage = "Une erreur est survenue";
      setError(errorMessage);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-indigo-50 to-white relative overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-500/10"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            x: `${particle.x}vw`,
            y: `${particle.y}vh`
          }}
          animate={{
            y: [`${particle.y}vh`, `${(particle.y + 10) % 100}vh`],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 10 / particle.speed,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            times: [0, 0.5, 1]
          }}
        />
      ))}

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center gap-3 hover:scale-105 transition-all duration-300"
        >
          <div className="p-2 bg-blue-50 rounded-xl shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Lightbulb className="h-12 w-12 text-blue-600 relative z-10" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Eureka Learn
          </h1>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm bg-white/80 overflow-hidden">
            {isSuccess && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                className="bg-green-50 text-green-600 p-4 flex items-center gap-2 border-b border-green-100"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Connexion réussie ! Redirection en cours...</span>
              </motion.div>
            )}

            <CardContent className="p-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
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
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 border border-red-100 flex items-center gap-2"
                >
                  <XCircle className="h-5 w-5 flex-shrink-0" />
                  <span>Échec de la connexion verifier les identifiants</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-2 group"
                >
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <Mail className="h-4 w-4 text-blue-500 transition-transform group-hover:scale-110" />
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="h-12 transition-all duration-200 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 text-black"
                      required
                    />
                    <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-2 group"
                >
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                      <Lock className="h-4 w-4 text-blue-500 transition-transform group-hover:scale-110" />
                      Mot de passe
                    </label>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline font-medium"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="h-12 transition-all duration-200 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 text-black"
                      required
                    />
                    <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        rememberMe: checked as boolean
                      })
                    }
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                  >
                    Se souvenir de moi
                  </label>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    disabled={isLoading || isSuccess}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Connexion en cours...
                      </div>
                    ) : isSuccess ? (
                      <div className="flex items-center justify-center">
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Connecté
                      </div>
                    ) : (
                      <div className="flex items-center justify-center group">
                        Se connecter
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/homework.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-[2px]" />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Correction automatique</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Feedback personnalisé</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2 translate-y-1/2 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Suivi des progrès</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
