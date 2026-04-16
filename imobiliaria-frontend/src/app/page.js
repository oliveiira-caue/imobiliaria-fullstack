"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ── Sugestões de busca para o placeholder dinâmico ──────────────────────── */
const SUGESTOES = [
  "Ex: Imóvel com 3 suítes no bairro Umarizal...",
  "Ex: Casa com alta metragem quadrada no bairro Nazaré...",
  "Ex: Cobertura de alto padrão em Batista Campos...",
  "Ex: Apartamento com vista para a baía no Marco...",
];

/* ── Ícones SVG minimalistas reutilizáveis ───────────────────────────────── */
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
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function IconList({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
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

function IconBed({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
      <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
      <path d="M12 4v6" />
      <path d="M2 18h20" />
    </svg>
  );
}

function IconBath({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <line x1="10" x2="8" y1="5" y2="7" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <line x1="7" x2="7" y1="19" y2="21" />
      <line x1="17" x2="17" y1="19" y2="21" />
    </svg>
  );
}

function IconCar({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

function IconArea({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" x2="14" y1="3" y2="10" />
      <line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   VITRINE DE DESTAQUES — dinâmica, da API, filtrada por finalidade
═══════════════════════════════════════════════════════════════════════════ */
function VitrineDestaques({ finalidade }) {
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const isAluguel = finalidade === "Aluguel";
  const accentText = isAluguel ? "text-emerald-500" : "text-blue-500";
  const accentHover = isAluguel ? "hover:border-emerald-600/50 hover:shadow-emerald-900/20" : "hover:border-blue-600/50 hover:shadow-blue-900/20";
  const accentLink = isAluguel ? "text-emerald-400 hover:text-emerald-300" : "text-blue-400 hover:text-blue-300";
  const badgeColor = isAluguel ? "bg-emerald-600/80" : "bg-blue-600/80";
  const subtitulo = isAluguel ? "Disponíveis para locação" : "Disponíveis para venda";
  const msgVazia = isAluguel ? "Nenhum imóvel para aluguel cadastrado ainda." : "Nenhum imóvel à venda cadastrado ainda.";

  useEffect(() => {
    fetch("http://localhost:8000/api/imoveis/lista/")
      .then(r => r.json())
      .then(data => setImoveis(
        data.filter(im => im.ativo !== false && im.finalidade === finalidade).slice(0, 6)
      ))
      .catch(() => { })
      .finally(() => setCarregando(false));
  }, [finalidade]);

  const formatarPreco = (v) =>
    v ? Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }) : "Sob consulta";

  return (
    <section id={isAluguel ? "secao-aluguel" : "secao-venda"} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className={`${accentText} text-xs font-semibold tracking-widest uppercase mb-1`}>{subtitulo}</p>
          <h2 className="text-2xl font-extrabold text-white">Imóveis em Destaque</h2>
        </div>
        <Link
          href="/resultados"
          className={`hidden sm:inline-flex items-center gap-1.5 ${accentLink} text-xs font-medium transition-colors`}
        >
          Ver todos
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {carregando ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden animate-pulse">
              <div className="h-44 bg-slate-800" />
              <div className="p-4 space-y-2">
                <div className="h-2.5 bg-slate-800 rounded w-1/3" />
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-5 bg-slate-800 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : imoveis.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-500 text-sm">
            {msgVazia}
          </div>
        ) : (
          imoveis.map((im) => (
            <Link key={im.id} href={`/imoveis/${im.id}`} className="group block">
              <article className={`h-full bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden ${accentHover} hover:shadow-xl transition-all duration-300`}>
                {/* Foto */}
                <div className="relative h-36 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                  {im.capa ? (
                    <img src={im.capa} alt={im.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent" />
                      <IconHome className="absolute inset-0 m-auto w-12 h-12 text-slate-700" />
                    </>
                  )}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-[#0B1120]/80 backdrop-blur border border-slate-700/60 text-white text-[10px] font-bold uppercase tracking-wide">
                      {im.tipo_imovel}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full backdrop-blur text-white text-[10px] font-bold uppercase tracking-wide ${badgeColor}`}>
                      {im.finalidade}
                    </span>
                  </div>
                </div>
                {/* Dados */}
                <div className="p-3">
                  <p className={`${accentText} font-extrabold text-xl mb-1`}>{formatarPreco(im.preco)}</p>
                  <h3 className={`text-white font-bold text-sm mb-2 group-hover:${isAluguel ? "text-emerald-400" : "text-blue-400"} transition-colors line-clamp-1`}>
                    {im.titulo}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-4">
                    <IconMapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{im.bairro}, {im.cidade}, PA</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-1">
                    <div className="flex flex-col items-center gap-1">
                      <IconArea className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] text-white font-medium">{im.area_util ? `${im.area_util} m²` : "-"}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <IconBed className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] text-white font-medium">{im.quartos ? `${im.quartos} Dorm.` : "-"}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <IconBath className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] text-white font-medium">{im.banheiros ? `${im.banheiros} Ban.` : "-"}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <IconCar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] text-white font-medium">{im.vagas ? `${im.vagas} Vag.` : "-"}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))
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
  const [viewMode, setViewMode] = useState("lista");
  const [menuOpen, setMenuOpen] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [erroIA, setErroIA] = useState("");

  /* Modal — Anuncie seu imóvel */
  const [modalAberto, setModalAberto] = useState(false);
  const [formAnuncio, setFormAnuncio] = useState({ nome: "", telefone: "", email: "", preferencia: "" });
  const [enviandoAnuncio, setEnviandoAnuncio] = useState(false);
  const [statusAnuncio, setStatusAnuncio] = useState(null); // "ok" | "erro"

  const abrirModal = (e) => { e.preventDefault(); setModalAberto(true); setStatusAnuncio(null); };
  const fecharModal = () => { setModalAberto(false); setFormAnuncio({ nome: "", telefone: "", email: "", preferencia: "" }); setStatusAnuncio(null); };

  const enviarAnuncio = async (e) => {
    e.preventDefault();
    setEnviandoAnuncio(true);
    try {
      const res = await fetch("http://localhost:8000/api/leads/", {
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
      if (res.ok) { setStatusAnuncio("ok"); }
      else { setStatusAnuncio("erro"); }
    } catch { setStatusAnuncio("erro"); }
    finally { setEnviandoAnuncio(false); }
  };

  /* Placeholder dinâmico */
  const [sugestaoIdx, setSugestaoIdx] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // fade out → troca → fade in
      setPlaceholderVisible(false);
      setTimeout(() => {
        setSugestaoIdx((prev) => (prev + 1) % SUGESTOES.length);
        setPlaceholderVisible(true);
      }, 400); // duração do fade-out antes de trocar o texto
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const textoBusca = busca.trim();
    if (!textoBusca) { setErroIA("Digite o que você procura antes de buscar."); return; }
    setErroIA("");
    setBuscando(true);
    try {
      const res = await fetch("http://localhost:8000/api/busca-ia/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ busca: textoBusca }),
      });
      if (!res.ok) throw new Error(await res.text());
      const dados = await res.json();
      // Persiste resultado + preferência de visualização na sessão
      sessionStorage.setItem(
        "nexus_resultados_ia",
        JSON.stringify({ ...dados, viewMode, termoBusca: textoBusca })
      );
      router.push("/resultados");
    } catch (err) {
      console.error(err);
      setErroIA("Não foi possível contactar a IA. Tente novamente.");
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">

      {/* ─── HEADER ──────────────────────────────────────────────────────── */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <Link href="/" className="flex-shrink-0">
              <img
                src="/logo_nome.png"
                alt="Nexus Habitar"
                className="h-14 md:h-20 w-auto object-contain"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="#"
                className="text-slate-300 hover:text-white text-xs font-medium tracking-wide transition-colors duration-200 hover:underline underline-offset-4"
              >
                Contato
              </Link>
              <button
                onClick={abrirModal}
                className="px-4 py-1.5 rounded-lg border border-blue-600 text-blue-500 hover:bg-blue-600/25 hover:border-blue-500 hover:text-blue-400 text-xs font-semibold tracking-wide transition-colors duration-150"
              >
                Anuncie seu imóvel
              </button>
            </nav>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menu"
            >
              {menuOpen ? <IconClose /> : <IconHamburger />}
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden bg-[#0F172A]/95 backdrop-blur-md rounded-xl mb-3 p-5 border border-slate-800 flex flex-col gap-3">
              <Link
                href="#"
                className="text-slate-200 hover:text-blue-400 text-sm font-medium transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Contato
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* ─── HERO SECTION ────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/foto_capa.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-[#0B1120]" />

        {/* Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        {/* Conteúdo central */}
        <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center gap-6 pt-20">

          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Busca Inteligente com IA
          </span>

          {/* Título */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg">
            Sua jornada para o{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              imóvel perfeito
            </span>{" "}
            começa aqui.
          </h1>

          <p className="text-slate-300 text-sm md:text-base font-light max-w-lg">
            Descreva o que você procura e nossa IA encontra as melhores opções para você.
          </p>

          {/* ─── BUSCADOR ─────────────────────────────────────────────── */}
          <div className="w-full bg-[#0F172A]/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">

            {/* Cabeçalho do buscador */}
            <div className="flex justify-center border-b border-slate-800 bg-blue-600/10">
              <span className="text-white text-xs font-semibold tracking-wide py-2.5 border-b-2 border-blue-500">
                Encontre o imóvel feito para você
              </span>
            </div>

            {/* Formulário IA */}
            <form onSubmit={handleSearch} className="p-3 sm:p-4 flex flex-col gap-3">

              {/* Input com placeholder dinâmico animado */}
              <div className="relative">
                {/* Ícone de IA */}
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <IconSparkles className="w-4 h-4" />
                </span>

                {/* Placeholder animado — visível apenas quando o input está vazio */}
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
                  id="busca-ia"
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder=""
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#0B1120] border border-slate-700 text-slate-200
                             text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Linha inferior: toggle + botão */}
              <div className="flex items-center justify-between gap-3">

                {/* Toggle Mapa / Lista — sem emoji */}
                <div className="flex items-center bg-[#0B1120] border border-slate-700 rounded-xl p-0.5 gap-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode("mapa")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                      ${viewMode === "mapa"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                        : "text-slate-400 hover:text-slate-200"
                      }`}
                  >
                    <IconMapPin className={`w-3.5 h-3.5 ${viewMode === "mapa" ? "text-white" : "text-slate-500"}`} />
                    Ver no Mapa
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("lista")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                      ${viewMode === "lista"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                        : "text-slate-400 hover:text-slate-200"
                      }`}
                  >
                    <IconList className={`w-3.5 h-3.5 ${viewMode === "lista" ? "text-white" : "text-slate-500"}`} />
                    Ver Lista
                  </button>
                </div>

                {/* Botão Buscar com IA — único ponto de cor vibrante */}
                <button
                  type="submit"
                  disabled={buscando}
                  className="h-9 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95
                             text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-900/40
                             transition-all duration-200 flex items-center gap-2 whitespace-nowrap
                             disabled:opacity-70 disabled:cursor-not-allowed"
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
              </div>
              {erroIA && (
                <p className="text-red-400 text-xs flex items-center gap-1.5 px-1">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  {erroIA}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Scroll indicator — isolado, sem sobreposição */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 opacity-40 pointer-events-none">
          <span className="text-slate-400 text-[10px] tracking-widest uppercase">Explorar</span>
          <svg className="w-4 h-4 text-slate-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ─── DIVISOR INTRODUTÓRIO ───────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-blue-600/40" />
          <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase whitespace-nowrap">
            Conheça Nossa Curadoria Especial
          </span>
          <div className="flex-1 h-px bg-blue-600/40" />
        </div>
      </div>

      {/* ─── IMÓVEIS À VENDA ────────────────────────────────────────────── */}
      <VitrineDestaques finalidade="Venda" />

      {/* ─── SEPARADOR ENTRE SEÇÕES ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-slate-800" />
      </div>

      {/* ─── IMÓVEIS PARA ALUGUEL ───────────────────────────────────────── */}
      <VitrineDestaques finalidade="Aluguel" />


      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 bg-[#0F172A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <img src="/logo_nome.png" alt="Nexus Habitar" className="h-6 object-contain opacity-60" />
          <p className="text-slate-500 text-xs text-center">
            © {new Date().getFullYear()} Nexus Habitar. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-slate-500 hover:text-blue-400 text-xs transition-colors">Privacidade</Link>
            <Link href="#" className="text-slate-500 hover:text-blue-400 text-xs transition-colors">Termos</Link>
          </div>
        </div>
      </footer>

      {/* ─── MODAL — ANUNCIE SEU IMÓVEL ─────────────────────────────────── */}
      {modalAberto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) fecharModal(); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Painel */}
          <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">

            {/* Cabeçalho */}
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

            {/* Conteúdo */}
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

                {/* Nome */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nome completo</label>
                  <input
                    type="text" required
                    value={formAnuncio.nome}
                    onChange={(e) => setFormAnuncio(p => ({ ...p, nome: e.target.value }))}
                    placeholder="Seu nome"
                    className="w-full bg-[#080E1A] border border-slate-800 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Telefone / WhatsApp</label>
                  <input
                    type="tel" required
                    value={formAnuncio.telefone}
                    onChange={(e) => setFormAnuncio(p => ({ ...p, telefone: e.target.value }))}
                    placeholder="(91) 99999-9999"
                    className="w-full bg-[#080E1A] border border-slate-800 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                {/* E-mail */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">E-mail</label>
                  <input
                    type="email"
                    value={formAnuncio.email}
                    onChange={(e) => setFormAnuncio(p => ({ ...p, email: e.target.value }))}
                    placeholder="seu@email.com"
                    className="w-full bg-[#080E1A] border border-slate-800 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                {/* Preferência */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tipo de anúncio</label>
                  <div className="flex gap-2">
                    {["Venda", "Aluguel"].map((op) => (
                      <button
                        key={op} type="button"
                        onClick={() => setFormAnuncio(p => ({ ...p, preferencia: op }))}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all duration-150
                          ${formAnuncio.preferencia === op
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

                <button
                  type="submit" disabled={enviandoAnuncio}
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