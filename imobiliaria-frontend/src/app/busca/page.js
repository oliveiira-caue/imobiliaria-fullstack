"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin } from "@vis.gl/react-google-maps";

const API       = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const MAPS_KEY  = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAPS_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

const BELEM = { lat: -1.455, lng: -48.480 };

/* ─── Ícones ────────────────────────────────────────────────────────────── */
const IconHome = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0L22.75 12M4.5 9.75v10.125A1.125 1.125 0 005.625 21h3.75A1.125 1.125 0 0010.5 19.875V15a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v4.875A1.125 1.125 0 0014.625 21h3.75A1.125 1.125 0 0019.5 19.875V9.75" />
  </svg>
);

const IconMapPin = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const IconList = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const IconFunnel = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
  </svg>
);

const IconArrowLeft = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const IconX = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* ─── Utilitários ────────────────────────────────────────────────────────── */
function formatarPreco(valor) {
  if (!valor) return "Sob consulta";
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function matchMinimo(valorParam, campoImovel) {
  if (!valorParam) return true;
  const num = parseInt(valorParam);
  if (isNaN(num)) return true;
  const imNum = Number(campoImovel) || 0;
  return imNum >= num;
}

/* ─── Card de imóvel ────────────────────────────────────────────────────── */
function CardImovel({ imovel, destacado, onClick }) {
  return (
    <Link href={`/imoveis/${imovel.id}`} className="block group">
      <article
        onClick={onClick}
        className={`cursor-pointer bg-white border rounded-xl overflow-hidden
          hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100
          transition-all duration-300
          ${destacado ? "border-blue-500 shadow-lg shadow-blue-100" : "border-slate-200"}`}
      >
        <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
          {imovel.capa ? (
            <img
            src={imovel.capa}
            alt={imovel.titulo}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 to-transparent" />
              <IconHome className="absolute inset-0 m-auto w-10 h-10 text-slate-300" />
            </>
          )}
          <div className="absolute top-2 left-2 flex gap-1">
            <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-700 text-[9px] font-semibold">
              {imovel.tipo_imovel || "Imóvel"}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-white text-[9px] font-bold ${imovel.finalidade === "Aluguel" ? "bg-emerald-600/80" : "bg-blue-600/80"}`}>
              {imovel.finalidade}
            </span>
          </div>
          {imovel.latitude && imovel.longitude && (
            <span className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-600/80 text-white text-[8px] font-bold">
              <IconMapPin className="w-2 h-2" /> GPS
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-slate-800 font-bold text-xs mb-0.5 group-hover:text-blue-600 transition-colors line-clamp-1">
            {imovel.titulo}
          </h3>
          <p className="text-slate-500 text-[9px] flex items-center gap-1 mb-1.5">
            <IconMapPin className="w-2.5 h-2.5 text-slate-500" />{imovel.bairro || "—"}
          </p>
          <p className="text-blue-600 font-extrabold text-sm">{formatarPreco(imovel.preco)}</p>
        </div>
      </article>
    </Link>
  );
}

/* ─── Mapa ──────────────────────────────────────────────────────────────── */
function MapaGoogle({ imoveis }) {
  const [marcadorAberto, setMarcadorAberto] = useState(null);

  const imoveisComGps = imoveis.filter(im => {
    const lat = Number(im.latitude);
    const lng = Number(im.longitude);
    return im.latitude != null && im.longitude != null &&
      im.latitude !== "" && im.longitude !== "" &&
      !isNaN(lat) && !isNaN(lng) &&
      lat !== 0 && lng !== 0;
  });

  const centro = imoveisComGps.length > 0
    ? {
        lat: imoveisComGps.reduce((s, im) => s + parseFloat(im.latitude), 0) / imoveisComGps.length,
        lng: imoveisComGps.reduce((s, im) => s + parseFloat(im.longitude), 0) / imoveisComGps.length,
      }
    : BELEM;

  return (
    <div className="w-full h-[480px] rounded-2xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/60 relative">
      <Map
        mapId={MAPS_MAP_ID}
        defaultCenter={centro}
        defaultZoom={imoveisComGps.length > 0 ? 13 : 12}
        disableDefaultUI={false}
        streetViewControl={false}
        gestureHandling="greedy"
        style={{ width: "100%", height: "100%" }}
        onClick={() => setMarcadorAberto(null)}
      >
        {imoveisComGps.map((im, idx) => {
          const pos = { lat: parseFloat(im.latitude), lng: parseFloat(im.longitude) };
          const aberto = marcadorAberto === (im.id ?? idx);
          return (
            <AdvancedMarker
              key={im.id ?? idx}
              position={pos}
              title={im.titulo}
              onClick={() => setMarcadorAberto(aberto ? null : (im.id ?? idx))}
            >
              <Pin
                background={aberto ? "#dc2626" : "#ef4444"}
                borderColor={aberto ? "#991b1b" : "#dc2626"}
                glyphColor="#ffffff"
                scale={aberto ? 1.3 : 1}
              />
              {aberto && (
                <InfoWindow position={pos} onCloseClick={() => setMarcadorAberto(null)} headerDisabled>
                  <div style={{ background: "#0F172A", border: "1px solid #1e293b", borderRadius: "12px", padding: "12px", minWidth: "200px", color: "white", fontFamily: "sans-serif" }}>
                    {im.capa && (
                      <img src={im.capa} alt={im.titulo} style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} />
                    )}
                    <p style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>{im.tipo_imovel}</p>
                    <p style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "4px", color: "white" }}>{im.titulo}</p>
                    <p style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "6px" }}>📍 {im.bairro}</p>
                    <p style={{ fontSize: "14px", color: "#60a5fa", fontWeight: "800" }}>{formatarPreco(im.preco)}</p>
                  </div>
                </InfoWindow>
              )}
            </AdvancedMarker>
          );
        })}
      </Map>
      {imoveisComGps.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 gap-3">
          <IconMapPin className="w-10 h-10 text-slate-300" />
          <p className="text-slate-500 text-sm font-semibold">Nenhum imóvel com coordenadas GPS</p>
          <p className="text-slate-400 text-xs max-w-xs text-center">
            Cadastre latitude e longitude no painel admin para ver os pins no mapa.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Loading ───────────────────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-slate-500 text-sm font-medium">Buscando imóveis...</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   WRAPPER — obrigatório para useSearchParams no App Router
════════════════════════════════════════════════════════════════════════════ */
export default function BuscaPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <BuscaConteudo />
    </Suspense>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   CONTEÚDO PRINCIPAL
════════════════════════════════════════════════════════════════════════════ */
function BuscaConteudo() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [imoveis,      setImoveis]      = useState([]);
  const [carregando,   setCarregando]   = useState(true);
  const [viewMode,     setViewMode]     = useState("lista");
  const [cardDestacado, setCardDestacado] = useState(null);
  const [mapaCarregado, setMapaCarregado] = useState(false);
  const [etiquetas,    setEtiquetas]    = useState({});

  useEffect(() => {
    buscar();
  }, [searchParams]);

  async function buscar() {
    setCarregando(true);
    try {
      const res  = await fetch(`${API}/api/imoveis/lista/`);
      const todos = await res.json();

      const finalidade = searchParams.get("finalidade");
      const tiposStr   = searchParams.getAll("tipo");
      const tipos      = tiposStr.length > 0 ? tiposStr : [];
      const precoMin   = searchParams.get("preco_min");
      const precoMax   = searchParams.get("preco_max");
      const areaMin    = searchParams.get("area_min");
      const areaMax    = searchParams.get("area_max");
      const quartosP   = searchParams.get("quartos");
      const suitesP    = searchParams.get("suites");
      const banheirosP = searchParams.get("banheiros");
      const vagasP     = searchParams.get("vagas");
      const termo      = searchParams.get("termo")?.toLowerCase();

      const filtrados = todos.filter(im => {
        if (im.ativo === false) return false;
        if (finalidade && im.finalidade !== finalidade) return false;
        if (tipos.length > 0 && !tipos.includes(im.tipo_imovel)) return false;
        if (precoMin && Number(im.preco) < Number(precoMin)) return false;
        if (precoMax && Number(im.preco) > Number(precoMax)) return false;
        if (areaMin  && Number(im.area_util) < Number(areaMin)) return false;
        if (areaMax  && Number(im.area_util) > Number(areaMax)) return false;
        if (!matchMinimo(quartosP,   im.quartos))   return false;
        if (!matchMinimo(suitesP,    im.suites))    return false;
        if (!matchMinimo(banheirosP, im.banheiros)) return false;
        if (!matchMinimo(vagasP,     im.vagas))     return false;
        if (termo) {
          const texto = `${im.titulo} ${im.bairro} ${im.cidade} ${im.tipo_imovel}`.toLowerCase();
          if (!texto.includes(termo)) return false;
        }
        return true;
      });

      const tags = {};
      if (finalidade)     tags.Finalidade         = finalidade;
      if (tipos.length)   tags.Tipo               = tipos.join(", ");
      if (precoMin)       tags["Preço mín."]       = `R$ ${Number(precoMin).toLocaleString("pt-BR")}`;
      if (precoMax)       tags["Preço máx."]       = `R$ ${Number(precoMax).toLocaleString("pt-BR")}`;
      if (areaMin)        tags["Área mín."]         = `${areaMin} m²`;
      if (areaMax)        tags["Área máx."]         = `${areaMax} m²`;
      if (quartosP)       tags.Quartos             = quartosP;
      if (suitesP)        tags.Suítes              = suitesP;
      if (banheirosP)     tags.Banheiros           = banheirosP;
      if (vagasP)         tags.Vagas               = vagasP;
      if (termo)          tags.Busca               = termo;

      setImoveis(filtrados);
      setEtiquetas(tags);
    } catch {
      setImoveis([]);
      setEtiquetas({});
    } finally {
      setCarregando(false);
    }
  }

  if (carregando) return <LoadingScreen />;

  const etiquetasAtivas  = Object.entries(etiquetas);
  const temFiltros       = etiquetasAtivas.length > 0;

  return (
    <APIProvider apiKey={MAPS_KEY ?? ""}>
      <div className="min-h-screen bg-white text-slate-800">

        {/* ─── HEADER ─────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
            <Link href="/" className="flex-shrink-0">
              <img src="/logo_nome.png" alt="Nexus Habitar" className="h-8 w-auto object-contain opacity-90" />
            </Link>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-semibold transition-colors"
            >
              <IconArrowLeft className="w-3.5 h-3.5" />
              Nova busca
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ─── CABEÇALHO DOS RESULTADOS ─────────────────────────────── */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <IconFunnel className="w-4 h-4 text-blue-500" />
                <p className="text-blue-500 text-xs font-semibold tracking-widest uppercase">
                  {temFiltros ? "Resultados Filtrados" : "Todos os Imóveis"}
                </p>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-800">
                {imoveis.length > 0
                  ? `${imoveis.length} ${imoveis.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}`
                  : "Nenhum imóvel encontrado"}
              </h1>
              {!temFiltros && (
                <p className="text-slate-500 text-xs mt-1">Exibindo todos os imóveis disponíveis</p>
              )}
            </div>

            {/* Toggle Lista / Mapa */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5 gap-0.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode("lista")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                  ${viewMode === "lista" ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "text-slate-500 hover:text-slate-700"}`}
              >
                <IconList className="w-3.5 h-3.5" /> Lista
              </button>
              <button
                type="button"
                onClick={() => { setViewMode("mapa"); setMapaCarregado(true); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                  ${viewMode === "mapa" ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "text-slate-500 hover:text-slate-700"}`}
              >
                <IconMapPin className="w-3.5 h-3.5" /> Mapa
              </button>
            </div>
          </div>

          {/* ─── ETIQUETAS DE FILTROS ATIVOS ──────────────────────────── */}
          {temFiltros && (
            <div className="mb-6 flex flex-wrap gap-2 items-center">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Filtros:</span>
              {etiquetasAtivas.map(([chave, valor]) => (
                <span key={chave}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-semibold">
                  <span className="text-blue-400">{chave}:</span>{valor}
                </span>
              ))}
              <button
                type="button"
                onClick={() => router.push("/busca")}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-500 text-[10px] font-semibold hover:bg-slate-200 transition-colors"
              >
                <IconX /> Limpar filtros
              </button>
            </div>
          )}

          {/* ─── CONTEÚDO ─────────────────────────────────────────────── */}
          {imoveis.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <IconHome className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h2 className="text-slate-800 font-bold text-lg mb-1">Nenhum imóvel encontrado</h2>
                <p className="text-slate-500 text-sm max-w-sm">
                  Nenhum imóvel corresponde a esses critérios. Tente ajustar os filtros.
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="mt-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all flex items-center gap-2"
              >
                <IconArrowLeft className="w-4 h-4" /> Nova busca
              </button>
            </div>
          ) : (
            <>
              <div className={viewMode === "lista" ? "block" : "hidden"}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {imoveis.map((im, idx) => (
                    <CardImovel
                      key={im.id ?? idx}
                      imovel={im}
                      destacado={cardDestacado === (im.id ?? idx)}
                      onClick={() => setCardDestacado(im.id ?? idx)}
                    />
                  ))}
                </div>
              </div>

              {mapaCarregado && (
                <div className={viewMode === "mapa" ? "block" : "hidden"}>
                  <div className="flex flex-col lg:flex-row gap-5">
                    <div className="flex-1 relative">
                      <MapaGoogle imoveis={imoveis} />
                      {imoveis.filter(im => im.latitude && im.longitude).length > 0 && (
                        <div className="mt-2 flex items-center gap-2 px-1">
                          <div className="w-3 h-3 rounded-full bg-blue-600 border border-blue-300" />
                          <span className="text-slate-500 text-[10px]">
                            {(() => {
                              const n = imoveis.filter(im => im.latitude && im.longitude).length;
                              return `${n} ${n === 1 ? "imóvel" : "imóveis"} com GPS`;
                            })()} · Clique nos pins para ver detalhes
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-3 max-h-[480px] overflow-y-auto pr-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                        {imoveis.length} resultado(s)
                      </p>
                      {imoveis.map((im, idx) => (
                        <CardImovel
                          key={im.id ?? idx}
                          imovel={im}
                          destacado={cardDestacado === (im.id ?? idx)}
                          onClick={() => setCardDestacado(im.id ?? idx)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* ─── FOOTER ───────────────────────────────────────────────── */}
        <footer className="border-t border-slate-200 bg-slate-50 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <img src="/logo_nome.png" alt="Nexus Habitar" className="h-6 object-contain opacity-50" />
            <p className="text-slate-400 text-xs">© {new Date().getFullYear()} Nexus Habitar</p>
          </div>
        </footer>
      </div>
    </APIProvider>
  );
}
