"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  
  const router = useRouter();

  const fazerLogin = async (e) => {
    e.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        sessionStorage.setItem("tokenImobiliaria", dados.access);

        router.push("/admin/dashboard");
      } else {
        setErro(dados.erro || "E-mail ou senha incorretos.");
      }
    } catch (error) {
      console.error("🚨 ERRO REAL REVELADO:", error);
      setErro("Falha ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "#070d1a" }}>
      <div className="w-full max-w-md rounded-2xl p-8 shadow-2xl border border-white/8" style={{ background: "#0e1829" }}>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-100">Acesso Restrito</h1>
          <p className="text-sm text-slate-400 mt-2">Painel de Gestão - Imobiliária</p>
        </div>

        {erro && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 text-center">
            {erro}
          </div>
        )}

        <form onSubmit={fazerLogin} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Usuário ou E-mail</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-[#0b1525] px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
              placeholder="E-mail ou Usuário"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-[#0b1525] px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
          >
            {carregando ? "Entrando..." : "Entrar no Sistema"}
          </button>
        </form>

      </div>
    </div>
  );
}