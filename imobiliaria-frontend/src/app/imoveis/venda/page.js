"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function formatarPreco(v) {
  return v
    ? Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
    : "Sob consulta";
}

function IconArea({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
      <line x1="21" x2="14" y1="3" y2="10" /><line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  );
}
function IconBed({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
      <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
      <path d="M12 4v6" /><path d="M2 18h20" />
    </svg>
  );
}
function IconBath({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <line x1="10" x2="8" y1="5" y2="7" /><line x1="2" x2="22" y1="12" y2="12" />
      <line x1="7" x2="7" y1="19" y2="21" /><line x1="17" x2="17" y1="19" y2="21" />
    </svg>
  );
}
function IconCar({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
    </svg>
  );
}
function IconMapPin({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

export default function ImoveisVenda() {
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/imoveis/lista/`)
      .then(r => r.json())
      .then(data => setImoveis(data.filter(im => im.ativo !== false && im.finalidade === "Venda")))
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/">
            <img src="/logo_nome.png" alt="Nexus Habitar" className="h-8 object-contain" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 text-xs font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="text-blue-600 text-xs font-semibold tracking-widest uppercase mb-1">Disponíveis para venda</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Imóveis à Venda</h1>
          {!carregando && (
            <p className="text-slate-500 text-sm mt-1">{imoveis.length} imóvel{imoveis.length !== 1 ? "is" : ""} encontrado{imoveis.length !== 1 ? "s" : ""}</p>
          )}
        </div>

        {carregando ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 border-b border-slate-100 pb-4 animate-pulse">
                <div className="w-40 h-28 bg-slate-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-slate-200 rounded w-1/4" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-5 bg-slate-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : imoveis.length === 0 ? (
          <div className="py-24 text-center text-slate-500 text-sm">
            Nenhum imóvel à venda cadastrado ainda.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {imoveis.map(im => (
              <div key={im.id} className="flex items-start gap-4 py-5">
                {/* Foto */}
                <div className="w-40 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                  {im.capa ? (
                    <img src={im.capa} alt={im.titulo} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0L22.75 12M4.5 9.75v10.125A1.125 1.125 0 005.625 21h3.75A1.125 1.125 0 0010.5 19.875V15a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v4.875A1.125 1.125 0 0014.625 21h3.75A1.125 1.125 0 0019.5 19.875V9.75" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Dados */}
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide mb-1">
                    {im.tipo_imovel}
                  </span>
                  <h2 className="text-slate-900 font-bold text-sm leading-snug mb-1 line-clamp-2">{im.titulo}</h2>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
                    <IconMapPin />
                    <span className="truncate">{im.bairro}, {im.cidade}, PA</span>
                  </div>
                  <p className="text-blue-600 font-extrabold text-lg mb-2">{formatarPreco(im.preco)}</p>
                  <div className="flex items-center gap-3 text-slate-500 text-xs">
                    {im.area_util && (
                      <span className="flex items-center gap-1">
                        <IconArea className="w-3.5 h-3.5" />{im.area_util} m²
                      </span>
                    )}
                    {im.quartos && (
                      <span className="flex items-center gap-1">
                        <IconBed className="w-3.5 h-3.5" />{im.quartos} Dorm.
                      </span>
                    )}
                    {im.banheiros && (
                      <span className="flex items-center gap-1">
                        <IconBath className="w-3.5 h-3.5" />{im.banheiros} Ban.
                      </span>
                    )}
                    {im.vagas && (
                      <span className="flex items-center gap-1">
                        <IconCar className="w-3.5 h-3.5" />{im.vagas} Vag.
                      </span>
                    )}
                  </div>
                </div>

                {/* Botão */}
                <div className="shrink-0 self-center">
                  <Link
                    href={`/imoveis/${im.id}`}
                    className="border border-blue-500 text-blue-400 hover:bg-blue-600/10 rounded-xl px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
