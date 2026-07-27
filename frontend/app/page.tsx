"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, X } from "lucide-react";

import { validateLogin } from "./utils/validators_front";
import { API_URL } from "./services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateLogin(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas. Tente novamente.");
      }

      const data = await response.json().catch(() => ({}));
      if (data.role) {
        localStorage.setItem("userRole", data.role);
      } else {
        localStorage.setItem("userRole", "GESTOR");
      }

      router.push("/trips");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
      {/* Pop-up flutuante de Erro (fora do card) */}
      {error && (
        <div className="fixed top-6 right-6 z-50 bg-[#ed842e] text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-orange-300 max-w-md animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold">
            <AlertCircle size={20} />
          </div>
          <span className="font-semibold text-sm flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
            title="Fechar"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Container principal */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[550px] border border-[#748ca6]/20">
        {/* === LADO ESQUERDO: ÁREA DA IMAGEM === */}
        <div className="relative w-full md:w-1/2 min-h-[250px] md:min-h-full bg-white flex items-center justify-center">
          <Image
            src="/banner.png"
            alt="Imagem ou Logo de Login"
            fill
            className="object-contain p-4 md:p-8"
            priority
          />
        </div>

        {/* === LADO DIREITO: FORMULÁRIO DE LOGIN === */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white">
          <h2
            className="text-2xl font-bold text-center text-[#07497f] mb-8 uppercase tracking-wider"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#748ca6] mb-1">
                Email Cadastrado
              </label>
              <input
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input border border-[#748ca6]/30 text-[#07497f] px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#07497f] transition-all placeholder-[#748ca6]/60"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#748ca6] mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input border border-[#748ca6]/30 text-[#07497f] px-4 py-2.5 pr-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#07497f] transition-all placeholder-[#748ca6]/60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#748ca6] hover:text-[#07497f] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#07497f] hover:bg-[#07497f]/90 text-white font-semibold py-3 rounded-xl mt-6 transition-all shadow-md ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="text-center text-sm text-[#748ca6] mt-6">
            Não tem uma conta?{" "}
            <Link
              href="/auth/register"
              className="text-[#ed842e] hover:underline transition-all font-semibold"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
