"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="w-full max-w-sm bg-transparent border-none shadow-xl text-white z-10">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Acesse sua Conta</CardTitle>
        <CardDescription>
          Use suas credenciais para entrar na plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black border-gray-800 text-white "
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border-gray-800 text-white pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          onClick={() =>
            signIn("credentials", { email, password, callbackUrl: "/dashboard" })
          }
          className="w-full bg-white text-black font-bold transition-colors hover:bg-gray-300"
        >
          Entrar
        </Button>
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-800" />
          </div>
          <div className="relative flex justify-center text-xs text-[#737373] uppercase">
            <span className="bg-black px-2 ">
              Ou continue com
            </span>
          </div>
        </div>
        <Button
          className="w-full bg-white text-black font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          <FcGoogle className="" />CONTINUAR COM GOOGLE
        </Button>
      </CardFooter>
    </Card>
  );
}
