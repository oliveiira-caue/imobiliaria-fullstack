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

function IconKey({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
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

/* ════════════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab]   = useState("venda");
  const [busca, setBusca]           = useState("");
  const [viewMode, setViewMode]     = useState("lista");
  const [menuOpen, setMenuOpen]     = useState(false);
  const [buscando, setBuscando]     = useState(false);
  const [erroIA, setErroIA]         = useState("");

  /* Placeholder dinâmico */
  const [sugestaoIdx, setSugestaoIdx]     = useState(0);
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
              {["Comprar", "Alugar", "Contato"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-slate-300 hover:text-white text-xs font-medium tracking-wide transition-colors duration-200 hover:underline underline-offset-4"
                >
                  {item}
                </Link>
              ))}
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
              {["Comprar", "Alugar", "Contato"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-slate-200 hover:text-blue-400 text-sm font-medium transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
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

            {/* Abas — SVG minimalista, sem emoji */}
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => setActiveTab("venda")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200
                  ${activeTab === "venda"
                    ? "text-white border-b-2 border-blue-500 bg-blue-600/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
              >
                <IconHome className={`w-3.5 h-3.5 ${activeTab === "venda" ? "text-blue-400" : "text-slate-500"}`} />
                Venda
              </button>
              <button
                onClick={() => setActiveTab("aluguel")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200
                  ${activeTab === "aluguel"
                    ? "text-white border-b-2 border-blue-500 bg-blue-600/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
              >
                <IconKey className={`w-3.5 h-3.5 ${activeTab === "aluguel" ? "text-blue-400" : "text-slate-500"}`} />
                Aluguel
              </button>
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

      {/* ─── IMÓVEIS EM DESTAQUE ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-blue-500 text-xs font-semibold tracking-widest uppercase mb-1">Curadoria especial</p>
            <h2 className="text-2xl font-extrabold text-white">Imóveis em Destaque</h2>
          </div>
          <Link
            href="#"
            className="hidden sm:inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
          >
            Ver todos
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { tipo: "Apartamento",       local: "Pinheiros, SP",       preco: "R$ 850.000",   quartos: 3, area: "90m²",  tag: "Destaque"  },
            { tipo: "Casa em Condomínio", local: "Alphaville, SP",      preco: "R$ 1.450.000", quartos: 4, area: "280m²", tag: "Novo"      },
            { tipo: "Sala Comercial",    local: "Barra da Tijuca, RJ",  preco: "R$ 620.000",   quartos: 2, area: "85m²",  tag: "Exclusivo" },
          ].map((imovel, idx) => (
            <article
              key={idx}
              className="group bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden
                         hover:border-blue-600/50 hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-44 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent" />
                <IconHome className="w-12 h-12 text-slate-700" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                  {imovel.tag}
                </span>
              </div>
              <div className="p-4">
                <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-0.5">{imovel.tipo}</p>
                <h3 className="text-white font-bold text-base mb-1 group-hover:text-blue-400 transition-colors">{imovel.local}</h3>
                <p className="text-blue-400 font-extrabold text-lg mb-3">{imovel.preco}</p>
                <div className="flex gap-4 text-slate-400 text-xs border-t border-slate-800 pt-3">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    {imovel.quartos} quartos
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    {imovel.area}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

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

    </div>
  );
}