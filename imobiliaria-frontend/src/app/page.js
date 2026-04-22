"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const SUGESTOES = [
  "Ex: Imóvel com 3 suítes no bairro Umarizal...",
  "Ex: Casa com alta metragem quadrada no bairro Nazaré...",
  "Ex: Cobertura de alto padrão em Batista Campos...",
  "Ex: Apartamento com vista para a baía no Marco...",
];

const FILTROS_INICIAL = {
  finalidade: "", tipos: [], precoMin: "", precoMax: "",
  areaMin: "", areaMax: "", quartos: "", suites: "", banheiros: "", vagas: "",
};

const LISTA_COMODIDADES = [
  "Piscina", "Academia", "Churrasqueira", "Salão de Festas", "Playground",
  "Brinquedoteca", "Portaria 24h", "Elevador", "Varanda / Sacada",
  "Ar Condicionado", "Mobiliado", "Closet", "Escritório", "Piso Porcelanato",
  "SPA / Sauna", "Quadra Tênis", "Pet Friendly", "Jardim", "Área de Serviço",
  "Cozinha Americana", "Interfone", "Portão Eletrônico", "Sistema de Segurança", "Gerador",
];

/* ── Ícones ────────────────────────────────────────────────────────────────── */
function IconHome({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0L22.75 12M4.5 9.75v10.125A1.125 1.125 0 005.625 21h3.75A1.125 1.125 0 0010.5 19.875V15a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v4.875A1.125 1.125 0 0014.625 21h3.75A1.125 1.125 0 0019.5 19.875V9.75" />
    </svg>
  );
}

function IconMapPin({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function IconSparkles({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}

function IconHamburger() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function IconFunnel({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
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

function IconArea({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
      <line x1="21" x2="14" y1="3" y2="10" /><line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  );
}

function formatarMoeda(valor) {
  const numeros = valor.replace(/\D/g, '');
  if (!numeros) return '';
  return Number(numeros).toLocaleString('pt-BR');
}

/* ════════════════════════════════════════════════════════════════════════════
   PAINEL DE FILTROS
═══════════════════════════════════════════════════════════════════════════ */
function PainelFiltros({ filtros, setFiltros, onAplicar, onFechar }) {
  const BotoesOpcao = ({ campo, opcoes }) => (
    <div className="flex gap-2 flex-wrap">
      {opcoes.map(v => (
        <button
          key={v} type="button"
          onClick={() => setFiltros(f => ({ ...f, [campo]: f[campo] === v ? "" : v }))}
          className={`w-10 h-10 rounded-full text-xs font-semibold transition-all border ${
            filtros[campo] === v
              ? "bg-blue-600 text-white border-blue-600"
              : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onFechar} />
      <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h3 className="text-white font-bold text-sm">Filtros de Busca</h3>
          <button type="button" onClick={onFechar} className="text-slate-500 hover:text-white transition-colors">
            <IconClose />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Finalidade</p>
            <div className="flex gap-2">
              {[
                { op: "Venda", ativo: "bg-blue-600 border-blue-500 text-white" },
                { op: "Aluguel", ativo: "bg-emerald-600 border-emerald-500 text-white" },
              ].map(({ op, ativo }) => (
                <button
                  key={op} type="button"
                  onClick={() => setFiltros(f => ({ ...f, finalidade: f.finalidade === op ? "" : op }))}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    filtros.finalidade === op
                      ? ativo
                      : "bg-transparent border-slate-700 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Tipo de imóvel</p>
            <div className="grid grid-cols-2 gap-2">
              {["Apartamento", "Casa", "Terreno", "Sala Comercial"].map(tipo => (
                <label key={tipo} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filtros.tipos.includes(tipo)}
                    onChange={() => setFiltros(f => ({
                      ...f,
                      tipos: f.tipos.includes(tipo)
                        ? f.tipos.filter(t => t !== tipo)
                        : [...f.tipos, tipo]
                    }))}
                    className="rounded border-slate-600 bg-[#080E1A] text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-slate-300 text-xs group-hover:text-white transition-colors">{tipo}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Faixa de preço</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text" inputMode="numeric" placeholder="Mínimo R$"
                value={filtros.precoMin}
                onChange={(e) => setFiltros(f => ({ ...f, precoMin: formatarMoeda(e.target.value) }))}
                className="bg-[#080E1A] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
              <input
                type="text" inputMode="numeric" placeholder="Máximo R$"
                value={filtros.precoMax}
                onChange={(e) => setFiltros(f => ({ ...f, precoMax: formatarMoeda(e.target.value) }))}
                className="bg-[#080E1A] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
          </div>

          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Área útil (m²)</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text" inputMode="numeric" placeholder="Área mínima"
                value={filtros.areaMin}
                onChange={(e) => setFiltros(f => ({ ...f, areaMin: e.target.value.replace(/\D/g, '') }))}
                className="bg-[#080E1A] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
              <input
                type="text" inputMode="numeric" placeholder="Área máxima"
                value={filtros.areaMax}
                onChange={(e) => setFiltros(f => ({ ...f, areaMax: e.target.value.replace(/\D/g, '') }))}
                className="bg-[#080E1A] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
          </div>

          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Quartos</p>
            <BotoesOpcao campo="quartos" opcoes={["1", "2", "3", "4+"]} />
          </div>

          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Suítes</p>
            <BotoesOpcao campo="suites" opcoes={["0", "1", "2", "3+"]} />
          </div>

          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Banheiros</p>
            <BotoesOpcao campo="banheiros" opcoes={["1", "2", "3", "4+"]} />
          </div>

          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Vagas</p>
            <BotoesOpcao campo="vagas" opcoes={["0", "1", "2", "3+"]} />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-800 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFiltros(FILTROS_INICIAL)}
            className="text-slate-400 hover:text-white text-xs font-medium transition-colors whitespace-nowrap"
          >
            Limpar tudo
          </button>
          <button
            type="button"
            onClick={onAplicar}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   VITRINE CURADORIA
═══════════════════════════════════════════════════════════════════════════ */
function VitrineCuradoria() {
  const [data, setData] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [finalidadeFiltro, setFinalidadeFiltro] = useState("Todos");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [quartosFiltro, setQuartosFiltro] = useState("");
  const [precoMinFiltro, setPrecoMinFiltro] = useState("");
  const [precoMaxFiltro, setPrecoMaxFiltro] = useState("");
  const [comodidades, setComodidades] = useState([]);
  const [mostrarComod, setMostrarComod] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/imoveis/lista/`)
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  let imoveis = data.filter(im => im.ativo !== false);
  if (finalidadeFiltro !== "Todos") imoveis = imoveis.filter(im => im.finalidade === finalidadeFiltro);
  if (tipoFiltro) imoveis = imoveis.filter(im => im.tipo_imovel === tipoFiltro);
  if (quartosFiltro) imoveis = imoveis.filter(im => Number(im.quartos) >= Number(quartosFiltro));
  if (precoMinFiltro) imoveis = imoveis.filter(im => Number(im.preco) >= Number(precoMinFiltro));
  if (precoMaxFiltro) imoveis = imoveis.filter(im => Number(im.preco) <= Number(precoMaxFiltro));
  if (comodidades.length > 0) {
    imoveis = imoveis.filter(im => {
      if (!im.comodidades_condominio) return false;
      const imComod = im.comodidades_condominio.split(",").map(s => s.trim().toLowerCase());
      return comodidades.every(c => imComod.includes(c.trim().toLowerCase()));
    });
  }
  const imoveisFiltrados = imoveis.slice(0, 9);

  const formatarPreco = (v) =>
    v ? Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }) : "Sob consulta";

  const selectClass = "bg-[#070d1a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-400 outline-none focus:border-blue-500 cursor-pointer";

  return (
    <section className="bg-[#070d1a] pt-12 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Cabeçalho da vitrine */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-1">Curadoria especial</p>
            <h2 className="text-2xl font-extrabold text-white">Imóveis em Destaque</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {["Todos", "Venda", "Aluguel"].map(f => (
                <button key={f} type="button" onClick={() => setFinalidadeFiltro(f)}
                  className={`text-xs rounded-full px-3 py-1.5 border transition-all ${finalidadeFiltro === f ? "bg-blue-600/20 border-blue-500/40 text-blue-300 font-medium" : "bg-white/4 border-white/8 text-slate-500 hover:text-slate-300"}`}>
                  {f}
                </button>
              ))}
            </div>
            <Link
              href={
                finalidadeFiltro === "Venda" ? "/imoveis/venda" :
                finalidadeFiltro === "Aluguel" ? "/imoveis/aluguel" :
                "/imoveis/todos"
              }
              className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1 transition-colors"
            >
              Ver todos
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Barra de filtros */}
        <div className="bg-[#0b1525] border border-white/8 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 mb-8">
          {["Apartamento", "Casa", "Sala Comercial", "Terreno"].map(t => (
            <button key={t} type="button" onClick={() => setTipoFiltro(tipoFiltro === t ? "" : t)}
              className={`text-xs rounded-full px-3 py-1.5 border transition-all ${tipoFiltro === t ? "bg-blue-600/20 border-blue-500/40 text-blue-300 font-medium" : "bg-white/4 border-white/8 text-slate-500 hover:text-slate-300"}`}>
              {t}
            </button>
          ))}

          <div className="w-px h-5 bg-white/10 hidden sm:block" />

          <select value={quartosFiltro} onChange={e => setQuartosFiltro(e.target.value)} className={selectClass}>
            <option value="">Quartos</option>
            {["1","2","3","4","5"].map(q => <option key={q} value={q}>{q}+</option>)}
          </select>

          <select value={precoMinFiltro} onChange={e => setPrecoMinFiltro(e.target.value)} className={selectClass}>
            <option value="">Preço mín.</option>
            <option value="200000">R$ 200mil</option>
            <option value="500000">R$ 500mil</option>
            <option value="1000000">R$ 1M</option>
            <option value="2000000">R$ 2M</option>
            <option value="3000000">R$ 3M</option>
          </select>

          <select value={precoMaxFiltro} onChange={e => setPrecoMaxFiltro(e.target.value)} className={selectClass}>
            <option value="">Preço máx.</option>
            <option value="500000">Até R$ 500mil</option>
            <option value="1000000">Até R$ 1M</option>
            <option value="2000000">Até R$ 2M</option>
            <option value="5000000">Até R$ 5M</option>
          </select>

          {/* Comodidades — sempre no final */}
          <div className="relative">
            <button type="button" onClick={() => setMostrarComod(v => !v)}
              className={`flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 border transition-all ${comodidades.length > 0 ? "bg-blue-600/20 border-blue-500/40 text-blue-300" : "bg-[#070d1a] border-white/10 text-slate-400 hover:text-slate-300"}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Comodidades {comodidades.length > 0 && `(${comodidades.length})`}
            </button>
            {mostrarComod && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-[#0e1829] border border-white/10 rounded-xl p-4 shadow-2xl w-72">
                <div className="flex justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-300">Comodidades</p>
                  {comodidades.length > 0 && (
                    <button type="button" onClick={() => setComodidades([])} className="text-[10px] text-slate-500 hover:text-red-400">Limpar</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                  {LISTA_COMODIDADES.map(c => {
                    const on = comodidades.includes(c);
                    return (
                      <button key={c} type="button"
                        onClick={() => setComodidades(p => on ? p.filter(x => x !== c) : [...p, c])}
                        className={`text-[10px] text-left px-2.5 py-1.5 rounded-lg border transition-all ${on ? "bg-blue-600/20 border-blue-500/40 text-blue-300 font-medium" : "bg-white/4 border-white/8 text-slate-500 hover:text-slate-300"}`}>
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grid de cards */}
        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#0e1829] border border-white/8 rounded-xl overflow-hidden animate-pulse">
                <div className="h-44 bg-white/5" />
                <div className="p-4 space-y-2">
                  <div className="h-2.5 bg-white/8 rounded w-1/3" />
                  <div className="h-4 bg-white/8 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : imoveisFiltrados.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-500 text-sm">Nenhum imóvel encontrado com os filtros selecionados.</p>
            <button
              onClick={() => { setTipoFiltro(""); setQuartosFiltro(""); setPrecoMinFiltro(""); setPrecoMaxFiltro(""); setComodidades([]); }}
              className="mt-3 text-blue-400 hover:text-blue-300 text-xs underline"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {imoveisFiltrados.map(im => {
              const isAluguel = im.finalidade === "Aluguel";
              const corPreco = isAluguel ? "text-emerald-400" : "text-blue-400";
              const corBadge = isAluguel ? "bg-emerald-600/80" : "bg-blue-600/80";
              return (
                <Link key={im.id} href={`/imoveis/${im.id}`} className="group block">
                  <article className="h-full bg-[#0e1829] border border-white/8 hover:border-blue-500/40 rounded-xl overflow-hidden transition-all duration-300">
                    <div className="relative h-44 bg-[#0a1628] overflow-hidden">
                      {im.capa ? (
                        <Image
                          src={im.capa} alt={im.titulo} fill
                          style={{ objectFit: "cover" }}
                          className="group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <IconHome className="w-12 h-12 text-slate-700" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold uppercase">{im.tipo_imovel}</span>
                        <span className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold uppercase ${corBadge}`}>{im.finalidade}</span>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/55 text-slate-400 text-[9px] px-2 py-0.5 rounded-full">{(im.id % 17) + 5} viram hoje</div>
                    </div>
                    <div className="p-3">
                      <p className={`${corPreco} font-extrabold text-xl mb-1`}>{formatarPreco(im.preco)}</p>
                      <h3 className="text-slate-200 font-bold text-sm mb-2 line-clamp-1">{im.titulo}</h3>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-3">
                        <IconMapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{im.bairro}, {im.cidade}, PA</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/8 pt-3">
                        {im.area_util && (
                          <div className="flex flex-col items-center gap-1">
                            <IconArea className="w-3.5 h-3.5 text-slate-600" />
                            <span className="text-[10px] text-slate-400">{im.area_util} m²</span>
                          </div>
                        )}
                        {im.quartos && (
                          <div className="flex flex-col items-center gap-1">
                            <IconBed className="w-3.5 h-3.5 text-slate-600" />
                            <span className="text-[10px] text-slate-400">{im.quartos} Dorm.</span>
                          </div>
                        )}
                        {im.banheiros && (
                          <div className="flex flex-col items-center gap-1">
                            <IconBath className="w-3.5 h-3.5 text-slate-600" />
                            <span className="text-[10px] text-slate-400">{im.banheiros} Ban.</span>
                          </div>
                        )}
                        {im.vagas && (
                          <div className="flex flex-col items-center gap-1">
                            <IconCar className="w-3.5 h-3.5 text-slate-600" />
                            <span className="text-[10px] text-slate-400">{im.vagas} Vag.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const router = useRouter();

  const [busca, setBusca] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [erroIA, setErroIA] = useState("");

  const [abaAtiva, setAbaAtiva] = useState("inteligente");

  const [buscaFiltrada, setBuscaFiltrada] = useState("");
  const [filtros, setFiltros] = useState(FILTROS_INICIAL);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [formAnuncio, setFormAnuncio] = useState({ nome: "", telefone: "", email: "", preferencia: "" });
  const [enviandoAnuncio, setEnviandoAnuncio] = useState(false);
  const [statusAnuncio, setStatusAnuncio] = useState(null);

  const [sugestaoIdx, setSugestaoIdx] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderVisible(false);
      setTimeout(() => {
        setSugestaoIdx((prev) => (prev + 1) % SUGESTOES.length);
        setPlaceholderVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (filtrosAbertos) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [filtrosAbertos]);

  const abrirModal = (e) => { e.preventDefault(); setModalAberto(true); setStatusAnuncio(null); };
  const fecharModal = () => { setModalAberto(false); setFormAnuncio({ nome: "", telefone: "", email: "", preferencia: "" }); setStatusAnuncio(null); };

  const qtdFiltrosAtivos = [
    filtros.finalidade,
    ...filtros.tipos,
    filtros.precoMin, filtros.precoMax,
    filtros.areaMin, filtros.areaMax,
    filtros.quartos, filtros.suites, filtros.banheiros, filtros.vagas,
  ].filter(Boolean).length;

  const handleSearch = async (e) => {
    e.preventDefault();
    const textoBusca = busca.trim();
    if (!textoBusca) { setErroIA("Digite o que você procura antes de buscar."); return; }
    setErroIA("");
    setBuscando(true);
    try {
      const res = await fetch(`${API}/api/busca-ia/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ busca: textoBusca }),
      });
      if (!res.ok) throw new Error(await res.text());
      const dados = await res.json();
      sessionStorage.setItem("nexus_resultados_ia", JSON.stringify({ ...dados, termoBusca: textoBusca }));
      router.push("/resultados");
    } catch (err) {
      console.error(err);
      setErroIA("Não foi possível contactar a IA. Tente novamente.");
    } finally {
      setBuscando(false);
    }
  };

  const handleBuscaFiltrada = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const params = new URLSearchParams();
    if (buscaFiltrada.trim()) params.set("termo", buscaFiltrada.trim());
    if (filtros.finalidade) params.set("finalidade", filtros.finalidade);
    filtros.tipos.forEach(t => params.append("tipo", t));
    if (filtros.precoMin) params.set("preco_min", filtros.precoMin.replace(/\./g, ''));
    if (filtros.precoMax) params.set("preco_max", filtros.precoMax.replace(/\./g, ''));
    if (filtros.areaMin) params.set("area_min", filtros.areaMin);
    if (filtros.areaMax) params.set("area_max", filtros.areaMax);
    if (filtros.quartos) params.set("quartos", filtros.quartos);
    if (filtros.suites) params.set("suites", filtros.suites);
    if (filtros.banheiros) params.set("banheiros", filtros.banheiros);
    if (filtros.vagas) params.set("vagas", filtros.vagas);
    router.push(`/busca?${params.toString()}`);
  };

  const aplicarFiltros = () => {
    setFiltrosAbertos(false);
    document.body.style.overflow = '';
  };

  const enviarAnuncio = async (e) => {
    e.preventDefault();
    setEnviandoAnuncio(true);
    try {
      const res = await fetch(`${API}/api/leads/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formAnuncio.nome,
          telefone: formAnuncio.telefone,
          email: formAnuncio.email,
          mensagem: `Interesse em anunciar imóvel — Preferência: ${formAnuncio.preferencia || "Não informado"}`,
          meio_contato: "Formulário de Anúncio",
        }),
      });
      setStatusAnuncio(res.ok ? "ok" : "erro");
    } catch { setStatusAnuncio("erro"); }
    finally { setEnviandoAnuncio(false); }
  };

  return (
    <div className="min-h-screen bg-[#070d1a] text-white">

      {/* ─── HEADER ──────────────────────────────────────────────────────── */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex-shrink-0">
              <Image src="/logo_nome.png" alt="Nexus Habitar" width={240} height={80} className="h-14 md:h-20 w-auto object-contain" />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={abrirModal}
                className="px-4 py-1.5 rounded-lg border border-blue-600 text-blue-500 hover:bg-blue-600/25 hover:border-blue-500 hover:text-blue-400 text-xs font-semibold tracking-wide transition-colors duration-150"
              >
                Anuncie seu imóvel
              </button>
            </nav>
            <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">
              {menuOpen ? <IconClose /> : <IconHamburger />}
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden bg-[#0F172A]/95 backdrop-blur-md rounded-xl mb-3 p-5 border border-slate-800 flex flex-col gap-3">
              <button
                onClick={(e) => { setMenuOpen(false); abrirModal(e); }}
                className="text-slate-200 hover:text-blue-400 text-sm font-medium transition-colors text-left"
              >
                Anuncie seu imóvel
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/foto_capa.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#070d1a]" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center gap-6 pt-20">

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Busca Inteligente com IA
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg">
            Encontre o{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              imóvel certo.
            </span>{" "}
            Sem filtros. Sem complicação.
          </h1>

          <p className="text-slate-300 text-sm md:text-base font-light max-w-lg">
            Descreva o que você procura e nossa IA encontra as melhores opções para você.
          </p>

          {/* ─── BUSCADOR COM ABAS ─────────────────────────────────────── */}
          <div className="w-full bg-[#0F172A]/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">

            <div className="flex border-b border-slate-800">
              <button
                type="button"
                onClick={() => setAbaAtiva("inteligente")}
                className={`flex-1 py-2.5 text-xs font-semibold tracking-wide transition-colors ${
                  abaAtiva === "inteligente"
                    ? "border-b-2 border-blue-500 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Busca Inteligente
              </button>
              <button
                type="button"
                onClick={() => setAbaAtiva("filtrada")}
                className={`flex-1 py-2.5 text-xs font-semibold tracking-wide transition-colors ${
                  abaAtiva === "filtrada"
                    ? "border-b-2 border-blue-500 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Busca Filtrada
              </button>
            </div>

            {abaAtiva === "inteligente" && (
              <form onSubmit={handleSearch} className="p-3 sm:p-4 flex flex-col gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <IconSparkles className="w-4 h-4" />
                  </span>
                  {busca === "" && (
                    <span
                      aria-hidden="true"
                      className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-sm truncate max-w-[calc(100%-3rem)] transition-opacity duration-400"
                      style={{ opacity: placeholderVisible ? 1 : 0 }}
                    >
                      {SUGESTOES[sugestaoIdx]}
                    </span>
                  )}
                  <input
                    type="text"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder=""
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#0B1120] border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={buscando}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {buscando ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Processando...
                    </>
                  ) : (
                    <>
                      <IconSparkles className="w-3.5 h-3.5 text-white" />
                      Buscar com IA
                    </>
                  )}
                </button>
                {erroIA && (
                  <p className="text-red-400 text-xs flex items-center gap-1.5 px-1">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    {erroIA}
                  </p>
                )}
              </form>
            )}

            {abaAtiva === "filtrada" && (
              <form onSubmit={handleBuscaFiltrada} className="p-3 sm:p-4 flex flex-col gap-3">
                <input
                  type="text"
                  value={buscaFiltrada}
                  onChange={(e) => setBuscaFiltrada(e.target.value)}
                  placeholder="Ex: Umarizal, apartamentos, Belém..."
                  className="w-full h-11 px-4 rounded-xl bg-[#0B1120] border border-slate-700 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setFiltrosAbertos(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 text-xs font-semibold transition-colors"
                  >
                    <IconFunnel />
                    Filtros
                    {qtdFiltrosAtivos > 0 && (
                      <span className="ml-0.5 bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                        {qtdFiltrosAtivos}
                      </span>
                    )}
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-900/40 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                  >
                    Buscar Imóveis
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Badges de confiança */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 pb-2">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-5 h-5 rounded-full bg-emerald-900/40 border border-emerald-700/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>
              Imóveis verificados
            </span>
            <span className="hidden sm:block w-px h-3 bg-white/10" />

            <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-5 h-5 rounded-full bg-blue-900/40 border border-blue-700/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </span>
              Dados seguros
            </span>
            <span className="hidden sm:block w-px h-3 bg-white/10" />

            <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-5 h-5 rounded-full bg-amber-900/40 border border-amber-700/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Resposta em até 2h
            </span>
            <span className="hidden sm:block w-px h-3 bg-white/10" />

            <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-5 h-5 rounded-full bg-purple-900/40 border border-purple-700/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </span>
              Cobertura total em Belém
            </span>
          </div>
        </div>
      </section>

      {/* ─── PAINEL DE FILTROS ───────────────────────────────────────────── */}
      {filtrosAbertos && (
        <PainelFiltros
          filtros={filtros}
          setFiltros={setFiltros}
          onAplicar={aplicarFiltros}
          onFechar={() => setFiltrosAbertos(false)}
        />
      )}

      {/* ─── VITRINE CURADORIA ───────────────────────────────────────────── */}
      <VitrineCuradoria />

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 bg-[#070d1a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Image src="/logo_nome.png" alt="Nexus Habitar" width={160} height={50} className="h-6 w-auto object-contain opacity-50" />
          <p className="text-slate-500 text-xs text-center">
            © {new Date().getFullYear()} Nexus Habitar. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-slate-500 hover:text-blue-400 text-xs transition-colors">Privacidade</Link>
            <Link href="#" className="text-slate-500 hover:text-blue-400 text-xs transition-colors">Termos</Link>
          </div>
        </div>
      </footer>

      {/* ─── MODAL — ANUNCIE SEU IMÓVEL ──────────────────────────────────── */}
      {modalAberto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) fecharModal(); }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
            <div className="flex items-start justify-between p-6 border-b border-slate-800">
              <div>
                <h2 className="text-blue-400 font-extrabold text-lg leading-tight">Anuncie seu imóvel gratuitamente</h2>
                <p className="text-slate-400 text-xs mt-1 max-w-xs">
                  Preencha o formulário e nossa equipe entrará em contato com você o mais rápido possível.
                </p>
              </div>
              <button onClick={fecharModal} className="text-slate-500 hover:text-white transition-colors ml-4 mt-0.5 shrink-0">
                <IconClose />
              </button>
            </div>
            {statusAnuncio === "ok" ? (
              <div className="p-8 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                  <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-base">Recebemos seu contato!</p>
                  <p className="text-slate-400 text-sm mt-1">Em breve nossa equipe entrará em contato com você.</p>
                </div>
                <button onClick={fecharModal} className="mt-2 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors">
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={enviarAnuncio} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nome completo</label>
                  <input type="text" required value={formAnuncio.nome} onChange={(e) => setFormAnuncio(p => ({ ...p, nome: e.target.value }))} placeholder="Seu nome"
                    className="w-full bg-[#080E1A] border border-slate-800 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Telefone / WhatsApp</label>
                  <input type="tel" required value={formAnuncio.telefone} onChange={(e) => setFormAnuncio(p => ({ ...p, telefone: e.target.value }))} placeholder="(91) 99999-9999"
                    className="w-full bg-[#080E1A] border border-slate-800 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">E-mail</label>
                  <input type="email" value={formAnuncio.email} onChange={(e) => setFormAnuncio(p => ({ ...p, email: e.target.value }))} placeholder="seu@email.com"
                    className="w-full bg-[#080E1A] border border-slate-800 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tipo de anúncio</label>
                  <div className="flex gap-2">
                    {["Venda", "Aluguel"].map((op) => (
                      <button key={op} type="button" onClick={() => setFormAnuncio(p => ({ ...p, preferencia: op }))}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                          formAnuncio.preferencia === op
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-[#080E1A] border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                        }`}
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                </div>
                {statusAnuncio === "erro" && (
                  <p className="text-red-400 text-xs flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    Ocorreu um erro. Tente novamente.
                  </p>
                )}
                <button type="submit" disabled={enviandoAnuncio}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {enviandoAnuncio ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Enviando...
                    </>
                  ) : "Enviar solicitação"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
