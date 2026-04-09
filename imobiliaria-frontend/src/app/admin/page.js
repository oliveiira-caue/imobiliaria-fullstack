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
      const resposta = await fetch("http://localhost:8000/api/imoveis/", {
    method: "POST",
    headers: { "x-auth-token": token },
    body: formData,
});

      const dados = await resposta.json();

      if (resposta.ok) {
        localStorage.setItem("tokenImobiliaria", dados.token);

        router.push("/admin/dashboard");
      } else {
        setErro(dados.erro || "E-mail ou senha incorretos.");
      }
    } catch (error) {
      setErro("Falha ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Acesso Restrito</h1>
          <p className="text-sm text-slate-500 mt-2">Painel de Gestão - Imobiliária</p>
        </div>

        {erro && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200 text-center">
            {erro}
          </div>
        )}

        <form onSubmit={fazerLogin} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="corretor@imobi.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-70"
          >
            {carregando ? "Entrando..." : "Entrar no Sistema"}
          </button>
        </form>
        
      </div>
    </div>
  );
}