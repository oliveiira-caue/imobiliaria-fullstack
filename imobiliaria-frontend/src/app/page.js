"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = "http://localhost:8000";

/* ─── Ícones ────────────────────────────────────────────────────────────── */
const IconBed = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12V19M21 12V19M3 12C3 9.791 4.791 8 7 8H17C19.209 8 21 9.791 21 12M3 12H21M7 8V6C7 4.895 7.895 4 9 4H15C16.105 4 17 4.895 17 6V8" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 19H21" /></svg>
);
const IconBath = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M4 12H20M20 12V17C20 18.105 19.105 19 18 19H6C4.895 19 4 18.105 4 17V12M6 19V21M18 19V21" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 12V5C6 3.895 6.895 3 8 3C9.105 3 10 3.895 10 5V6" /></svg>
);
const IconCar = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M5 17H3V11L5.5 5H18.5L21 11V17H19" /><circle cx="7.5" cy="17" r="2" /><circle cx="16.5" cy="17" r="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 11H21" /></svg>
);

/* ─── Utilitários ────────────────────────────────────────────────────────── */
const formatarPreco = (v) =>
  v ? Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }) : "Sob consulta";

export default function HomePage() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os imóveis da API do Django
  useEffect(() => {
    fetch(`${API}/api/imoveis/`)
      .then((r) => r.json())
      .then((data) => {
        // Se usar paginação no Django REST (PageNumberPagination), os dados estarão em data.results
        const lista = Array.isArray(data) ? data : data.results || [];
        // Pega os 6 primeiros para a seção de destaque
        setImoveis(lista.slice(0, 6));
      })
      .catch((err) => console.error("Erro ao carregar imóveis:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1120] text-white font-sans">

      {/* ─── HEADER SIMPLES ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0B1120]/90 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <img src="/logo_nome.png" alt="Nexus Habitar" className="h-8 w-auto object-contain opacity-90" />
          </Link>
          <nav className="hidden sm:flex gap-6 text-sm font-semibold text-slate-400">
            <Link href="/" className="hover:text-white transition">Início</Link>
            <Link href="#" className="hover:text-white transition">Comprar</Link>
            <Link href="#" className="hover:text-white transition">Alugar</Link>
          </nav>
        </div>
      </header>

      {/* ─── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-[#0F172A] to-[#0B1120]">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Encontre o seu <span className="text-blue-500">lugar ideal.</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Imóveis exclusivos recomendados por nossa Inteligência Artificial para o seu estilo de vida.
          </p>
        </div>
      </section>

      {/* ─── IMÓVEIS EM DESTAQUE ────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Imóveis em Destaque</h2>
          <p className="text-slate-400 mt-2">Confira as melhores oportunidades selecionadas para você.</p>
        </div>

        {loading ? (
          /* Skeleton Loading dos Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 bg-[#0F172A] rounded-2xl border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : imoveis.length > 0 ? (
          /* Grid de Imóveis */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {imoveis.map((imovel) => (
              <Link key={imovel.id} href={`/imoveis/${imovel.id}`} className="group block">
                <div className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-900/20 h-full flex flex-col">

                  {/* Imagem do Card */}
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    {imovel.capa ? (
                      <img
                        src={imovel.capa}
                        alt={imovel.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm">Sem foto</div>
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0B1120]/80 backdrop-blur border border-slate-700 text-slate-200 text-[10px] font-bold uppercase tracking-wider">
                      {imovel.finalidade}
                    </span>
                  </div>

                  {/* Informações do Card */}
                  <div className="p-5 flex flex-col flex-grow">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">
                      {imovel.tipo_imovel}
                    </p>
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {imovel.titulo}
                    </h3>
                    <p className="text-slate-500 text-xs mb-4 line-clamp-1">
                      {[imovel.bairro, imovel.cidade].filter(Boolean).join(", ")}
                    </p>

                    <div className="mt-auto">
                      <p className="text-xl font-black text-white mb-4">{formatarPreco(imovel.preco)}</p>

                      {/* Estatísticas (Quartos, Banheiros, Vagas) */}
                      <div className="flex items-center gap-4 border-t border-slate-800 pt-4 text-slate-400 text-xs">
                        <div className="flex items-center gap-1.5" title="Quartos">
                          <IconBed /> <span>{imovel.quartos || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Banheiros">
                          <IconBath /> <span>{imovel.banheiros || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Vagas">
                          <IconCar /> <span>{imovel.vagas || 0}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border border-slate-800 rounded-2xl bg-[#0F172A]">
            <p className="text-slate-400">Nenhum imóvel encontrado no momento.</p>
          </div>
        )}
      </main>

      {/* ─── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 bg-[#0F172A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center gap-4">
          <img src="/logo_nome.png" alt="Nexus Habitar" className="h-6 object-contain opacity-50" />
          <p className="text-slate-600 text-xs">© {new Date().getFullYear()} Nexus Habitar. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}