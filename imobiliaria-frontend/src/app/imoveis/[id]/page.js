"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAPS_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

/* ─── Ícones ────────────────────────────────────────────────────────────── */
const IconArrowLeft = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);
const IconMapPin = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);
const IconBed = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
    <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
    <path d="M12 4v6" /><path d="M2 18h20" />
  </svg>
);
const IconBedDouble = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
    <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
    <path d="M12 4v6" /><path d="M2 18h20" />
    <circle cx="12" cy="15" r="1" fill="currentColor" />
  </svg>
);
const IconBath = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
    <line x1="10" x2="8" y1="5" y2="7" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <line x1="7" x2="7" y1="19" y2="21" />
    <line x1="17" x2="17" y1="19" y2="21" />
  </svg>
);
const IconCar = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
  </svg>
);
const IconArea = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
    <line x1="21" x2="14" y1="3" y2="10" /><line x1="3" x2="10" y1="21" y2="14" />
  </svg>
);
const IconCheck    = () => <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const IconSend     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>;
const IconCalendar = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>;
const IconClose    = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

/* ─── Utilitários ────────────────────────────────────────────────────────── */
const formatarPreco = (v) =>
  v ? Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }) : "Sob consulta";

const inputClass =
  "w-full bg-[#080E1A] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 " +
  "focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all";

const labelClass = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5";

/* ─── Skeleton ──────────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="min-h-screen bg-[#070d1a] animate-pulse">
      <div className="h-14 bg-white/5 border-b border-white/8" />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="h-72 bg-white/5 rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-4 bg-white/5 rounded col-span-2" />
          <div className="h-4 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PÁGINA DE DETALHES DO IMÓVEL
════════════════════════════════════════════════════════════════════════════ */
export default function DetalheImovelPage() {
  const { id } = useParams();
  const router  = useRouter();

  const [imovel, setImovel]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [fotoIdx, setFotoIdx]       = useState(0);
  const [notFound, setNotFound]     = useState(false);
  const [lightboxAberto, setLightboxAberto] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [lead, setLead] = useState({
    nome: "", email: "", telefone: "", mensagem: "",
    data_visita: "", hora_visita: "", meio_contato: "",
  });
  const [enviando, setEnviando]   = useState(false);
  const [leadOk, setLeadOk]       = useState(false);
  const [erroLead, setErroLead]   = useState("");

  const fecharModal = () => {
    setModalAberto(false);
    if (!leadOk) setErroLead("");
  };

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/api/imoveis/${id}/`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => setImovel(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLead = async (e) => {
    e.preventDefault();
    setErroLead("");
    if (!lead.nome.trim() || !lead.telefone.trim()) {
      setErroLead("Nome e telefone são obrigatórios.");
      return;
    }
    const melhor_horario = lead.data_visita
      ? `${lead.data_visita.split("-").reverse().join("/")}${lead.hora_visita ? ` às ${lead.hora_visita}` : ""}`
      : "";
    setEnviando(true);
    try {
      const res = await fetch(`${API}/api/leads/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, melhor_horario, imovel_id: id }),
      });
      if (res.ok) {
        setLeadOk(true);
        setLead({ nome: "", email: "", telefone: "", mensagem: "", data_visita: "", hora_visita: "", meio_contato: "" });
      } else {
        const d = await res.json();
        setErroLead(d.erro || "Erro ao enviar. Tente novamente.");
      }
    } catch {
      setErroLead("Falha de conexão. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <Skeleton />;
  if (notFound) return (
    <div className="min-h-screen bg-[#070d1a] flex flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-5xl font-black text-slate-600">404</p>
      <h1 className="text-white font-bold text-xl">Imóvel não encontrado</h1>
      <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm font-medium underline">← Voltar para a Home</Link>
    </div>
  );

  const todasFotos = [imovel.capa, ...(imovel.fotos_galeria?.map(f => f.url) ?? [])].filter(Boolean);
  const comodidades = imovel.comodidades_condominio
    ? imovel.comodidades_condominio.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  const telWhatsApp = "5591999999999";
  const msgWhatsApp = encodeURIComponent(`Olá! Vi o imóvel "${imovel.titulo}" no site da Nexus Habitar e gostaria de mais informações.`);
  const hrefWhatsApp = `https://wa.me/${telWhatsApp}?text=${msgWhatsApp}`;

  return (
    <div className="min-h-screen bg-[#070d1a] text-white">

      {/* ─── HEADER ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#070d1a]/95 backdrop-blur-xl border-b border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo_nome.png" alt="Nexus Habitar" width={160} height={50} className="h-8 w-auto object-contain opacity-90" />
          </Link>
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold transition-colors">
            <IconArrowLeft /> Voltar
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── COLUNA PRINCIPAL ──────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Galeria */}
            {todasFotos.length > 0 ? (
              <div className="space-y-3">
                <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
                  <img
                    src={todasFotos[fotoIdx]}
                    alt={imovel.titulo}
                    decoding="async"
                    priority="true"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setLightboxAberto(true)}
                  />
                  <span className="absolute bottom-3 right-3 bg-[#0B1120]/80 backdrop-blur text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-full pointer-events-none">
                    {fotoIdx + 1} / {todasFotos.length}
                  </span>

                  {/* Seta anterior */}
                  {todasFotos.length > 1 && fotoIdx > 0 && (
                    <button
                      onClick={() => setFotoIdx(i => i - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                  )}
                  {/* Seta próxima */}
                  {todasFotos.length > 1 && fotoIdx < todasFotos.length - 1 && (
                    <button
                      onClick={() => setFotoIdx(i => i + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  )}
                </div>
                {todasFotos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {todasFotos.map((foto, i) => (
                      <button
                        key={i}
                        onClick={() => setFotoIdx(i)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                          i === fotoIdx ? "border-blue-500 scale-105" : "border-slate-800 hover:border-slate-600"
                        }`}
                      >
                        <img src={foto} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-72 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-800">
                <p className="text-slate-600 text-sm">Sem fotos disponíveis</p>
              </div>
            )}

            {/* Badge + Título */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  style={{ backgroundColor: '#0B1120', color: '#ffffff' }}
                  className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                >
                  {imovel.tipo_imovel}
                </span>
                <span
                  style={{ backgroundColor: '#1a3a8f', color: '#ffffff' }}
                  className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                >
                  {imovel.finalidade}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2">{imovel.titulo}</h1>
              <p className="text-slate-400 text-sm flex items-center gap-1.5">
                <IconMapPin />
                {[imovel.endereco, imovel.numero, imovel.bairro, imovel.cidade].filter(Boolean).join(", ")}
              </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <IconBed />,       label: "Quartos",   valor: imovel.quartos    },
                { icon: <IconBedDouble />, label: "Suítes",    valor: imovel.suites     },
                { icon: <IconBath />,      label: "Banheiros", valor: imovel.banheiros  },
                { icon: <IconCar />,       label: "Vagas",     valor: imovel.vagas      },
                { icon: <IconArea />, label: "Área", valor: imovel.area_util ? `${imovel.area_util} m²` : "—" },
              ].filter(d => d.valor != null && d.valor !== 0 && d.valor !== "0").map(({ icon, label, valor }) => (
                <div key={label} className="bg-[#0e1829] border border-white/8 rounded-xl p-3 flex items-center gap-2">
                  <span className="text-blue-400">{icon}</span>
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">{label}</p>
                    <p className="text-blue-400 font-extrabold text-sm">{valor}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Descrição */}
            {imovel.descricao && (
              <div className="bg-[#0e1829] border border-white/8 rounded-2xl p-5">
                <h2 className="text-slate-400 font-bold text-sm mb-3 uppercase tracking-widest text-[10px]">Descrição</h2>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{imovel.descricao}</p>
              </div>
            )}

            {/* Comodidades */}
            {comodidades.length > 0 && (
              <div className="bg-[#0e1829] border border-white/8 rounded-2xl p-5">
                <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Comodidades</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {comodidades.map((c) => (
                    <div key={c} className="flex items-center gap-2 text-slate-300 text-xs">
                      <span className="text-blue-400"><IconCheck /></span>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── SIDEBAR DIREITA ───────────────────────────────────────────── */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">

            {/* Preço + botões */}
            <div className="bg-[#0e1829] border border-white/8 rounded-2xl p-5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Valor</p>
              <p className="text-3xl font-black text-blue-400 mb-1">{formatarPreco(imovel.preco)}</p>
              {imovel.valor_condominio > 0 && (
                <p className="text-slate-500 text-xs">Condomínio: {formatarPreco(imovel.valor_condominio)}/mês</p>
              )}
              {imovel.iptu > 0 && (
                <p className="text-slate-500 text-xs">IPTU: {formatarPreco(imovel.iptu)}/ano</p>
              )}

              <div className="border-t border-white/8 mt-4 pt-4 flex flex-col gap-3">
                {leadOk ? (
                  <div className="flex flex-col items-center gap-3 py-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Visita agendada!</p>
                      <p className="text-slate-400 text-xs mt-0.5">Entraremos em contato para confirmar.</p>
                    </div>
                    <button onClick={() => setLeadOk(false)} className="text-blue-400 hover:text-blue-300 text-xs underline">
                      Reagendar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setModalAberto(true)}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all"
                  >
                    <IconCalendar />
                    Agende sua visita
                  </button>
                )}

                {/* WhatsApp */}
                <a
                  href={hrefWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[.98]"
                  style={{ backgroundColor: '#25D366', boxShadow: '0 0 20px rgba(37,211,102,0.3)' }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Entrar em contato
                </a>
              </div>
            </div>

            {/* Card do mapa */}
            <div className="bg-[#0e1829] border border-white/8 rounded-2xl overflow-hidden">
              <div className="px-4 pt-4 pb-2">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-0.5">Localização</h3>
                <p className="text-slate-500 text-xs">{[imovel.bairro, imovel.cidade, "PA"].filter(Boolean).join(", ")}</p>
              </div>
              <div className="h-44 w-full">
                {imovel.latitude && imovel.longitude ? (
                  <APIProvider apiKey={MAPS_KEY ?? ""}>
                    <Map
                      mapId={MAPS_MAP_ID}
                      defaultCenter={{ lat: parseFloat(imovel.latitude), lng: parseFloat(imovel.longitude) }}
                      defaultZoom={15}
                      disableDefaultUI={true}
                      gestureHandling="none"
                      style={{ width: "100%", height: "100%" }}
                    >
                      <AdvancedMarker position={{ lat: parseFloat(imovel.latitude), lng: parseFloat(imovel.longitude) }} title={imovel.titulo}>
                        <Pin background="#185FA5" borderColor="#0C447C" glyphColor="#ffffff" scale={1.2} />
                      </AdvancedMarker>
                    </Map>
                  </APIProvider>
                ) : (
                  <div className="h-full w-full bg-[#0a1628] flex flex-col items-center justify-center gap-2">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                    </svg>
                    <p className="text-slate-600 text-xs">Localização não disponível</p>
                  </div>
                )}
              </div>
              {[imovel.endereco, imovel.numero].filter(Boolean).length > 0 && (
                <div className="px-4 py-3 border-t border-white/8">
                  <p className="text-slate-400 text-xs">{[imovel.endereco, imovel.numero, imovel.complemento].filter(Boolean).join(", ")}</p>
                </div>
              )}
            </div>

            {/* Card do corretor */}
            <div className="bg-[#0e1829] border border-white/8 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Corretor responsável</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-900/50 border border-blue-700/40 flex items-center justify-center text-sm font-bold text-blue-300 flex-shrink-0">
                  NH
                </div>
                <div>
                  <p className="text-slate-200 font-semibold text-sm">Nexus Habitar</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    CRECI: {imovel.publicado_por_creci || imovel.corretor_creci || "12345-PA"}
                  </p>
                </div>
              </div>
              <Link
                href={`/corretor/${imovel.publicado_por_id || imovel.corretor_id || "1"}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/40 text-xs font-medium transition-all"
              >
                Ver imóveis desse corretor
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ─── LIGHTBOX ────────────────────────────────────────────────────────── */}
      {lightboxAberto && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxAberto(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            onClick={() => setLightboxAberto(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          {todasFotos.length > 1 && fotoIdx > 0 && (
            <button onClick={e => { e.stopPropagation(); setFotoIdx(i => i - 1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          {todasFotos.length > 1 && fotoIdx < todasFotos.length - 1 && (
            <button onClick={e => { e.stopPropagation(); setFotoIdx(i => i + 1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
          <div onClick={e => e.stopPropagation()} className="relative max-w-5xl max-h-[85vh] w-full mx-4">
            <img
              src={todasFotos[fotoIdx]}
              alt={imovel?.titulo}
              className="w-full h-full object-contain rounded-xl"
              style={{ maxHeight: "85vh" }}
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
              {fotoIdx + 1} / {todasFotos.length}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL — AGENDAR VISITA ──────────────────────────────────────────── */}
      {modalAberto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) fecharModal(); }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">

            {/* Cabeçalho */}
            <div className="flex items-start justify-between p-5 border-b border-slate-800">
              <div>
                <h2 className="text-blue-400 font-extrabold text-base leading-tight">Gostou do imóvel? Agende já sua visita com a nossa equipe</h2>
                <p className="text-slate-400 text-xs mt-1">Imóvel de interesse: <span className="text-slate-300">{imovel?.titulo}</span></p>
              </div>
              <button onClick={fecharModal} className="text-slate-500 hover:text-white transition-colors ml-4 mt-0.5 shrink-0">
                <IconClose />
              </button>
            </div>

            {/* Conteúdo */}
            {leadOk ? (
              <div className="p-8 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-base">Visita agendada!</p>
                  <p className="text-slate-400 text-sm mt-1">Em breve nossa equipe entrará em contato para confirmar.</p>
                </div>
                <button onClick={fecharModal} className="mt-2 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors">
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={handleLead} className="p-5 flex flex-col gap-3">

                <div>
                  <label className={labelClass}>Nome *</label>
                  <input required className={inputClass} placeholder="Seu nome completo"
                    value={lead.nome} onChange={e => setLead(p => ({ ...p, nome: e.target.value }))} />
                </div>

                <div>
                  <label className={labelClass}>Telefone / WhatsApp *</label>
                  <input required className={inputClass} placeholder="(91) 99999-9999"
                    value={lead.telefone} onChange={e => setLead(p => ({ ...p, telefone: e.target.value }))} />
                </div>

                <div>
                  <label className={labelClass}>E-mail</label>
                  <input type="email" className={inputClass} placeholder="seu@email.com"
                    value={lead.email} onChange={e => setLead(p => ({ ...p, email: e.target.value }))} />
                </div>

                {/* Data da visita — botões de dia */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Data preferida</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {Array.from({ length: 8 }, (_, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() + i + 1);
                      const iso = d.toISOString().split("T")[0];
                      const label = i === 0 ? "Amanhã" : d.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" });
                      const ativo = lead.data_visita === iso;
                      return (
                        <button key={iso} type="button" onClick={() => setLead(p => ({ ...p, data_visita: iso }))}
                          className={`py-2 px-1 rounded-lg border text-center transition-all ${ativo ? "bg-blue-600/20 border-blue-500/40 text-blue-300 font-medium text-[10px]" : "bg-white/4 border-white/8 text-slate-500 hover:text-slate-300 text-[10px]"}`}>
                          <div className="text-[9px] leading-tight">{label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Horário */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Horário preferido</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {["09:00", "10:30", "14:00", "15:30", "16:00", "17:00", "18:00", "19:00"].map(h => {
                      const ativo = lead.hora_visita === h;
                      return (
                        <button key={h} type="button" onClick={() => setLead(p => ({ ...p, hora_visita: h }))}
                          className={`py-2 rounded-lg border text-[11px] transition-all ${ativo ? "bg-blue-600/20 border-blue-500/40 text-blue-300 font-medium" : "bg-white/4 border-white/8 text-slate-500 hover:text-slate-300"}`}>
                          {h}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Mensagem <span className="text-slate-600 normal-case font-normal">(opcional)</span></label>
                  <textarea rows={2} className={inputClass + " resize-none"} placeholder="Alguma observação para a visita..."
                    value={lead.mensagem} onChange={e => setLead(p => ({ ...p, mensagem: e.target.value }))} />
                </div>

                {erroLead && (
                  <p className="text-red-400 text-xs flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    {erroLead}
                  </p>
                )}

                <button type="submit" disabled={enviando}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                  {enviando ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <><IconSend /> Confirmar agendamento</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 bg-[#070d1a] mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Image src="/logo_nome.png" alt="Nexus Habitar" width={160} height={50} className="h-6 w-auto object-contain opacity-50" />
          <p className="text-slate-600 text-xs">© {new Date().getFullYear()} Nexus Habitar</p>
        </div>
      </footer>
    </div>
  );
}
