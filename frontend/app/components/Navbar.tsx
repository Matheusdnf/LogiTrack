"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { API_URL } from "../services/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen((prev) => (prev ? false : prev));
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Só tenta buscar o usuário se não estiver nas páginas de login/registro
    if (pathname !== "/" && pathname !== "/auth/register") {
      fetch(`${API_URL}/auth/me`, { credentials: "include" })
        .then((res) => {
          if (res.ok) return res.json();
          return null;
        })
        .then((data) => {
          if (data && data.username) {
            setUsername(data.username);
            const role = data.role || "GESTOR";
            setUserRole(role);
            localStorage.setItem("userRole", role);
          }
        })
        .catch(() => {});
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setUsername(null);
      setUserRole(null);
      localStorage.removeItem("userRole");
      router.push("/");
    }
  };

  // Hide navbar on login and register pages
  if (pathname === "/" || pathname === "/auth/register") {
    return null;
  }

  return (
    <nav className="glass sticky top-0 z-40 border-b border-[#748ca6]/20 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-16 flex items-center justify-between">
        {/* === ÁREA DA LOGO === */}
        <Link
          href="/trips"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          {/* Container da imagem ajustado para um formato de ícone (quadrado) */}
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="LogiTrack Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>

          {/* Texto LogiTrack ao lado da imagem */}
          <span
            className="text-xl font-bold text-[#07497f]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            LogiTrack
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/trips"
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${pathname.startsWith("/trips") ? "bg-[#07497f] text-white shadow-md scale-105" : "text-[#748ca6] hover:text-[#07497f] hover:bg-[#748ca6]/10"}`}
          >
            Viagens
          </Link>
          <Link
            href="/vehicles"
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${pathname.startsWith("/vehicles") ? "bg-[#07497f] text-white shadow-md scale-105" : "text-[#748ca6] hover:text-[#07497f] hover:bg-[#748ca6]/10"}`}
          >
            Veículos
          </Link>
          <Link
            href="/dashboard"
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${pathname.startsWith("/dashboard") ? "bg-[#07497f] text-white shadow-md scale-105" : "text-[#748ca6] hover:text-[#07497f] hover:bg-[#748ca6]/10"}`}
          >
            Dashboard
          </Link>
          {username && (
            <div className="flex items-center gap-4 pl-4 border-l border-[#748ca6]/20 ml-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#748ca6]/15 flex items-center justify-center border border-[#748ca6]/30 shadow-inner">
                  <span className="text-xs font-bold text-[#07497f] uppercase">
                    {username.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-[#748ca6] flex items-center gap-1.5">
                  Olá,{" "}
                  <span className="text-[#07497f] font-semibold capitalize">
                    {username}
                  </span>
                  {userRole && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${userRole === 'ADMIN' ? 'bg-[#7e22ce]/15 text-[#7e22ce] border border-[#7e22ce]/30' : 'bg-[#0586c7]/15 text-[#0586c7] border border-[#0586c7]/30'}`}>
                      {userRole}
                    </span>
                  )}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="text-[#748ca6] hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
                title="Sair do sistema"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl text-[#07497f] hover:bg-[#748ca6]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0586c7]"
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#748ca6]/20 bg-[#f5f8f9]/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fade-in">
          <Link
            href="/trips"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all ${pathname.startsWith("/trips") ? "bg-[#07497f] text-white shadow-md" : "text-[#748ca6] hover:bg-[#748ca6]/10 hover:text-[#07497f]"}`}
          >
            Viagens
          </Link>
          <Link
            href="/vehicles"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all ${pathname.startsWith("/vehicles") ? "bg-[#07497f] text-white shadow-md" : "text-[#748ca6] hover:bg-[#748ca6]/10 hover:text-[#07497f]"}`}
          >
            Veículos
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all ${pathname.startsWith("/dashboard") ? "bg-[#07497f] text-white shadow-md" : "text-[#748ca6] hover:bg-[#748ca6]/10 hover:text-[#07497f]"}`}
          >
            Dashboard
          </Link>

          {username && (
            <div className="pt-4 mt-3 border-t border-[#748ca6]/20 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#748ca6]/15 flex items-center justify-center border border-[#748ca6]/30 shadow-inner">
                  <span className="text-base font-bold text-[#07497f] uppercase">
                    {username.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-[#748ca6] font-medium">
                    Conectado como
                  </p>
                  <p className="text-sm text-[#07497f] font-bold capitalize">
                    {username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm transition-colors border border-red-200 shadow-sm"
              >
                <LogOut size={16} /> Sair
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
