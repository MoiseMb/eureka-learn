"use client";

import type React from "react";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "../mode-toggle";
import {
  Loader2,
  BookOpen,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
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
    <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-lg mr-2">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-blue-600 font-bold text-2xl">Eureka</span>
            <span className="ml-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-2 py-0.5 rounded-md text-xl shadow-sm">
              Learn
            </span>
          </div>
          <ModeToggle />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="space-y-2 mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
              Bienvenue !
            </h1>
            <p className="text-muted-foreground">
              Connectez-vous pour accéder à votre espace d'apprentissage
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6 border border-red-200 dark:bg-red-900/30 dark:border-red-800">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4 text-blue-500" />
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="h-12 pl-4 pr-4 border-blue-100 dark:border-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium flex items-center gap-2"
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
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="h-12 pl-4 pr-4 border-blue-100 dark:border-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium shadow-lg shadow-blue-500/20 rounded-lg"
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

      {/* Right side - Modern Illustration */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>

        {/* Floating cards */}
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 rotate-6">
          <Card className="w-64 h-40 bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
            <CardContent className="p-4 flex flex-col h-full justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium text-blue-800">Cours terminé</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-blue-100 rounded-full w-3/4"></div>
                <div className="h-2 bg-blue-100 rounded-full w-1/2"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-600">4.8/5</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-3 h-3 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="absolute top-2/3 right-1/4 transform translate-x-1/4 -translate-y-1/2 -rotate-3">
          <Card className="w-56 h-32 bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-3 flex flex-col h-full justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="h-3 w-3 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="font-medium text-sm text-gray-800">
                  Certification
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="h-1.5 bg-blue-100 rounded-full w-full"></div>
                  <div className="h-1.5 bg-blue-100 rounded-full w-2/3"></div>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  A+
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main illustration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-96 h-96">
            {/* Abstract learning concept */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                {/* Brain network visualization */}
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  {/* Central circle */}
                  <circle cx="200" cy="200" r="60" fill="white" />

                  {/* Connecting nodes */}
                  <g className="nodes">
                    <circle
                      cx="120"
                      cy="120"
                      r="20"
                      fill="rgba(255,255,255,0.9)"
                    />
                    <circle
                      cx="280"
                      cy="120"
                      r="25"
                      fill="rgba(255,255,255,0.9)"
                    />
                    <circle
                      cx="120"
                      cy="280"
                      r="22"
                      fill="rgba(255,255,255,0.9)"
                    />
                    <circle
                      cx="280"
                      cy="280"
                      r="18"
                      fill="rgba(255,255,255,0.9)"
                    />
                    <circle
                      cx="330"
                      cy="200"
                      r="15"
                      fill="rgba(255,255,255,0.9)"
                    />
                    <circle
                      cx="70"
                      cy="200"
                      r="15"
                      fill="rgba(255,255,255,0.9)"
                    />
                    <circle
                      cx="200"
                      cy="70"
                      r="15"
                      fill="rgba(255,255,255,0.9)"
                    />
                    <circle
                      cx="200"
                      cy="330"
                      r="15"
                      fill="rgba(255,255,255,0.9)"
                    />
                  </g>

                  {/* Connection lines */}
                  <g stroke="white" strokeWidth="3" strokeOpacity="0.6">
                    <line x1="200" y1="140" x2="200" y2="70" />
                    <line x1="200" y1="260" x2="200" y2="330" />
                    <line x1="140" y1="200" x2="70" y2="200" />
                    <line x1="260" y1="200" x2="330" y2="200" />
                    <line x1="152" y1="152" x2="120" y2="120" />
                    <line x1="248" y1="152" x2="280" y2="120" />
                    <line x1="152" y1="248" x2="120" y2="280" />
                    <line x1="248" y1="248" x2="280" y2="280" />
                  </g>

                  {/* Animated pulses */}
                  <circle
                    cx="200"
                    cy="200"
                    r="80"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      from="60"
                      to="100"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx="200"
                    cy="200"
                    r="70"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      from="60"
                      to="100"
                      dur="3s"
                      begin="1s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="3s"
                      begin="1s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Central icon */}
                  <g transform="translate(170, 170)">
                    <rect width="60" height="60" rx="15" fill="#1D4ED8" />
                    <path
                      d="M15 30 L25 40 L45 20"
                      stroke="white"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/30"
                  style={{
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${
                      Math.random() * 10 + 10
                    }s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Text overlay */}
        <div className="absolute bottom-16 inset-x-0 text-center">
          <h2 className="text-white text-3xl font-bold mb-4 drop-shadow-lg">
            Découvrez l'apprentissage du futur
          </h2>
          <p className="text-white/90 max-w-md mx-auto drop-shadow">
            Accédez à des milliers de cours interactifs et développez vos
            compétences à votre rythme
          </p>

          <div className="flex justify-center mt-8 space-x-3">
            <div className="w-3 h-3 rounded-full bg-white/30"></div>
            <div className="w-3 h-3 rounded-full bg-white"></div>
            <div className="w-3 h-3 rounded-full bg-white/30"></div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
          100% {
            transform: translateY(0) rotate(360deg);
          }
        }

        .bg-pattern {
          background-image: radial-gradient(
              circle at 25px 25px,
              rgba(255, 255, 255, 0.2) 2%,
              transparent 0%
            ),
            radial-gradient(
              circle at 75px 75px,
              rgba(255, 255, 255, 0.2) 2%,
              transparent 0%
            );
          background-size: 100px 100px;
        }
      `}</style>
    </div>
  );
}
