"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function formatarPreco(v) {
  return v ? Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }) : "Sob consulta";
}

const AVALIACOES = [
  { nome: "Ricardo S.", nota: 5, texto: "Excelente profissional! Muito atencioso e encontrou o imóvel perfeito para a minha família.", data: "Mar 2026" },
  { nome: "Fernanda C.", nota: 5, texto: "Super recomendo! Processo ágil, transparente e sem surpresas. Comprei meu apartamento com total segurança.", data: "Fev 2026" },
  { nome: "Bruno A.", nota: 4, texto: "Ótimo atendimento, sempre disponível para tirar dúvidas. Negociação muito profissional.", data: "Jan 2026" },
];

export default function PerfilCorretorPage() {
  const { id } = useParams();
  const router = useRouter();
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/imoveis/lista/`)
      .then(r => r.json())
      .then(data => setImoveis(data.filter(im => im.ativo !== false).slice(0, 6)))
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-[#070d1a] text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#070d1a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo_nome.png" alt="Nexus Habitar" width={100} height={32} className="h-8 w-auto object-contain" />
          </Link>
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs border border-white/10 rounded-lg px-3 py-1.5 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Voltar
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero do perfil */}
        <div className="bg-[#0e1829] border border-white/8 rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-blue-900/50 border-2 border-blue-700/40 flex items-center justify-center text-2xl font-bold text-blue-300 flex-shrink-0">
              NH
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white mb-1">Nexus Habitar</h1>
              <p className="text-slate-400 text-sm mb-2">CRECI: 12345-PA</p>
              <div className="flex items-center gap-1 justify-center sm:justify-start mb-3">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className={`w-4 h-4 ${i <= 4 ? "text-amber-400" : "text-slate-700"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
                <span className="text-slate-400 text-sm ml-1">4.0 · {AVALIACOES.length} avaliações</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="text-xs bg-blue-900/40 border border-blue-700/30 text-blue-300 px-3 py-1 rounded-full">Especialista em Belém</span>
                <span className="text-xs bg-emerald-900/40 border border-emerald-700/30 text-emerald-300 px-3 py-1 rounded-full">Resposta rápida</span>
                <span className="text-xs bg-amber-900/40 border border-amber-700/30 text-amber-300 px-3 py-1 rounded-full">Alto padrão</span>
              </div>
            </div>
            {/* Stats */}
            <div className="flex sm:flex-col gap-4 sm:gap-3 text-center">
              <div className="bg-[#070d1a] border border-white/8 rounded-xl px-4 py-3">
                <p className="text-white font-bold text-xl">{imoveis.length}+</p>
                <p className="text-slate-500 text-xs">Imóveis</p>
              </div>
              <div className="bg-[#070d1a] border border-white/8 rounded-xl px-4 py-3">
                <p className="text-white font-bold text-xl">4.0</p>
                <p className="text-slate-500 text-xs">Avaliação</p>
              </div>
            </div>
          </div>
        </div>

        {/* Avaliações */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">Avaliações dos clientes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {AVALIACOES.map((av, i) => (
              <div key={i} className="bg-[#0e1829] border border-white/8 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-blue-900/50 flex items-center justify-center text-[10px] font-bold text-blue-300">{av.nome[0]}</div>
                  <div>
                    <p className="text-slate-200 text-xs font-semibold">{av.nome}</p>
                    <p className="text-slate-600 text-[10px]">{av.data}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className={`w-3 h-3 ${s <= av.nota ? "text-amber-400" : "text-slate-700"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">&quot;{av.texto}&quot;</p>
              </div>
            ))}
          </div>
        </div>

        {/* Imóveis do corretor */}
        <div>
          <h2 className="text-lg font-bold text-white mb-2">Imóveis anunciados por esse corretor</h2>
          <p className="text-slate-500 text-sm mb-6">Veja todos os imóveis disponíveis</p>
          {carregando ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-[#0e1829] border border-white/8 rounded-xl overflow-hidden animate-pulse">
                  <div className="h-40 bg-white/5" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-white/8 rounded w-1/2" />
                    <div className="h-4 bg-white/8 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {imoveis.map(im => (
                <Link key={im.id} href={`/imoveis/${im.id}`} className="group block">
                  <article className="h-full bg-[#0e1829] border border-white/8 hover:border-blue-500/40 rounded-xl overflow-hidden transition-all">
                    <div className="relative h-40 bg-[#0a1628] overflow-hidden">
                      {im.capa ? (
                        <Image src={im.capa} alt={im.titulo} fill style={{ objectFit: "cover" }} className="group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 33vw" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.4}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0L22.75 12M4.5 9.75v10.125A1.125 1.125 0 005.625 21h3.75A1.125 1.125 0 0010.5 19.875V15a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v4.875A1.125 1.125 0 0014.625 21h3.75A1.125 1.125 0 0019.5 19.875V9.75"/></svg>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-bold uppercase">{im.tipo_imovel}</span>
                        <span className={`px-2 py-0.5 rounded-full text-white text-[9px] font-bold uppercase ${im.finalidade === "Aluguel" ? "bg-emerald-600/80" : "bg-blue-600/80"}`}>{im.finalidade}</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className={`font-bold text-lg mb-1 ${im.finalidade === "Aluguel" ? "text-emerald-400" : "text-blue-400"}`}>{formatarPreco(im.preco)}</p>
                      <p className="text-slate-200 text-sm font-medium line-clamp-1 mb-1">{im.titulo}</p>
                      <p className="text-slate-500 text-xs">{im.bairro}, {im.cidade}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-white/8 mt-10">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <Image src="/logo_nome.png" alt="Nexus Habitar" width={80} height={24} className="h-6 w-auto opacity-50" />
          <p className="text-slate-600 text-xs">© {new Date().getFullYear()} Nexus Habitar</p>
          <Link href="/" className="text-slate-500 hover:text-blue-400 text-xs">← Home</Link>
        </div>
      </footer>
    </div>
  );
}
