"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, ArrowRight, Loader2, Lightbulb } from "lucide-react";

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
        password: formData.password
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
    <div className="flex min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-indigo-50 to-white">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />

        <div className="mb-12 flex items-center gap-3 transition-all duration-300 hover:scale-105">
          <div className="p-2 bg-blue-50 rounded-xl shadow-inner">
            <Lightbulb className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Eureka Learn
          </h1>
        </div>

        <div className="w-full max-w-md">
          <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm bg-white/80">
            <CardContent className="p-8">
              <div className="space-y-2 mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  Bienvenue !
                </h2>
                <p className="text-gray-600">
                  Connectez-vous pour accéder à votre espace de correction
                  intelligente
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 border border-red-100 animate-shake">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <Mail className="h-4 w-4 text-blue-500 transition-transform group-hover:scale-110" />
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-12 transition-all duration-200 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2 group">
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
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="h-12 transition-all duration-200 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connexion en cours...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center group">
                      Se connecter
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/homework.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-[2px]" />
      </div>
    </div>
  );
}
