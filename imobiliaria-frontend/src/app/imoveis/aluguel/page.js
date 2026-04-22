"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const LISTA_COMODIDADES = [
  "Piscina", "Academia", "Churrasqueira", "Salão de Festas", "Playground",
  "Brinquedoteca", "Portaria 24h", "Elevador", "Varanda / Sacada",
  "Ar Condicionado", "Mobiliado", "Closet", "Escritório", "Piso Porcelanato",
  "SPA / Sauna", "Quadra Tênis", "Pet Friendly", "Jardim", "Área de Serviço",
  "Cozinha Americana", "Interfone", "Portão Eletrônico", "Sistema de Segurança", "Gerador",
];

function formatarPreco(v) {
  return v ? Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }) : "Sob consulta";
}

function IconMapPin({ className = "w-3.5 h-3.5" }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>;
}
function IconArea({ className = "w-3.5 h-3.5" }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>;
}
function IconBed({ className = "w-3.5 h-3.5" }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/></svg>;
}
function IconBath({ className = "w-3.5 h-3.5" }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" x2="8" y1="5" y2="7"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="7" x2="7" y1="19" y2="21"/><line x1="17" x2="17" y1="19" y2="21"/></svg>;
}
function IconCar({ className = "w-3.5 h-3.5" }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>;
}

const selectClass = "bg-[#070d1a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-400 outline-none focus:border-emerald-500 cursor-pointer";

export default function ImoveisAluguel() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [tipo, setTipo] = useState("");
  const [bairro, setBairro] = useState("");
  const [quartos, setQuartos] = useState("");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [comodidades, setComodidades] = useState([]);
  const [mostrarComod, setMostrarComod] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/imoveis/lista/`)
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  let imoveis = data.filter(im => im.ativo !== false && im.finalidade === "Aluguel");
  if (tipo) imoveis = imoveis.filter(im => im.tipo_imovel === tipo);
  if (bairro) imoveis = imoveis.filter(im => im.bairro?.toLowerCase().includes(bairro.toLowerCase()));
  if (quartos) imoveis = imoveis.filter(im => Number(im.quartos) >= Number(quartos));
  if (precoMin) imoveis = imoveis.filter(im => Number(im.preco) >= Number(precoMin));
  if (precoMax) imoveis = imoveis.filter(im => Number(im.preco) <= Number(precoMax));
  if (comodidades.length > 0) {
    imoveis = imoveis.filter(im => {
      if (!im.comodidades_condominio) return false;
      const imComod = im.comodidades_condominio.split(",").map(s => s.trim().toLowerCase());
      return comodidades.every(c => imComod.includes(c.trim().toLowerCase()));
    });
  }

  const temFiltro = tipo || bairro || quartos || precoMin || precoMax || comodidades.length > 0;

  return (
    <div className="min-h-screen bg-[#070d1a] text-white">

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#070d1a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo_nome.png" alt="Nexus Habitar" width={120} height={36} className="h-9 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/imoveis/venda" className="text-slate-400 hover:text-white text-xs font-medium transition-colors hidden md:block">Venda</Link>
            <Link href="/imoveis/todos" className="text-slate-400 hover:text-white text-xs font-medium transition-colors hidden md:block">Todos</Link>
            <button onClick={() => router.back()} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-medium border border-white/10 rounded-lg px-3 py-1.5 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              Voltar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Cabeçalho */}
        <div className="mb-6">
          <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-1">Disponíveis para locação</p>
          <h1 className="text-3xl font-extrabold text-white">Imóveis para Aluguel</h1>
          {!carregando && (
            <p className="text-slate-500 text-sm mt-1">
              {imoveis.length} imóvel{imoveis.length !== 1 ? "is" : ""} encontrado{imoveis.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Filtros */}
        <div className="bg-[#0b1525] border border-white/8 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 mb-8">
          {["Apartamento", "Casa", "Sala Comercial", "Terreno"].map(t => (
            <button key={t} type="button" onClick={() => setTipo(tipo === t ? "" : t)}
              className={`text-xs rounded-full px-3 py-1.5 border transition-all ${tipo === t ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-300 font-medium" : "bg-white/4 border-white/8 text-slate-500 hover:text-slate-300"}`}>
              {t}
            </button>
          ))}

          <div className="w-px h-5 bg-white/10 hidden sm:block" />

          <input
            type="text" placeholder="Bairro..." value={bairro} onChange={e => setBairro(e.target.value)}
            className="bg-[#070d1a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-emerald-500 w-32"
          />

          <select value={quartos} onChange={e => setQuartos(e.target.value)} className={selectClass}>
            <option value="">Quartos</option>
            {["1","2","3","4","5"].map(q => <option key={q} value={q}>{q}+</option>)}
          </select>

          <select value={precoMin} onChange={e => setPrecoMin(e.target.value)} className={selectClass}>
            <option value="">Preço mín.</option>
            <option value="1000">R$ 1.000</option>
            <option value="2000">R$ 2.000</option>
            <option value="3000">R$ 3.000</option>
            <option value="5000">R$ 5.000</option>
            <option value="10000">R$ 10.000</option>
          </select>

          <select value={precoMax} onChange={e => setPrecoMax(e.target.value)} className={selectClass}>
            <option value="">Preço máx.</option>
            <option value="2000">Até R$ 2.000</option>
            <option value="5000">Até R$ 5.000</option>
            <option value="10000">Até R$ 10.000</option>
            <option value="20000">Até R$ 20.000</option>
          </select>

          {/* Comodidades */}
          <div className="relative">
            <button type="button" onClick={() => setMostrarComod(v => !v)}
              className={`flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 border transition-all ${comodidades.length > 0 ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-300" : "bg-[#070d1a] border-white/10 text-slate-400 hover:text-slate-300"}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Comodidades {comodidades.length > 0 && `(${comodidades.length})`}
            </button>
            {mostrarComod && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-[#0e1829] border border-white/10 rounded-xl p-4 shadow-2xl w-72">
                <div className="flex justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-300">Comodidades</p>
                  {comodidades.length > 0 && <button type="button" onClick={() => setComodidades([])} className="text-[10px] text-slate-500 hover:text-red-400">Limpar</button>}
                </div>
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                  {LISTA_COMODIDADES.map(c => {
                    const on = comodidades.includes(c);
                    return (
                      <button key={c} type="button" onClick={() => setComodidades(p => on ? p.filter(x => x !== c) : [...p, c])}
                        className={`text-[10px] text-left px-2.5 py-1.5 rounded-lg border transition-all ${on ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-300 font-medium" : "bg-white/4 border-white/8 text-slate-500 hover:text-slate-300"}`}>
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {temFiltro && (
            <button type="button" onClick={() => { setTipo(""); setBairro(""); setQuartos(""); setPrecoMin(""); setPrecoMax(""); setComodidades([]); }}
              className="text-[10px] text-slate-500 hover:text-red-400 transition-colors ml-auto">
              Limpar filtros
            </button>
          )}
        </div>

        {/* Grid */}
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
        ) : imoveis.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-slate-500 text-sm">Nenhum imóvel para aluguel encontrado com os filtros selecionados.</p>
            {temFiltro && (
              <button onClick={() => { setTipo(""); setBairro(""); setQuartos(""); setPrecoMin(""); setPrecoMax(""); setComodidades([]); }}
                className="mt-4 text-emerald-400 hover:text-emerald-300 text-xs underline">
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {imoveis.map(im => (
              <Link key={im.id} href={`/imoveis/${im.id}`} className="group block">
                <article className="h-full bg-[#0e1829] border border-white/8 hover:border-emerald-500/40 rounded-xl overflow-hidden transition-all duration-300">
                  <div className="relative h-44 bg-[#0a1628] overflow-hidden">
                    {im.capa ? (
                      <Image src={im.capa} alt={im.titulo} fill style={{ objectFit: "cover" }} className="group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.4}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0L22.75 12M4.5 9.75v10.125A1.125 1.125 0 005.625 21h3.75A1.125 1.125 0 0010.5 19.875V15a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v4.875A1.125 1.125 0 0014.625 21h3.75A1.125 1.125 0 0019.5 19.875V9.75"/></svg>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold uppercase">{im.tipo_imovel}</span>
                      <span className="px-2 py-0.5 rounded-full text-white text-[10px] font-bold uppercase bg-emerald-600/80">Aluguel</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/55 text-slate-400 text-[9px] px-2 py-0.5 rounded-full">{(im.id % 17) + 5} viram hoje</div>
                  </div>
                  <div className="p-3">
                    <p className="text-emerald-400 font-extrabold text-xl mb-1">{formatarPreco(im.preco)}</p>
                    <h3 className="text-slate-200 font-bold text-sm mb-2 line-clamp-1">{im.titulo}</h3>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-3">
                      <IconMapPin /><span className="truncate">{im.bairro}, {im.cidade}, PA</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/8 pt-3">
                      {im.area_util && <div className="flex flex-col items-center gap-1"><IconArea className="w-3.5 h-3.5 text-slate-600" /><span className="text-[10px] text-slate-400">{im.area_util} m²</span></div>}
                      {im.quartos && <div className="flex flex-col items-center gap-1"><IconBed className="w-3.5 h-3.5 text-slate-600" /><span className="text-[10px] text-slate-400">{im.quartos} Dorm.</span></div>}
                      {im.banheiros && <div className="flex flex-col items-center gap-1"><IconBath className="w-3.5 h-3.5 text-slate-600" /><span className="text-[10px] text-slate-400">{im.banheiros} Ban.</span></div>}
                      {im.vagas && <div className="flex flex-col items-center gap-1"><IconCar className="w-3.5 h-3.5 text-slate-600" /><span className="text-[10px] text-slate-400">{im.vagas} Vag.</span></div>}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-white/8 mt-10">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Image src="/logo_nome.png" alt="Nexus Habitar" width={80} height={24} className="h-6 w-auto opacity-50" />
          <p className="text-slate-600 text-xs">© {new Date().getFullYear()} Nexus Habitar</p>
          <Link href="/" className="text-slate-500 hover:text-emerald-400 text-xs">← Home</Link>
        </div>
      </footer>
    </div>
  );
}
