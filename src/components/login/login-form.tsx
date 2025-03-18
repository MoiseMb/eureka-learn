"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "../mode-toggle";
import { Loader2 } from "lucide-react";

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
    <div
      className={cn(
        "flex flex-col gap-6 relative min-h-screen w-full",
        className
      )}
      {...props}
    >
      <div className=" relative mt-8 ml-8">
        <ModeToggle />
      </div>
      <div className="absolute top-8 right-8 ">
        <span className="text-blue-600 font-semibold md:text-3xl text-lg">
          Edu
        </span>
        <span className="ml-2 bg-blue-600 text-white px-2 py-1 rounded  md:text-2xl text-md">
          SQL
        </span>
      </div>

      <div className="absolute inset-0 md:top-32 top-[20%] flex items-start justify-center">
        <span className="md:text-[300px] text-[70px] font-bold text-blue-800/10">
          Bienvenue
        </span>
      </div>

      <div className="flex w-full flex-col items-center justify-center  flex-1 md:z-10">
        <div className="w-full justify-center items-center flex flex-col">
          <h1 className="md:text-8xl text-4xl font-semibold text-blue-400 mb-8">
            Connectez vous
          </h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 w-full max-w-md px-4 md:px-0 md:mt-10"
          >
            <div>
              <Input
                type="email"
                placeholder="Adresse email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-4 border rounded-md h-12"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-4 h-12 border rounded-md"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-blue-400 hover:bg-blue-700 text-white py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
            <div className="text-center">
              <a href="#" className="text-blue-700 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
