"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
        redirect: false,
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
    <div className="flex min-h-screen w-full">
     
     <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#669ACC]">
        <div className="w-full max-w-md">
          <Card
            className="border-0 shadow-xl backdrop-blur-sm"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(229, 231, 235, 0.8))", 
            }}
          >
            <CardContent className="p-6">
              <div className="space-y-2 mb-8">
                <h1 className="text-3xl font-bold text-center text-gray-900">
                  Bienvenue !
                </h1>
                <p className="text-muted-foreground text-center">
                  Connectez-vous pour accéder à votre espace d'apprentissage
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6 border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium flex items-center gap-2 text-gray-700"
                  >
                    <Mail className="h-4 w-4 text-blue-500" />
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-12 pl-4 pr-4 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium flex items-center gap-2 text-gray-700"
                    >
                      <Lock className="h-4 w-4 text-blue-500" />
                      Mot de passe
                    </label>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="h-12 pl-4 pr-4 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/homework.jpg')", 
          
        }}
      >
        
        <div className="absolute inset-0 bg-blue/50"></div>
      </div>
    </div>
  );
}