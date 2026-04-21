"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Dashboard() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("inicio");
  const [menuAberto, setMenuAberto] = useState(false);
  const [imovelEditando, setImovelEditando] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [toast, setToast] = useState(null);

  const mostrarToast = (mensagem, tipo = "sucesso") => {
    setToast({ mensagem, tipo, saindo: false });
    setTimeout(() => setToast(prev => prev ? { ...prev, saindo: true } : null), 3000);
    setTimeout(() => setToast(null), 3600);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("tokenImobiliaria");
    if (!token) {
      router.push("/admin");
    } else {
      setCarregando(false);
    }
  }, [router]);

  const fazerLogout = () => {
    sessionStorage.removeItem("tokenImobiliaria");
    router.push("/admin");
  };

  const iniciarEdicao = (id) => {
    setImovelEditando(id);
    setAbaAtiva("cadastrar");
  };

  if (carregando) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div data-tema="claro" className="flex h-screen overflow-hidden bg-slate-100 text-slate-700 flex-col md:flex-row font-sans antialiased">

      {/* MOBILE TOPBAR */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0 z-30">
        <h2 className="text-sm font-bold text-blue-500 tracking-[0.2em] uppercase">
          Nexus<span className="text-slate-800"> Admin</span>
        </h2>
        <button
          onClick={() => setMenuAberto(m => !m)}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 active:bg-slate-100 transition-colors"
        >
          {menuAberto ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          )}
        </button>
      </div>

      {/* BACKDROP MOBILE */}
      {menuAberto && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* TOAST */}
      {toast && (
        <div
          style={{ animation: toast.saindo ? "toast-out 0.5s ease-in forwards" : "toast-in 0.4s ease-out forwards" }}
          className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium
          ${toast.tipo === "sucesso"
              ? "bg-emerald-50 border-emerald-300 text-emerald-700"
              : "bg-red-50 border-red-300 text-red-700"}`}>
          {toast.tipo === "sucesso" ? (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          ) : (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 border border-red-500/50">
              <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          )}
          {toast.mensagem}
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`${menuAberto ? "flex" : "hidden"} md:flex fixed md:relative inset-y-0 left-0 z-50 md:z-auto w-72 md:w-52 bg-white md:bg-slate-50 border-r border-slate-200/60 p-5 flex-col shrink-0 shadow-2xl md:shadow-none`}>
        <h2 className="text-sm font-bold text-blue-500 mb-8 tracking-[0.3em] text-center uppercase">
          Nexus<span className="text-slate-800"> Admin</span>
        </h2>

        <nav className="flex-1 space-y-1">
          {[
            { key: "inicio", label: "Visão Geral", icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></> },
            { key: "cadastrar", label: "Cadastrar Imóvel", icon: <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" /> },
            { key: "meus_imoveis", label: "Meus Imóveis", icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></> },
            { key: "leads", label: "Clientes (Leads)", icon: <><rect x="2" y="13" width="4" height="8" rx="1" /><rect x="9" y="9" width="4" height="12" rx="1" /><rect x="16" y="5" width="4" height="16" rx="1" /><polyline points="3 10 8 6 13 9 20 3" strokeLinecap="round" strokeLinejoin="round" /></> },
            { key: "usuarios", label: "Usuários", icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
            { key: "configuracoes", label: "Configurações", icon: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></> },
          ].map(({ key, label, icon }) => {
            const isActive = abaAtiva === key && !(key === "cadastrar" && imovelEditando);
            return (
              <button
                key={key}
                onClick={() => {
                  if (key === "cadastrar") {
                    setImovelEditando(null);
                    setFormKey(k => k + 1);
                  }
                  setAbaAtiva(key);
                  setMenuAberto(false);
                }}
                className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${isActive ? "bg-blue-600/15 text-blue-600 border border-blue-500/20" : "hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-transparent"}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icon}</svg>
                {label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-5 border-t border-slate-200/60">
          <button onClick={fazerLogout} className="text-slate-600 hover:text-red-600 text-xs font-semibold transition-colors flex items-center gap-2 px-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Sair do sistema
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-100">
        <div className="max-w-6xl mx-auto">
          {abaAtiva === "inicio" && <PainelInicio irPara={setAbaAtiva} />}
          {/* Formulário sempre montado — exibido/escondido via CSS para preservar o estado ao trocar de aba */}
          <div className={abaAtiva === "cadastrar" ? "" : "hidden"}>
            {imovelEditando && (
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => { setImovelEditando(null); setAbaAtiva("meus_imoveis"); }}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-xs font-semibold transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Meus Imóveis
                </button>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="text-xs font-semibold text-blue-600">Edição</span>
              </div>
            )}
            <FormularioNovoImovel
              key={formKey}
              imovelId={imovelEditando}
              onToast={mostrarToast}
              onSaved={() => { setImovelEditando(null); setAbaAtiva("meus_imoveis"); }}
            />
          </div>
          {abaAtiva === "meus_imoveis" && <ListaImoveis aoEditar={iniciarEdicao} onToast={mostrarToast} />}
          {abaAtiva === "leads" && <ListaLeads />}
          {abaAtiva === "usuarios" && <GerenciarUsuarios onToast={mostrarToast} onErroAuth={fazerLogout} />}
          {abaAtiva === "configuracoes" && <ConfiguracoesPainel />}
        </div>
      </main>
    </div>
  );
}

// ─── Ícones dos campos de detalhes ─────────────────────────────────────────
const ICONES_CAMPOS = {
  area_util: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
      <line x1="21" x2="14" y1="3" y2="10" /><line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  ),
  quartos: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
      <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
      <path d="M12 4v6" /><path d="M2 18h20" />
    </svg>
  ),
  suites: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
      <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
      <path d="M12 4v6" /><path d="M2 18h20" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
    </svg>
  ),
  banheiros: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <line x1="10" x2="8" y1="5" y2="7" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <line x1="7" x2="7" y1="19" y2="21" />
      <line x1="17" x2="17" y1="19" y2="21" />
    </svg>
  ),
  vagas: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
    </svg>
  ),
};

const LABELS_CAMPOS = {
  area_util: "Área (m²)",
  quartos: "Quartos",
  suites: "Suítes",
  banheiros: "Banheiros",
  vagas: "Vagas",
};

// ─── Formulário ────────────────────────────────────────────────────────────
function FormularioNovoImovel({ imovelId, onToast, onSaved }) {
  const [salvando, setSalvando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(!!imovelId);
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [comodidadesSelecionadas, setComodidadesSelecionadas] = useState([]);

  const [fotoCapa, setFotoCapa] = useState(null);
  const [previaCapa, setPreviaCapa] = useState(null);
  // fotos já salvas no servidor (edit mode) — guardam URL e id
  const [fotosExistentesGaleria, setFotosExistentesGaleria] = useState([]);
  // novos arquivos que o usuário selecionou nesta sessão
  const [arquivosGaleria, setArquivosGaleria] = useState([]);
  const [previasGaleria, setPreviasGaleria] = useState([]);
  const ultimoCepBuscado = useRef("");

  const capaInputRef = useRef(null);
  const galeriaInputRef = useRef(null);
  const formRef = useRef(null);
  const [valores, setValores] = useState({ preco: "R$ 0,00", valor_condominio: "R$ 0,00", iptu: "R$ 0,00" });
  const [erros, setErros] = useState({});
  const [resumoDados, setResumoDados] = useState({});
  const [buscandoCoords, setBuscandoCoords] = useState(false);
  const [erroCoords, setErroCoords] = useState("");

  const LISTA_COMODIDADES = [
    "Piscina", "Academia", "Churrasqueira", "Salão de Festas", "Playground",
    "Brinquedoteca", "Portaria 24h", "Elevador", "Varanda / Sacada",
    "Ar Condicionado", "Mobiliado", "Closet", "Escritório", "Piso Porcelanato",
    "SPA / Sauna", "Quadra Tênis", "Pet Friendly", "Jardim", "Área de Serviço",
    "Cozinha Americana", "Interfone", "Portão Eletrônico", "Sistema de Segurança", "Gerador"
  ];

  const PASSOS = [
    { nome: "Dados Básicos", desc: "Título, tipo e preço" },
    { nome: "Fotos", desc: "Capa e galeria" },
    { nome: "Detalhes", desc: "Área, quartos e mais" },
    { nome: "Localização", desc: "Endereço completo" },
    { nome: "Revisão", desc: "Revise e publique" },
  ];

  const aplicarMascaraDinheiro = (v) => {
    if (!v) return "R$ 0,00";
    let numStr = String(v).replace(/\D/g, "");
    let formatado = (Number(numStr) / 100).toFixed(2).replace(".", ",");
    formatado = formatado.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return `R$ ${formatado}`;
  };

  const formatarDinheiroDoBackend = (valorDecimal) => {
    if (!valorDecimal) return "R$ 0,00";
    const valorCentavos = (Number(valorDecimal) * 100).toFixed(0);
    return aplicarMascaraDinheiro(valorCentavos);
  };

  useEffect(() => {
    if (imovelId) {
      const buscarDadosImovel = async () => {
        try {
          const res = await fetch(`${API}/api/imoveis/${imovelId}/`);
          if (res.ok) {
            const dados = await res.json();
            setValores({
              preco: formatarDinheiroDoBackend(dados.preco),
              valor_condominio: formatarDinheiroDoBackend(dados.valor_condominio),
              iptu: formatarDinheiroDoBackend(dados.iptu)
            });
            if (dados.comodidades_condominio) {
              setComodidadesSelecionadas(dados.comodidades_condominio.split(","));
            }
            // ── Carrega fotos existentes ──────────────────────────────
            if (dados.capa) setPreviaCapa(dados.capa);
            if (dados.fotos_galeria && dados.fotos_galeria.length > 0) {
              setFotosExistentesGaleria(dados.fotos_galeria); // [{id, url}]
              setPreviasGaleria(dados.fotos_galeria.map(f => f.url));
            }
            // ── Preenche campos de texto ───────────────────────────────
            setTimeout(() => {
              if (formRef.current) {
                const campos = ["titulo", "descricao", "tipo_imovel", "tipo_finalidade", "finalidade", "area_util", "quartos", "suites", "banheiros", "vagas", "bairro", "endereco", "numero", "complemento", "cidade", "cep", "latitude", "longitude"];
                campos.forEach(campo => {
                  const input = formRef.current.querySelector(`[name="${campo}"]`);
                  // usa != null para cobrir tanto null quanto undefined
                  if (input && dados[campo] != null) input.value = dados[campo];
                });
                // registra o CEP carregado para evitar rebusca desnecessária
                if (dados.cep) ultimoCepBuscado.current = dados.cep.replace(/\D/g, "");
              }
            }, 100);
          }
        } catch (erro) {
          console.error("Erro ao carregar dados", erro);
        } finally {
          setCarregandoDados(false);
        }
      };
      buscarDadosImovel();
    } else {
      setCarregandoDados(false);
    }
  }, [imovelId]);

  const alternarComodidade = (item) => {
    setComodidadesSelecionadas(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleChangeDinheiro = (e) => {
    const { name, value } = e.target;
    setValores(prev => ({ ...prev, [name]: aplicarMascaraDinheiro(value) }));
  };

  const buscarCoordenadasAutomaticas = async () => {
    const get = (name) => formRef.current?.querySelector(`[name="${name}"]`)?.value.trim() || "";
    const rua = get("endereco");
    const numero = get("numero");
    const bairro = get("bairro");
    const cidade = get("cidade");

    if (!rua || !bairro || !cidade) {
      setErroCoords("Preencha Rua, Bairro e Cidade antes de gerar as coordenadas.");
      return;
    }

    if (!numero) {
      setErroCoords("Para uma melhor precisão, por favor insira o número do seu imóvel.");
    } else {
      setErroCoords("");
    }

    setBuscandoCoords(true);
    try {
      const rawQuery = `${rua}, ${numero}, ${bairro}, ${cidade}, Brasil`;
      const res = await fetch(
        `${API}/api/geocodificar/?q=${encodeURIComponent(rawQuery)}`
      );
      const data = await res.json();
      if (res.ok) {
        const setField = (name, val) => {
          const el = formRef.current?.querySelector(`[name="${name}"]`);
          if (el) el.value = val;
        };
        setField("latitude", data.lat);
        setField("longitude", data.lon);
      } else {
        setErroCoords(data.erro || "Endereço não encontrado. Tente preencher com mais detalhes.");
      }
    } catch {
      setErroCoords("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
    } finally {
      setBuscandoCoords(false);
    }
  };

  const handleCepChange = async (e) => {
    let cepStr = e.target.value.replace(/\D/g, "");
    e.target.value = cepStr.replace(/^(\d{5})(\d)/, "$1-$2");
    // só busca se tiver 8 dígitos E o CEP for diferente do último buscado
    if (cepStr.length === 8 && cepStr !== ultimoCepBuscado.current) {
      ultimoCepBuscado.current = cepStr;
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepStr}/json/`);
        const data = await res.json();
        if (!data.erro && formRef.current) {
          const set = (name, val) => {
            const el = formRef.current.querySelector(`[name="${name}"]`);
            if (el) el.value = val || "";
          };
          set("endereco", data.logradouro);
          set("bairro", data.bairro);
          set("cidade", data.localidade || "Belém");
          setErros(prev => ({ ...prev, endereco: null, bairro: null, cidade: null }));
        }
      } catch (err) { console.error("Erro ao buscar CEP", err); }
    }
    // limpa o cache quando o usuário apaga o CEP
    if (cepStr.length < 8) ultimoCepBuscado.current = "";
  };

  const aoSelecionarCapa = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      setFotoCapa(arquivo);
      setPreviaCapa(URL.createObjectURL(arquivo));
    }
  };

  const aoSelecionarGaleria = (e) => {
    const arquivos = Array.from(e.target.files);
    setArquivosGaleria(prev => [...prev, ...arquivos]);
    const novasPrevias = arquivos.map(file => URL.createObjectURL(file));
    setPreviasGaleria(prev => [...prev, ...novasPrevias]);
  };

  const removerFotoGaleria = (index) => {
    setPreviasGaleria(prev => prev.filter((_, i) => i !== index));
    setArquivosGaleria(prev => prev.filter((_, i) => i !== index));
  };

  const removerCapa = () => {
    setFotoCapa(null);
    setPreviaCapa(null);
    if (capaInputRef.current) capaInputRef.current.value = "";
  };

  const enviarFormulario = async () => {
    setSalvando(true);
    const token = sessionStorage.getItem("tokenImobiliaria");
    const formData = new FormData();

    // Campos gerais — exclui latitude/longitude para tratamento separado
    const CAMPOS_GEO = ["latitude", "longitude"];
    const inputs = formRef.current.querySelectorAll('input[name], select[name], textarea[name]');
    inputs.forEach(input => {
      if (CAMPOS_GEO.includes(input.name)) return; // tratado abaixo
      let val = input.value;
      if (["preco", "valor_condominio", "iptu"].includes(input.name)) {
        val = val.replace(/\D/g, "") / 100;
      }
      formData.append(input.name, val);
    });

    // Lat/Lng: envia string vazia se não preenchido (backend converte para NULL)
    const geoPayload = {};
    CAMPOS_GEO.forEach(campo => {
      const el = formRef.current.querySelector(`[name="${campo}"]`);
      const val = el ? el.value.trim() : "";
      formData.append(campo, val);
      geoPayload[campo] = val || "(vazio)";
    });

    // ── LOG DE DIAGNÓSTICO ─────────────────────────────────────────────────
    console.log("📡 Enviando FormData para API...");
    console.log("   Método:", imovelId ? "PUT" : "POST");
    console.log("   URL:", imovelId ? `${API}/api/imoveis/${imovelId}/` : `${API}/api/imoveis/`);
    console.log("   Coordenadas GPS:", geoPayload);
    console.log("   Todos os campos:");
    for (const [k, v] of formData.entries()) {
      if (k !== "galeria") console.log(`     ${k}: ${v}`);
    }
    // ───────────────────────────────────────────────────────────────────────

    formData.append("comodidades_condominio", comodidadesSelecionadas.join(","));
    if (fotoCapa) formData.append("galeria", fotoCapa);
    arquivosGaleria.forEach(arq => formData.append("galeria", arq));
    const url = imovelId ? `${API}/api/imoveis/${imovelId}/` : `${API}/api/imoveis/`;
    const metodo = imovelId ? "PUT" : "POST";
    try {
      const resposta = await fetch(url, { method: metodo, headers: { "x-auth-token": token }, body: formData });
      if (resposta.ok) {
        // Invalida o cache da busca IA para que o mapa reflita as novas coordenadas
        sessionStorage.removeItem("nexus_resultados_ia");
        console.log("✅ Salvo com sucesso! Cache sessionStorage invalidado.");
        onToast(imovelId ? "Imóvel atualizado com sucesso!" : "Imóvel publicado com sucesso!", "sucesso");
        setTimeout(() => onSaved?.(), 800);
      } else {
        const d = await resposta.json();
        onToast("Erro no servidor: " + d.erro, "erro");
      }
    } catch (err) {
      onToast("Falha de conexão com o servidor.", "erro");
    } finally {
      setSalvando(false);
    }
  };

  const avancarEtapa = () => {
    const novosErros = {};
    if (etapaAtual === 1) {
      const titulo = formRef.current.querySelector('[name="titulo"]')?.value.trim();
      const descricao = formRef.current.querySelector('[name="descricao"]')?.value.trim();
      if (!titulo) novosErros.titulo = "O título do anúncio é obrigatório.";
      if (!descricao) novosErros.descricao = "A descrição detalhada é obrigatória.";
      const precoVal = Number(valores.preco.replace(/\D/g, ""));
      if (precoVal <= 0) novosErros.preco = "O preço do imóvel deve ser maior que zero.";
      const condoVal = Number(valores.valor_condominio.replace(/\D/g, ""));
      if (condoVal <= 0) novosErros.valor_condominio = "O valor do condomínio é obrigatório.";
      const iptuVal = Number(valores.iptu.replace(/\D/g, ""));
      if (iptuVal <= 0) novosErros.iptu = "O valor do IPTU é obrigatório.";
    } else if (etapaAtual === 2) {
      if (!imovelId && !fotoCapa) novosErros.capa = "A foto de capa é obrigatória.";
      const totalFotos = arquivosGaleria.length + fotosExistentesGaleria.length;
      if (totalFotos < 1) novosErros.galeria = `Adicione pelo menos 1 foto do imóvel.`;
    } else if (etapaAtual === 3) {
      const campos = ["area_util", "quartos", "suites", "banheiros", "vagas"];
      campos.forEach(campo => {
        const val = formRef.current.querySelector(`[name="${campo}"]`)?.value.trim();
        if (!val || Number(val) < 0) novosErros[campo] = "Campo obrigatório";
      });
      if (comodidadesSelecionadas.length < 3) novosErros.comodidades = "Selecione ao menos 3 comodidades.";
    } else if (etapaAtual === 4) {
      const cepVal = formRef.current.querySelector('[name="cep"]')?.value.trim();
      if (!cepVal) novosErros.cep = "CEP obrigatório";
      ["endereco", "numero", "bairro", "cidade"].forEach(campo => {
        const val = formRef.current.querySelector(`[name="${campo}"]`)?.value.trim();
        if (!val) novosErros[campo] = "Campo obrigatório";
      });
    }

    if (Object.keys(novosErros).length > 0) { setErros(novosErros); return; }
    setErros({});

    if (etapaAtual === 4) {
      const fe = formRef.current.elements;
      setResumoDados({
        titulo: fe.titulo?.value || '',
        tipo: fe.tipo_imovel?.value || '',
        uso: fe.tipo_finalidade?.value || '',
        negocio: fe.finalidade?.value || '',
        preco: valores.preco,
        condominio: valores.valor_condominio,
        iptu: valores.iptu,
        quartos: fe.quartos?.value || '0',
        suites: fe.suites?.value || '0',
        banheiros: fe.banheiros?.value || '0',
        vagas: fe.vagas?.value || '0',
        area: fe.area_util?.value || '0',
        endereco: fe.endereco?.value || '',
        numero: fe.numero?.value || '',
        complemento: fe.complemento?.value || '',
        bairro: fe.bairro?.value || '',
        cidade: fe.cidade?.value || '',
        cep: fe.cep?.value || '',
        latitude: fe.latitude?.value || '',
        longitude: fe.longitude?.value || '',
        comodidades: comodidadesSelecionadas,
        totalFotos: arquivosGaleria.length + fotosExistentesGaleria.length,
      });
    }
    setEtapaAtual(prev => Math.min(prev + 1, 5));
  };

  const voltarEtapa = () => setEtapaAtual(prev => Math.max(prev - 1, 1));

  const labelClass = "block text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5";
  const inputClass = "w-full bg-white border border-slate-200 p-2.5 rounded-xl text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium placeholder:text-slate-400";
  const erroClass = "text-red-600 text-[10px] font-semibold mt-1.5 flex items-center gap-1";

  if (carregandoDados) {
    return <div className="text-center py-20 text-blue-500 animate-pulse font-bold tracking-widest uppercase">Carregando dados...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 w-full mx-auto">
      {/* SIDEBAR PROGRESSO */}
      <div className="w-full lg:w-52 shrink-0 flex flex-col gap-1 pt-1 lg:pt-2">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.25em] px-3 mb-3">Progresso</p>
        {PASSOS.map((passo, idx) => {
          const num = idx + 1;
          const ativo = etapaAtual === num;
          const concluido = etapaAtual > num;
          return (
            <div
              key={num}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${ativo ? "bg-white border border-blue-200 shadow-sm" : "border border-transparent"} ${!ativo && !concluido ? "opacity-40" : ""}`}
            >
              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-200 ${ativo ? "bg-blue-600 text-[#ffffff] shadow-md shadow-blue-600/40" : concluido ? "bg-emerald-600/20 text-emerald-600 border border-emerald-600/30" : "bg-slate-400 text-[#ffffff] border border-slate-300"}`}>
                {concluido ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                ) : num}
              </div>
              <div className="min-w-0">
                <p className={`text-[13px] font-bold leading-tight truncate ${ativo ? "text-slate-800" : concluido ? "text-slate-500" : "text-slate-500"}`}>{passo.nome}</p>
                <p className={`text-[11px] leading-tight mt-0.5 ${ativo ? "text-blue-600" : "text-slate-500"}`}>{passo.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ÁREA DO FORMULÁRIO */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/60 flex items-center justify-between bg-slate-50/60">
          <div>
            <h2 className="text-sm font-bold text-slate-800">{imovelId ? "Editar Imóvel" : PASSOS[etapaAtual - 1].nome}</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">{PASSOS[etapaAtual - 1].desc}</p>
          </div>
          {imovelId && <span className="bg-amber-50 text-amber-700 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-200">Modo Edição</span>}
        </div>

        <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="flex-1 overflow-y-auto">
          <div className="p-5 md:p-6 space-y-5">

            {/* ── ETAPA 1: DADOS BÁSICOS ─────────────────────────────── */}
            <div className={etapaAtual === 1 ? "step-animate space-y-5" : "hidden"}>
              <div>
                <label className={`${labelClass} ${erros.titulo ? "text-red-600" : ""}`}>Título do Anúncio</label>
                <input name="titulo" type="text" placeholder="Ex: Apartamento moderno no Jardins..." className={`${inputClass} ${erros.titulo ? "border-red-500/60" : ""}`} onChange={() => setErros(prev => ({ ...prev, titulo: null }))} />
                {erros.titulo && <p className={erroClass}><span>⚠</span>{erros.titulo}</p>}
              </div>
              <div>
                <label className={`${labelClass} ${erros.descricao ? "text-red-600" : ""}`}>Descrição Detalhada</label>
                <textarea name="descricao" rows="3" placeholder="Descreva o imóvel com detalhes..." className={`${inputClass} ${erros.descricao ? "border-red-500/60" : ""}`} onChange={() => setErros(prev => ({ ...prev, descricao: null }))}></textarea>
                {erros.descricao && <p className={erroClass}><span>⚠</span>{erros.descricao}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: "tipo_imovel", label: "Tipo", options: ["Apartamento", "Casa", "Terreno", "Sala Comercial"] },
                  { name: "tipo_finalidade", label: "Uso", options: ["Residencial", "Comercial"] },
                  { name: "finalidade", label: "Negócio", options: ["Venda", "Aluguel"] },
                ].map(({ name, label, options }) => (
                  <div key={name}>
                    <label className={labelClass}>{label}</label>
                    <select name={name} className={inputClass}>
                      {options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gradient-to-br from-slate-50 to-white p-4 rounded-xl border border-slate-200/60">
                {[
                  { name: "preco", label: "Preço", err: erros.preco },
                  { name: "valor_condominio", label: "Condomínio", err: erros.valor_condominio },
                  { name: "iptu", label: "IPTU (Anual)", err: erros.iptu },
                ].map(({ name, label, err }) => (
                  <div key={name}>
                    <label className={`${labelClass} ${err ? "text-red-600" : ""}`}>{label}</label>
                    <input name={name} type="text" value={valores[name]} onChange={(e) => { handleChangeDinheiro(e); setErros(prev => ({ ...prev, [name]: null })); }} className={`${inputClass} ${err ? "border-red-500/60" : ""}`} />
                    {err && <p className={erroClass}><span>⚠</span>{err}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* ── ETAPA 2: FOTOS ─────────────────────────────────────── */}
            <div className={etapaAtual === 2 ? "step-animate space-y-5" : "hidden"}>
              {/* Foto de Capa */}
              <div>
                <label className={`${labelClass} ${erros.capa ? "text-red-600" : ""}`}>Foto de Capa Principal</label>
                {!previaCapa ? (
                  <div
                    onClick={() => capaInputRef.current.click()}
                    className={`cursor-pointer border border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all group ${erros.capa ? "border-red-500/60 bg-red-500/5" : "border-slate-200/60 bg-slate-50 hover:border-blue-500/60 hover:bg-blue-900/5"}`}
                  >
                    <input ref={capaInputRef} type="file" accept="image/*" onChange={(e) => { aoSelecionarCapa(e); setErros(prev => ({ ...prev, capa: null })); }} className="hidden" />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${erros.capa ? "border-red-500/40 bg-red-50 text-red-600" : "border-slate-200 bg-slate-50 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500"}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-semibold ${erros.capa ? "text-red-600" : "text-slate-300"}`}>{imovelId ? "Clique para alterar a foto de capa" : "Selecionar foto de capa"}</p>
                      <p className="text-[10px] text-slate-500 mt-1">JPG, PNG — Será exibida como thumbnail principal</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-xl group">
                    <img src={previaCapa} className="w-full h-full object-cover" alt="Capa" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={(e) => { e.preventDefault(); removerCapa(); }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        Remover capa
                      </button>
                    </div>
                  </div>
                )}
                {erros.capa && <p className={erroClass}><span>⚠</span>{erros.capa}</p>}
              </div>

              {/* Galeria */}
              <div className="border-t border-slate-200/60 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className={`${labelClass} ${erros.galeria ? "text-red-600" : ""}`}>Galeria do Imóvel</label>
                    <p className="text-[10px] text-slate-500">Mínimo de 1 foto · JPG, PNG · Máx. 20 fotos</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${(arquivosGaleria.length + fotosExistentesGaleria.length) >= 1 ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
                    {arquivosGaleria.length + fotosExistentesGaleria.length}/20
                  </span>
                </div>

                {previasGaleria.length === 0 ? (
                  <div
                    onClick={() => galeriaInputRef.current.click()}
                    className={`cursor-pointer border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 transition-all group ${erros.galeria ? "border-red-500/50 bg-red-500/5" : "border-slate-200/50 bg-slate-50 hover:border-blue-500/50 hover:bg-blue-900/5"}`}
                  >
                    <input ref={galeriaInputRef} type="file" accept="image/*" multiple onChange={aoSelecionarGaleria} className="hidden" />
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${erros.galeria ? "border-red-500/40 bg-red-50 text-red-600" : "border-slate-200 bg-slate-50 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500 group-hover:bg-blue-50"}`}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" x2="12" y1="3" y2="15" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-bold ${erros.galeria ? "text-red-600" : "text-slate-700"}`}>Arraste suas fotos aqui</p>
                      <p className={`text-xs mt-1 ${erros.galeria ? "text-red-600/70" : "text-slate-500"}`}>Ou clique para selecionar arquivos do seu computador</p>
                    </div>
                    <button type="button" className={`px-5 py-2 rounded-full text-xs font-semibold border transition-all ${erros.galeria ? "border-red-500/40 text-red-600 hover:bg-red-50" : "border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800"}`}>
                      Selecionar Fotos
                    </button>
                    <p className="text-[10px] text-slate-600">Formatos aceitos: JPG, PNG. Máximo de 20 fotos.</p>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
                      {previasGaleria.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                          <img src={src} className="w-full h-full object-cover" alt={`Foto ${idx + 1}`} />
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); removerFotoGaleria(idx); }}
                            className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                          >
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                      {previasGaleria.length < 20 && (
                        <div onClick={() => galeriaInputRef.current.click()} className="aspect-square rounded-lg border-2 border-dashed border-slate-200/60 bg-slate-50 hover:border-blue-500/50 hover:bg-blue-900/5 cursor-pointer flex flex-col items-center justify-center gap-1 transition-all group">
                          <input ref={galeriaInputRef} type="file" accept="image/*" multiple onChange={aoSelecionarGaleria} className="hidden" />
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500 group-hover:text-blue-600 transition-colors"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                          <span className="text-[9px] text-slate-500 group-hover:text-blue-600 font-bold uppercase tracking-wide transition-colors">Adicionar</span>
                        </div>
                      )}
                    </div>
                    {erros.galeria && <p className={erroClass}><span>⚠</span>{erros.galeria}</p>}
                  </div>
                )}
                {erros.galeria && previasGaleria.length > 0 && <p className={`${erroClass} mt-1`}><span>⚠</span>{erros.galeria}</p>}
              </div>
            </div>

            {/* ── ETAPA 3: DETALHES ──────────────────────────────────── */}
            <div className={etapaAtual === 3 ? "step-animate space-y-5" : "hidden"}>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {["area_util", "quartos", "suites", "banheiros", "vagas"].map((campo) => (
                  <div key={campo}>
                    <label className={`${labelClass} ${erros[campo] ? "text-red-600" : ""}`}>{LABELS_CAMPOS[campo]}</label>
                    <div className="relative">
                      <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${erros[campo] ? "text-red-600" : "text-slate-500"}`}>{ICONES_CAMPOS[campo]}</div>
                      <input name={campo} type="number" min="0" onChange={() => setErros(prev => ({ ...prev, [campo]: null }))} className={`${inputClass} pl-8 ${erros[campo] ? "border-red-500/60" : ""}`} />
                    </div>
                    {erros[campo] && <p className={erroClass}><span>⚠</span>{erros[campo]}</p>}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`${labelClass} ${erros.comodidades ? "text-red-600" : ""}`}>Comodidades</label>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${comodidadesSelecionadas.length >= 3 ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                    {comodidadesSelecionadas.length} selecionadas
                  </span>
                </div>
                {erros.comodidades && <p className={`${erroClass} mb-2`}><span>⚠</span>{erros.comodidades}</p>}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                  {LISTA_COMODIDADES.map((item) => {
                    const sel = comodidadesSelecionadas.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => { alternarComodidade(item); setErros(prev => ({ ...prev, comodidades: null })); }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-wide transition-all text-left border ${sel ? "bg-blue-600/10 border-blue-500/30 text-blue-600" : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700"}`}
                      >
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border transition-all ${sel ? "bg-blue-600 border-blue-600" : "border-slate-600"}`}>
                          {sel && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6L9 17L4 12" /></svg>}
                        </div>
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── ETAPA 4: LOCALIZAÇÃO ───────────────────────────────── */}
            <div className={etapaAtual === 4 ? "step-animate space-y-5" : "hidden"}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className={`${labelClass} ${erros.cep ? "text-red-600" : ""}`}>CEP</label>
                  <input name="cep" type="text" maxLength="9" onChange={(e) => { handleCepChange(e); setErros(prev => ({ ...prev, cep: null })); }} className={`${inputClass} ${erros.cep ? "border-red-500/60" : ""}`} placeholder="00000-000" />
                  {erros.cep && <p className={erroClass}><span>⚠</span>{erros.cep}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className={`${labelClass} ${erros.endereco ? "text-red-600" : ""}`}>Rua / Avenida</label>
                  <input name="endereco" type="text" onChange={() => setErros(prev => ({ ...prev, endereco: null }))} className={`${inputClass} ${erros.endereco ? "border-red-500/60" : ""}`} />
                  {erros.endereco && <p className={erroClass}><span>⚠</span>{erros.endereco}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className={`${labelClass} ${erros.numero ? "text-red-600" : ""}`}>Número</label>
                  <input name="numero" type="text" onChange={() => setErros(prev => ({ ...prev, numero: null }))} className={`${inputClass} ${erros.numero ? "border-red-500/60" : ""}`} />
                  {erros.numero && <p className={erroClass}><span>⚠</span>{erros.numero}</p>}
                </div>
                <div>
                  <label className={labelClass}>Complemento <span className="text-slate-600 normal-case">(opcional)</span></label>
                  <input name="complemento" type="text" placeholder="Apto, Bloco..." className={inputClass} />
                </div>
                <div>
                  <label className={`${labelClass} ${erros.bairro ? "text-red-600" : ""}`}>Bairro</label>
                  <input name="bairro" type="text" onChange={() => setErros(prev => ({ ...prev, bairro: null }))} className={`${inputClass} ${erros.bairro ? "border-red-500/60" : ""}`} />
                  {erros.bairro && <p className={erroClass}><span>⚠</span>{erros.bairro}</p>}
                </div>
                <div>
                  <label className={`${labelClass} ${erros.cidade ? "text-red-600" : ""}`}>Cidade</label>
                  <input name="cidade" type="text" onChange={() => setErros(prev => ({ ...prev, cidade: null }))} className={`${inputClass} ${erros.cidade ? "border-red-500/60" : ""}`} />
                  {erros.cidade && <p className={erroClass}><span>⚠</span>{erros.cidade}</p>}
                </div>
              </div>

              {/* Coordenadas GPS — Google Maps */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600/70">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Coordenadas GPS <span className="text-slate-600 normal-case font-normal">(opcional — para o Mapa)</span></p>
                  </div>
                  <button
                    type="button"
                    onClick={buscarCoordenadasAutomaticas}
                    disabled={buscandoCoords}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-semibold tracking-wide hover:bg-blue-100 hover:border-blue-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {buscandoCoords ? (
                      <>
                        <svg className="animate-spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                        </svg>
                        Buscando...
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                        </svg>
                        Gerar Automático
                      </>
                    )}
                  </button>
                </div>
                {erroCoords && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3 flex items-center gap-1.5">
                    <span>⚠</span>{erroCoords}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Latitude</label>
                    <input
                      name="latitude"
                      type="text"
                      placeholder="Ex: -1.455833"
                      className={inputClass}
                    />
                    <p className="text-[9px] text-slate-600 mt-1">Negativo para sul do Equador</p>
                  </div>
                  <div>
                    <label className={labelClass}>Longitude</label>
                    <input
                      name="longitude"
                      type="text"
                      placeholder="Ex: -48.490079"
                      className={inputClass}
                    />
                    <p className="text-[9px] text-slate-600 mt-1">Negativo para oeste do meridiano</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── ETAPA 5: REVISÃO ───────────────────────────────────── */}
            <div className={etapaAtual === 5 ? "step-animate space-y-3" : "hidden"}>
              <div className="text-center pb-2">
                <h3 className="text-base font-bold text-slate-800">Revise antes de publicar</h3>
                <p className="text-slate-400 text-xs mt-1">Confira se as informações estão corretas.</p>
              </div>

              {/* Dados Básicos */}
              <ResumoCard titulo="Dados Básicos" onEdit={() => setEtapaAtual(1)}>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-3"><ResumoItem label="Título" valor={resumoDados.titulo} /></div>
                  <ResumoItem label="Tipo" valor={resumoDados.tipo} />
                  <ResumoItem label="Uso" valor={resumoDados.uso} />
                  <ResumoItem label="Negócio" valor={resumoDados.negocio} />
                  <ResumoItem label="Preço" valor={resumoDados.preco} destaque />
                  <ResumoItem label="Condomínio" valor={resumoDados.condominio} />
                  <ResumoItem label="IPTU" valor={resumoDados.iptu} />
                </div>
              </ResumoCard>

              {/* Fotos */}
              <ResumoCard titulo="Fotos" onEdit={() => setEtapaAtual(2)}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  </div>
                  <div>
                    <p className="text-slate-700 text-sm font-semibold">1 foto de capa + {resumoDados.totalFotos || 0} fotos da galeria</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">Total: {(resumoDados.totalFotos || 0) + 1} imagem(ns)</p>
                  </div>
                </div>
              </ResumoCard>

              {/* Detalhes + Localização em grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ResumoCard titulo="Detalhes do Imóvel" onEdit={() => setEtapaAtual(3)}>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: ICONES_CAMPOS.area_util, label: "Área", valor: `${resumoDados.area || 0} m²` },
                      { icon: ICONES_CAMPOS.quartos, label: "Quartos", valor: resumoDados.quartos || "0" },
                      { icon: ICONES_CAMPOS.suites, label: "Suítes", valor: resumoDados.suites || "0" },
                      { icon: ICONES_CAMPOS.banheiros, label: "Banheiros", valor: resumoDados.banheiros || "0" },
                      { icon: ICONES_CAMPOS.vagas, label: "Vagas", valor: resumoDados.vagas || "0" },
                    ].map(({ icon, label, valor }) => (
                      <div key={label} className="bg-slate-50 rounded-lg p-2.5 flex items-center gap-2 border border-slate-200/60">
                        <span className="text-blue-600/60 shrink-0">{icon}</span>
                        <div>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">{label}</p>
                          <p className="text-slate-700 font-bold text-xs">{valor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {resumoDados.comodidades?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60">
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wide mb-2">Comodidades</p>
                      <div className="flex flex-wrap gap-1">
                        {resumoDados.comodidades.map(item => (
                          <span key={item} className="bg-blue-50 text-blue-700 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border border-blue-200">{item}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </ResumoCard>

                <ResumoCard titulo="Localização" onEdit={() => setEtapaAtual(4)}>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600/60 shrink-0 mt-0.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      <div>
                        <p className="text-slate-700 text-xs font-bold">{resumoDados.endereco}, {resumoDados.numero} {resumoDados.complemento && `- ${resumoDados.complemento}`}</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">{resumoDados.bairro} · {resumoDados.cidade}</p>
                        <p className="text-slate-500 text-[10px] mt-1 font-mono">CEP: {resumoDados.cep}</p>
                        {(resumoDados.latitude || resumoDados.longitude) && (
                          <p className="text-blue-600/60 text-[10px] mt-1 font-mono">
                            📍 {resumoDados.latitude || '—'}, {resumoDados.longitude || '—'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </ResumoCard>
              </div>
            </div>
          </div>

          {/* Botões de navegação */}
          <div className="px-5 md:px-6 pb-5 pt-3 border-t border-slate-200/60 flex gap-3 bg-slate-50/40">
            {etapaAtual > 1 && (
              <button type="button" onClick={voltarEtapa} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 font-bold py-3 rounded-xl text-xs uppercase tracking-wide transition-all border border-slate-200">
                ← Voltar
              </button>
            )}
            {etapaAtual < 5 ? (
              <button type="button" onClick={avancarEtapa} className="flex-[3] bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wide transition-all shadow-md shadow-blue-600/20">
                {etapaAtual === 4 ? "Avançar para Revisão →" : "Continuar →"}
              </button>
            ) : (
              <button type="button" onClick={enviarFormulario} disabled={salvando} className="flex-[3] bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wide transition-all disabled:opacity-50 shadow-md shadow-emerald-600/20">
                {salvando ? "Publicando..." : imovelId ? "Salvar Alterações" : "✓ Publicar Imóvel"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Helpers de Resumo ─────────────────────────────────────────────────────
function ResumoCard({ titulo, onEdit, children }) {
  return (
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200/60">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{titulo}</h4>
        <button type="button" onClick={onEdit} className="text-blue-600 hover:text-blue-700 text-[10px] font-semibold flex items-center gap-1.5 transition-colors">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
          Editar
        </button>
      </div>
      {children}
    </div>
  );
}

function ResumoItem({ label, valor, destaque }) {
  return (
    <div>
      <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">{label}</p>
      <p className={`text-sm font-bold ${destaque ? "text-emerald-600" : "text-slate-700"}`}>{valor || "—"}</p>
    </div>
  );
}

// ─── Lista Imóveis ─────────────────────────────────────────────────────────
function ListaImoveis({ aoEditar, onToast }) {
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const alternarStatus = async (id) => {
    const token = sessionStorage.getItem("tokenImobiliaria");
    try {
      const resposta = await fetch(`${API}/api/imoveis/${id}/`, { method: "PATCH", headers: { "x-auth-token": token } });
      if (resposta.ok) {
        setImoveis(prev => prev.map(imovel => imovel.id === id ? { ...imovel, ativo: !imovel.ativo } : imovel));
      }
    } catch (erro) {
      onToast("Erro ao alterar status do imóvel.", "erro");
    }
  };

  useEffect(() => {
    const buscarImoveis = async () => {
      try {
        const resposta = await fetch(`${API}/api/imoveis/lista/`);
        if (resposta.ok) setImoveis(await resposta.json());
      } catch (erro) {
        console.error("Erro ao buscar imóveis:", erro);
      } finally {
        setCarregando(false);
      }
    };
    buscarImoveis();
  }, []);

  if (carregando) return <div className="text-center py-20 text-blue-500 animate-pulse font-bold tracking-widest">CARREGANDO...</div>;

  return (
    <div className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Meus Imóveis</h2>
        <span className="bg-blue-50 text-blue-600 py-1 px-3 rounded-full text-xs font-bold border border-blue-200">{imoveis.length} anúncios</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {imoveis.map((imovel) => (
          <div key={imovel.id} className={`bg-slate-50 border border-slate-200 rounded-xl overflow-hidden transition-all group ${imovel.ativo ? "hover:border-blue-500/40" : "opacity-60 grayscale hover:grayscale-0"}`}>
            <div className="aspect-video bg-white relative overflow-hidden">
              {imovel.capa ? (
                <img src={imovel.capa} alt={imovel.titulo} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-600 text-xs font-bold uppercase">Sem Foto</div>
              )}
              <div className={`absolute top-2.5 left-2.5 text-[9px] px-2.5 py-1 rounded font-bold uppercase tracking-widest backdrop-blur-md ${imovel.finalidade === "Aluguel" ? "bg-emerald-500/90 text-white" : "bg-blue-600/90 text-white"}`}>{imovel.finalidade}</div>
              {!imovel.ativo && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                  <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-widest shadow-2xl">Inativo</span>
                </div>
              )}
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-slate-800 font-bold truncate text-sm">{imovel.titulo}</h3>
                <p className="text-slate-500 text-xs mt-0.5">{imovel.tipo_imovel} · {imovel.bairro}</p>
              </div>
              <div className={`font-bold text-base ${imovel.ativo ? "text-blue-600" : "text-slate-400"}`}>
                R$ {Number(imovel.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                <button onClick={() => aoEditar(imovel.id)} disabled={!imovel.ativo} className="bg-slate-100 hover:bg-blue-600 border border-slate-200 hover:border-blue-500 text-slate-700 hover:text-white py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wide disabled:opacity-30 disabled:cursor-not-allowed">
                  Editar
                </button>
                <button onClick={() => alternarStatus(imovel.id)} className={`${imovel.ativo ? "bg-slate-100 hover:bg-red-600 border border-slate-200 hover:border-red-500 text-slate-700 hover:text-white" : "bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200"} py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wide`}>
                  {imovel.ativo ? "Inativar" : "Reativar"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {imoveis.length === 0 && (
        <div className="text-center py-20 text-slate-500 border border-dashed border-slate-200/50 rounded-xl">
          Nenhum imóvel cadastrado ainda.
        </div>
      )}
    </div>
  );
}

// ─── Kanban de Leads ───────────────────────────────────────────────────────
function ListaLeads() {
  const [leads, setLeads] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [arrastando, setArrastando] = useState(null);
  const [sobreColuna, setSobreColuna] = useState(null);
  const [modoVisu, setModoVisu] = useState("kanban"); // "kanban" | "lista"
  const [expandidoIds, setExpandidoIds] = useState(new Set());
  const [emailVisivelIds, setEmailVisivelIds] = useState(new Set());

  const toggleExpandir = (id) => setExpandidoIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleEmail = (id) => setEmailVisivelIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const COLUNAS = [
    { key: "novo", label: "Novo Contato", cor: "blue", icone: <><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><path d="M22 20a6 6 0 0 0-9-5.2" /><path d="M18 14l2 2 4-4" /></> },
    { key: "atendimento", label: "Em Atendimento", cor: "amber", icone: <><path strokeLinecap="round" d="M8 12h8M8 8h5M8 16h3" /><rect x="3" y="3" width="18" height="18" rx="2" /></> },
    { key: "fechado", label: "Venda Fechada", cor: "emerald", icone: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></> },
    { key: "perdido", label: "Perdido", cor: "red", icone: <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></> },
  ];

  const COR_MAP = {
    blue:    { badge: "bg-blue-50 text-blue-700 border-blue-200",    col: "border-blue-200",    header: "text-blue-700",    drop: "bg-blue-50 border-blue-300"    },
    amber:   { badge: "bg-amber-50 text-amber-700 border-amber-200", col: "border-amber-200",   header: "text-amber-700",   drop: "bg-amber-50 border-amber-300"   },
    emerald: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", col: "border-emerald-200", header: "text-emerald-700", drop: "bg-emerald-50 border-emerald-300" },
    red:     { badge: "bg-red-50 text-red-700 border-red-200",       col: "border-red-200",     header: "text-red-700",     drop: "bg-red-50 border-red-300"       },
  };

  useEffect(() => { buscarLeads(); }, []);

  const buscarLeads = async () => {
    try {
      const res = await fetch(`${API}/api/leads/`);
      if (res.ok) setLeads(await res.json());
    } catch (e) { console.error(e); }
    finally { setCarregando(false); }
  };

  const atualizarStatus = async (id, novoStatus) => {
    const token = sessionStorage.getItem("tokenImobiliaria");
    // Atualização otimista
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: novoStatus } : l));
    try {
      await fetch(`${API}/api/leads/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ status: novoStatus }),
      });
    } catch { buscarLeads(); }
  };

  const abrirWhatsApp = (telefone, nome, imovel) => {
    const num = telefone.replace(/\D/g, "");
    const txt = `Olá, ${nome}! Sou o corretor da Imobi e vi que você se interessou pelo ${imovel}. Como posso te ajudar?`;
    window.open(`https://wa.me/55${num}?text=${encodeURIComponent(txt)}`, "_blank");
  };

  const corHorario = (horario) => {
    const h = (horario || "").toLowerCase();
    if (/\d{2}\/\d{2}\/\d{4}/.test(horario)) return "bg-blue-50 text-blue-700 border-blue-200";
    if (h.includes("manh")) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    if (h.includes("tarde")) return "bg-orange-50 text-orange-700 border-orange-200";
    if (h.includes("noite")) return "bg-indigo-50 text-indigo-700 border-indigo-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  const corContato = (meio) => {
    const m = (meio || "").toLowerCase();
    if (m.includes("whatsapp") || m.includes("wats")) return "bg-green-50 text-green-700 border-green-200";
    if (m.includes("liga") || m.includes("telefone")) return "bg-slate-100 text-slate-600 border-slate-200";
    if (m.includes("email") || m.includes("e-mail")) return "bg-sky-50 text-sky-700 border-sky-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  // ── Drag & Drop ──────────────────────────────────────────────────────────
  const onDragStart = (e, id) => {
    setArrastando(id);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e, colKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setSobreColuna(colKey);
  };
  const onDrop = (e, colKey) => {
    e.preventDefault();
    if (arrastando !== null) atualizarStatus(arrastando, colKey);
    setArrastando(null);
    setSobreColuna(null);
  };
  const onDragEnd = () => { setArrastando(null); setSobreColuna(null); };

  if (carregando) return (
    <div className="text-center py-20 text-blue-500 animate-pulse font-bold tracking-widest">CARREGANDO...</div>
  );

  const total = leads.length;

  return (
    <div className="step-animate">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Gestão de Leads</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            {modoVisu === "kanban" ? "Arraste os cards para mover entre etapas" : "Visualizando todos os contatos em lista"}
          </p>
        </div>

        {/* Controles: toggle + contador */}
        <div className="flex items-center gap-3">
          {/* Toggle de visualização */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 gap-1">
            <button
              onClick={() => setModoVisu("kanban")}
              title="Modo Kanban"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${modoVisu === "kanban"
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="18" rx="1" />
                <rect x="14" y="3" width="7" height="11" rx="1" />
                <rect x="14" y="17" width="7" height="4" rx="1" />
              </svg>
              Kanban
            </button>
            <button
              onClick={() => setModoVisu("lista")}
              title="Modo Lista"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${modoVisu === "lista"
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              Lista
            </button>
          </div>

          <span className="bg-blue-50 text-blue-600 py-1.5 px-3 rounded-full text-xs font-bold border border-blue-200">
            {total} contato{total !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── MODO KANBAN ────────────────────────────────────────────────── */}
      {modoVisu === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {COLUNAS.map(({ key, label, cor, icone }) => {
            const colLeads = leads.filter(l => l.status === key);
            const cores = COR_MAP[cor];
            const eAlvo = sobreColuna === key;

            return (
              <div
                key={key}
                onDragOver={(e) => onDragOver(e, key)}
                onDrop={(e) => onDrop(e, key)}
                onDragLeave={() => setSobreColuna(null)}
                className={`flex flex-col rounded-2xl border transition-all duration-200 ${eAlvo ? `${cores.drop} border-dashed` : "bg-slate-100/80 border-slate-200"}`}
              >
                <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cores.header}>{icone}</svg>
                    <span className={`text-[11px] font-bold uppercase tracking-widest ${cores.header}`}>{label}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cores.badge}`}>{colLeads.length}</span>
                </div>
                <div className="p-3 flex flex-col gap-3 min-h-[120px]">
                  {colLeads.length === 0 && (
                    <div className={`flex-1 border-2 border-dashed rounded-xl flex items-center justify-center py-8 transition-all ${eAlvo ? "border-current opacity-40" : "border-slate-200/50 opacity-30"}`}>
                      <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Solte aqui</p>
                    </div>
                  )}
                  {colLeads.map(lead => {
                    const iniciais = lead.nome
                      ? lead.nome.trim().split(/\s+/).slice(0, 2).map(p => p[0].toUpperCase()).join("")
                      : "?";
                    const aberto = expandidoIds.has(lead.id);
                    return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, lead.id)}
                      onDragEnd={onDragEnd}
                      style={{ maxWidth: "280px", border: "0.5px solid #e2e8f0", borderRadius: "12px" }}
                      className={`w-full bg-white overflow-hidden shadow-sm cursor-grab active:cursor-grabbing transition-all duration-150 select-none
                        ${arrastando === lead.id ? "opacity-40 scale-95" : "hover:shadow-md hover:border-slate-300"}`}
                    >
                      {/* ── Header (clicável para colapsar/expandir) ── */}
                      <div
                        style={{ background: "#E6F1FB", padding: "12px 14px", cursor: "pointer" }}
                        className="flex items-center gap-2.5"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); toggleExpandir(lead.id); }}
                      >
                        <div
                          style={{ width: 36, height: 36, minWidth: 36, borderRadius: "50%", background: "#185FA5", color: "#fff", fontSize: 13, fontWeight: 600 }}
                          className="flex items-center justify-center shrink-0"
                        >
                          {iniciais}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p style={{ color: "#0C447C", fontWeight: 500, fontSize: 13, lineHeight: "1.3" }} className="truncate">{lead.nome}</p>
                          <p style={{ color: "#185FA5", fontSize: 11, lineHeight: "1.3" }} className="truncate mt-0.5">{lead.email || "—"}</p>
                        </div>
                        <svg
                          width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round"
                          style={{ shrink: 0, transition: "transform 200ms ease", transform: aberto ? "rotate(180deg)" : "rotate(0deg)" }}
                          className="shrink-0"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>

                      {/* ── Body + Footer com transição suave ── */}
                      <div style={{
                        maxHeight: aberto ? "400px" : "0px",
                        overflow: "hidden",
                        transition: "max-height 200ms ease"
                      }}>
                        {/* Body */}
                        <div style={{ padding: "10px 14px" }} className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span style={{ fontSize: 11, color: "#64748b" }}>Imóvel</span>
                            <span style={{ fontSize: 12, fontWeight: 500, color: "#1e293b" }} className="truncate max-w-[160px] text-right">{lead.imovel_titulo || "—"}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span style={{ fontSize: 11, color: "#64748b" }}>Telefone</span>
                            <span style={{ fontSize: 12, fontWeight: 500, color: "#1e293b" }}>{lead.telefone || "—"}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span style={{ fontSize: 11, color: "#64748b" }}>Visita agendada</span>
                            {lead.melhor_horario
                              ? <span style={{ background: "#FAEEDA", color: "#633806", fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 20 }} className="whitespace-nowrap">{lead.melhor_horario}</span>
                              : <span style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8" }}>—</span>
                            }
                          </div>
                          {lead.mensagem && (
                            <div style={{ borderTop: "0.5px solid #e2e8f0", paddingTop: 8, marginTop: 4 }}>
                              <p style={{ fontSize: 10, fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Mensagem do cliente:</p>
                              <p style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic" }} className="leading-snug line-clamp-2">"{lead.mensagem}"</p>
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div style={{ borderTop: "0.5px solid #e2e8f0", padding: "8px 14px" }} className="flex gap-2">
                          <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); abrirWhatsApp(lead.telefone, lead.nome, lead.imovel_titulo); }}
                            style={{ flex: 1, border: "1.5px solid #22C55E", borderRadius: 8, background: "#fff", fontSize: 11, fontWeight: 500, color: "#22C55E", padding: "6px 0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#F0FDF4"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#22C55E"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L.057 23.057a.5.5 0 00.61.61l5.199-1.477A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.52-5.183-1.427l-.372-.222-3.862 1.098 1.098-3.862-.222-.372A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                            WhatsApp
                          </button>
                          <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); if (lead.email) window.open(`mailto:${lead.email}`, "_blank"); }}
                            style={{ flex: 1, border: "1.5px solid #3B82F6", borderRadius: 8, background: "#fff", fontSize: 11, fontWeight: 500, color: "#3B82F6", padding: "6px 0", cursor: lead.email ? "pointer" : "default", opacity: lead.email ? 1 : 0.4, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                            onMouseEnter={(e) => { if (lead.email) e.currentTarget.style.background = "#EFF6FF"; }}
                            onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            E-mail
                          </button>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODO LISTA ─────────────────────────────────────────────────── */}
      {modoVisu === "lista" && leads.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xl shadow-slate-200">
          {/* Cabeçalho */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center border-b border-slate-200 px-4 py-2.5 bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500 font-bold gap-3">
            <span>Cliente</span>
            <span className="hidden sm:block w-32 text-center">Imóvel</span>
            <span className="w-28 text-center">Status</span>
            <span className="hidden md:block w-24 text-center">Data</span>
            <span className="w-20 text-right">Ação</span>
          </div>

          <div className="divide-y divide-slate-100">
            {leads.map(lead => {
              const col = COLUNAS.find(c => c.key === lead.status) || COLUNAS[0];
              const cores = COR_MAP[col.cor];
              const expandido = expandidoIds.has(lead.id);
              return (
                <div key={lead.id}>
                  {/* ── Linha compacta ── */}
                  <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center px-4 py-2.5 hover:bg-slate-50 transition-colors gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => toggleExpandir(lead.id)}
                        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        title={expandido ? "Recolher" : "Ver detalhes"}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`transition-transform duration-200 ${expandido ? "rotate-180" : ""}`}>
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{lead.nome}</p>
                        <p className="text-[11px] text-slate-500 truncate">{lead.telefone}</p>
                      </div>
                    </div>
                    <span className="hidden sm:block w-32 text-center">
                      <span className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded truncate block max-w-full">{lead.imovel_titulo}</span>
                    </span>
                    <div className="w-28">
                      <select
                        value={lead.status}
                        onChange={(e) => atualizarStatus(lead.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase tracking-wide rounded px-2 py-1 outline-none cursor-pointer border transition-colors w-full ${cores.badge}`}
                      >
                        {COLUNAS.map(c => (
                          <option key={c.key} value={c.key} className="bg-white text-slate-700">{c.label}</option>
                        ))}
                      </select>
                    </div>
                    <span className="hidden md:block w-24 text-center text-[10px] text-slate-500 font-mono">{lead.data_criacao}</span>
                    <div className="w-20 text-right">
                      <button
                        onClick={() => abrirWhatsApp(lead.telefone, lead.nome, lead.imovel_titulo)}
                        className="inline-flex items-center gap-1 bg-green-600/10 hover:bg-green-600 text-green-600 hover:text-white px-2 py-1 rounded-lg text-[10px] font-bold transition-all border border-green-600/20 hover:border-green-600 uppercase tracking-wide"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                        WA
                      </button>
                    </div>
                  </div>

                  {/* ── Detalhes expandidos ── */}
                  {expandido && (
                    <div className="px-5 pb-4 pt-1 bg-slate-50 border-t border-slate-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                        {lead.email && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 w-24 shrink-0">E-mail:</span>
                            <span className="text-slate-700">{lead.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 w-24 shrink-0">Contato:</span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${corContato(lead.meio_contato)}`}>{lead.meio_contato || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 w-24 shrink-0">Data visita:</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${corHorario(lead.melhor_horario)}`}>{lead.melhor_horario || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:hidden">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 w-24 shrink-0">Imóvel:</span>
                          <span className="text-slate-700">{lead.imovel_titulo}</span>
                        </div>
                        <div className="flex items-center gap-2 md:hidden">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 w-24 shrink-0">Data:</span>
                          <span className="text-slate-600 font-mono">{lead.data_criacao}</span>
                        </div>
                        {lead.mensagem && (
                          <div className="flex items-start gap-2 sm:col-span-2 pt-1 border-t border-slate-200 mt-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 w-24 shrink-0 pt-0.5">Mensagem:</span>
                            <p className="text-slate-600 italic leading-relaxed">"{lead.mensagem}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Estado vazio (compartilhado) ────────────────────────────── */}
      {total === 0 && (
        <div className="text-center py-24 text-slate-600 border-2 border-dashed border-slate-200/50 rounded-2xl mt-4">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 text-slate-700"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
          <p className="font-bold text-sm">Nenhum contato recebido ainda</p>
          <p className="text-xs mt-1 text-slate-700">Os leads aparecerão aqui quando alguém entrar em contato.</p>
        </div>
      )}
    </div>
  );
}

// ─── Configurações do Painel ────────────────────────────────────────────────
function ConfiguracoesPainel() {
  // ── Estados — Gerenciar Imóveis ───────────────────────────────────────────
  const [listandoImoveis, setListandoImoveis] = useState(false);
  const [imoveisLista, setImoveisLista] = useState([]);
  const [carregandoImoveis, setCarregandoImoveis] = useState(false);
  const [confirmandoExclusaoId, setConfirmandoExclusaoId] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);
  const [resultadoExclusao, setResultadoExclusao] = useState(null);

  // ── Estados — Gerenciar Leads ─────────────────────────────────────────────
  const [listandoLeads, setListandoLeads] = useState(false);
  const [leadsLista, setLeadsLista] = useState([]);
  const [carregandoLeads, setCarregandoLeads] = useState(false);
  const [confirmandoExclusaoLeadId, setConfirmandoExclusaoLeadId] = useState(null);
  const [excluindoLeadId, setExcluindoLeadId] = useState(null);
  const [resultadoExclusaoLead, setResultadoExclusaoLead] = useState(null);

  // ── Imóveis ───────────────────────────────────────────────────────────────
  const carregarImoveis = async () => {
    setCarregandoImoveis(true);
    setResultadoExclusao(null);
    try {
      const res = await fetch(`${API}/api/imoveis/lista/`);
      const data = await res.json();
      setImoveisLista(data);
      setListandoImoveis(true);
    } catch {
      setResultadoExclusao({ tipo: "erro", msg: "Falha ao carregar imóveis." });
    } finally {
      setCarregandoImoveis(false);
    }
  };

  const excluirImovel = async (id) => {
    setExcluindoId(id);
    setResultadoExclusao(null);
    const token = sessionStorage.getItem("tokenImobiliaria");
    try {
      const res = await fetch(`${API}/api/imoveis/${id}/`, {
        method: "DELETE",
        headers: { "x-auth-token": token },
      });
      const data = await res.json();
      if (res.ok) {
        setImoveisLista(prev => prev.filter(im => im.id !== id));
        setResultadoExclusao({ tipo: "sucesso", msg: data.mensagem });
      } else {
        setResultadoExclusao({ tipo: "erro", msg: data.erro || "Erro ao excluir imóvel." });
      }
    } catch {
      setResultadoExclusao({ tipo: "erro", msg: "Falha de conexão com o servidor." });
    } finally {
      setExcluindoId(null);
      setConfirmandoExclusaoId(null);
    }
  };

  // ── Leads ─────────────────────────────────────────────────────────────────
  const carregarLeads = async () => {
    setCarregandoLeads(true);
    setResultadoExclusaoLead(null);
    try {
      const res = await fetch(`${API}/api/leads/`);
      const data = await res.json();
      setLeadsLista(data);
      setListandoLeads(true);
    } catch {
      setResultadoExclusaoLead({ tipo: "erro", msg: "Falha ao carregar leads." });
    } finally {
      setCarregandoLeads(false);
    }
  };

  const excluirLead = async (id) => {
    setExcluindoLeadId(id);
    setResultadoExclusaoLead(null);
    const token = sessionStorage.getItem("tokenImobiliaria");
    try {
      const res = await fetch(`${API}/api/leads/${id}/`, {
        method: "DELETE",
        headers: { "x-auth-token": token },
      });
      const data = await res.json();
      if (res.ok) {
        setLeadsLista(prev => prev.filter(l => l.id !== id));
        setResultadoExclusaoLead({ tipo: "sucesso", msg: data.mensagem });
      } else {
        setResultadoExclusaoLead({ tipo: "erro", msg: data.erro || "Erro ao excluir lead." });
      }
    } catch {
      setResultadoExclusaoLead({ tipo: "erro", msg: "Falha de conexão com o servidor." });
    } finally {
      setExcluindoLeadId(null);
      setConfirmandoExclusaoLeadId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto step-animate">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Configurações do Painel</h1>
        <p className="text-slate-500 text-xs mt-1">Gerencie as configurações e dados do sistema.</p>
      </div>

      {/* Card — Gerenciar Leads */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xl shadow-slate-200">
        <div className="px-6 py-4 border-b border-slate-200/60 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gerenciar Leads</h2>
          </div>
        </div>

        <div className="p-6">
          {!listandoLeads ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-800">Excluir lead da base de dados</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Selecione um contato para removê-lo permanentemente.
                  <span className="text-amber-600/80 font-semibold"> Esta ação não pode ser desfeita.</span>
                </p>
              </div>
              <button
                onClick={carregarLeads}
                disabled={carregandoLeads}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold uppercase tracking-wide transition-all disabled:opacity-50"
              >
                {carregandoLeads ? (
                  <><div className="w-3 h-3 border-2 border-slate-400/30 border-t-slate-300 rounded-full animate-spin" /> Carregando...</>
                ) : (
                  <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg> Selecionar Lead</>
                )}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{leadsLista.length} lead(s) encontrado(s)</p>
                <button
                  onClick={() => { setListandoLeads(false); setConfirmandoExclusaoLeadId(null); setResultadoExclusaoLead(null); }}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
                >
                  Fechar lista
                </button>
              </div>

              {leadsLista.length === 0 ? (
                <p className="text-slate-500 text-xs text-center py-6">Nenhum lead cadastrado.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {leadsLista.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200/60"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-slate-700 text-xs font-semibold truncate">{lead.nome}</p>
                          <p className="text-slate-500 text-[10px] truncate">{lead.imovel_titulo} · {lead.telefone}</p>
                        </div>
                      </div>

                      {confirmandoExclusaoLeadId === lead.id ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <p className="text-[10px] text-amber-600 font-semibold hidden sm:block">Tem certeza?</p>
                          <button
                            onClick={() => setConfirmandoExclusaoLeadId(null)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 transition-all"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => excluirLead(lead.id)}
                            disabled={excluindoLeadId === lead.id}
                            className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-1"
                          >
                            {excluindoLeadId === lead.id ? (
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg> Confirmar</>
                            )}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setConfirmandoExclusaoLeadId(lead.id); setResultadoExclusaoLead(null); }}
                          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-600 border border-red-500/20 hover:border-red-500/40 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                          </svg>
                          Excluir
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {resultadoExclusaoLead && (
            <div className={`mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold ${resultadoExclusaoLead.tipo === "sucesso" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              {resultadoExclusaoLead.tipo === "sucesso" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              )}
              {resultadoExclusaoLead.msg}
            </div>
          )}
        </div>
      </div>

      {/* Card — Excluir Imóveis */}
      <div className="mt-5 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xl shadow-slate-200">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-slate-200/60 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gerenciar Imóveis</h2>
          </div>
        </div>

        <div className="p-6">
          {/* Ação: listar imóveis */}
          {!listandoImoveis ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-800">Excluir imóvel da base de dados</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Selecione um imóvel para removê-lo permanentemente.
                  <span className="text-amber-600/80 font-semibold"> Esta ação não pode ser desfeita.</span>
                </p>
              </div>
              <button
                onClick={carregarImoveis}
                disabled={carregandoImoveis}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold uppercase tracking-wide transition-all disabled:opacity-50"
              >
                {carregandoImoveis ? (
                  <><div className="w-3 h-3 border-2 border-slate-400/30 border-t-slate-300 rounded-full animate-spin" /> Carregando...</>
                ) : (
                  <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> Selecionar Imóvel</>
                )}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{imoveisLista.length} imóvel(is) encontrado(s)</p>
                <button
                  onClick={() => { setListandoImoveis(false); setConfirmandoExclusaoId(null); setResultadoExclusao(null); }}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
                >
                  Fechar lista
                </button>
              </div>

              {imoveisLista.length === 0 ? (
                <p className="text-slate-500 text-xs text-center py-6">Nenhum imóvel cadastrado.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {imoveisLista.map((im) => (
                    <div
                      key={im.id}
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200/60"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {im.capa ? (
                          <img src={im.capa} alt={im.titulo} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600">
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-slate-700 text-xs font-semibold truncate">{im.titulo}</p>
                          <p className="text-slate-500 text-[10px] truncate">{im.bairro}{im.cidade ? `, ${im.cidade}` : ""}</p>
                        </div>
                      </div>

                      {confirmandoExclusaoId === im.id ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <p className="text-[10px] text-amber-600 font-semibold hidden sm:block">Tem certeza?</p>
                          <button
                            onClick={() => setConfirmandoExclusaoId(null)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 transition-all"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => excluirImovel(im.id)}
                            disabled={excluindoId === im.id}
                            className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-1"
                          >
                            {excluindoId === im.id ? (
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg> Confirmar</>
                            )}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setConfirmandoExclusaoId(im.id); setResultadoExclusao(null); }}
                          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-600 border border-red-500/20 hover:border-red-500/40 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                          </svg>
                          Excluir
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Feedback exclusão */}
          {resultadoExclusao && (
            <div className={`mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold ${resultadoExclusao.tipo === "sucesso" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              {resultadoExclusao.tipo === "sucesso" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              )}
              {resultadoExclusao.msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Gerenciar Usuários ────────────────────────────────────────────────────
function GerenciarUsuarios({ onToast, onErroAuth }) {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [novoUsuario, setNovoUsuario] = useState({ username: "", password: "", email: "", is_staff: true });
  const [criando, setCriando] = useState(false);
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);
  const [erroForm, setErroForm] = useState("");

  const token = () => sessionStorage.getItem("tokenImobiliaria");

  const buscarUsuarios = async () => {
    setCarregando(true);
    try {
      const res = await fetch(`${API}/api/usuarios/`, { headers: { "x-auth-token": token() } });
      if (res.ok) setUsuarios(await res.json());
      else if (res.status === 401) onErroAuth?.();
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { buscarUsuarios(); }, []);

  const criarUsuario = async (e) => {
    e.preventDefault();
    setErroForm("");
    if (!novoUsuario.username.trim() || !novoUsuario.password.trim()) {
      setErroForm("Preencha usuário e senha.");
      return;
    }
    setCriando(true);
    try {
      const res = await fetch(`${API}/api/usuarios/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token() },
        body: JSON.stringify(novoUsuario),
      });
      const dados = await res.json();
      if (res.ok) {
        onToast(dados.mensagem, "sucesso");
        setNovoUsuario({ username: "", password: "", email: "", is_staff: true });
        buscarUsuarios();
      } else {
        setErroForm(dados.erro || "Erro ao criar usuário.");
      }
    } catch {
      setErroForm("Falha de conexão.");
    } finally {
      setCriando(false);
    }
  };

  const excluirUsuario = async (id) => {
    setExcluindoId(id);
    try {
      const res = await fetch(`${API}/api/usuarios/${id}/`, {
        method: "DELETE",
        headers: { "x-auth-token": token() },
      });
      const dados = await res.json();
      if (res.ok) {
        onToast(dados.mensagem, "sucesso");
        setUsuarios(prev => prev.filter(u => u.id !== id));
      } else {
        onToast(dados.erro || "Erro ao excluir.", "erro");
      }
    } catch {
      onToast("Falha de conexão.", "erro");
    } finally {
      setExcluindoId(null);
      setConfirmandoId(null);
    }
  };

  const inputClass = "w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-400";
  const labelClass = "block text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5";

  return (
    <div className="space-y-5">
      {/* Criar novo usuário */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xl shadow-slate-200">
        <div className="px-6 py-4 border-b border-slate-200/60 bg-slate-50/50 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
          </svg>
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Criar Novo Usuário</h2>
        </div>
        <div className="p-6">
          <form onSubmit={criarUsuario} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Inputs falsos para impedir o gerenciador de senhas do navegador */}
            <input type="text" style={{ display: "none" }} autoComplete="username" readOnly />
            <input type="password" style={{ display: "none" }} autoComplete="new-password" readOnly />
            <div>
              <label className={labelClass}>Usuário</label>
              <input
                type="text"
                placeholder="Nome de login"
                autoComplete="off"
                value={novoUsuario.username}
                onChange={e => { setNovoUsuario(p => ({ ...p, username: e.target.value })); setErroForm(""); }}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>E-mail <span className="normal-case text-slate-600 font-normal">(opcional)</span></label>
              <input
                type="email"
                placeholder="usuario@email.com"
                autoComplete="off"
                value={novoUsuario.email}
                onChange={e => { setNovoUsuario(p => ({ ...p, email: e.target.value })); setErroForm(""); }}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Senha</label>
              <input
                type="password"
                placeholder="Mín. 6 caracteres"
                autoComplete="new-password"
                value={novoUsuario.password}
                onChange={e => { setNovoUsuario(p => ({ ...p, password: e.target.value })); setErroForm(""); }}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col justify-end">
              <button
                type="submit"
                disabled={criando}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wide transition-all"
              >
                {criando ? "Criando..." : "+ Criar Usuário"}
              </button>
            </div>
          </form>
          {erroForm && (
            <p className="mt-3 text-xs text-red-600 font-semibold flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              {erroForm}
            </p>
          )}
        </div>
      </div>

      {/* Lista de usuários */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xl shadow-slate-200">
        <div className="px-6 py-4 border-b border-slate-200/60 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Usuários Cadastrados</h2>
          </div>
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
            {usuarios.length} usuário{usuarios.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="p-6">
          {carregando ? (
            <div className="flex items-center justify-center py-10 gap-2 text-slate-500 text-xs">
              <div className="w-4 h-4 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
              Carregando usuários...
            </div>
          ) : usuarios.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-8">Nenhum usuário encontrado.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {usuarios.map(u => (
                <div key={u.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200/60">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold ${u.protegido ? "bg-blue-600/20 border border-blue-500/40 text-blue-600" : "bg-slate-100 border border-slate-200 text-slate-500"}`}>
                      {u.username[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-slate-800 text-sm font-semibold truncate">{u.username}</p>
                        {u.protegido && (
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Protegido
                          </span>
                        )}
                        {u.is_superuser && (
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Superuser
                          </span>
                        )}
                        {u.is_staff && !u.is_superuser && (
                          <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Staff
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        ID #{u.id} · Criado em {u.date_joined ? new Date(u.date_joined).toLocaleDateString("pt-BR") : "—"}
                        {u.email ? <span> · {u.email}</span> : null}
                      </p>
                    </div>
                  </div>

                  {u.protegido ? (
                    <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-400 text-[10px] font-bold cursor-not-allowed select-none">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                      Protegido
                    </div>
                  ) : confirmandoId === u.id ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <p className="text-[10px] text-amber-600 font-semibold hidden sm:block">Tem certeza?</p>
                      <button
                        onClick={() => setConfirmandoId(null)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => excluirUsuario(u.id)}
                        disabled={excluindoId === u.id}
                        className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-1"
                      >
                        {excluindoId === u.id ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg> Confirmar</>
                        )}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmandoId(u.id)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-600 border border-red-500/20 hover:border-red-500/40 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                      </svg>
                      Excluir
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Painel Inicial ────────────────────────────────────────────────────────
function PainelInicio({ irPara }) {
  const [stats, setStats] = useState({ imoveis: null, imoveisAtivos: null, leads: null, leadsNovos: null, usuarios: null });

  useEffect(() => {
    const token = sessionStorage.getItem("tokenImobiliaria");
    const headers = { "x-auth-token": token };
    Promise.all([
      fetch(`${API}/api/imoveis/lista/`, { headers }).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/leads/`, { headers }).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/usuarios/`, { headers }).then(r => r.json()).catch(() => []),
    ]).then(([imoveis, leads, usuarios]) => {
      setStats({
        imoveis: Array.isArray(imoveis) ? imoveis.length : 0,
        imoveisAtivos: Array.isArray(imoveis) ? imoveis.filter(i => i.ativo).length : 0,
        leads: Array.isArray(leads) ? leads.length : 0,
        leadsNovos: Array.isArray(leads) ? leads.filter(l => l.status === "novo").length : 0,
        usuarios: Array.isArray(usuarios) ? usuarios.length : 0,
      });
    });
  }, []);

  const corMap = {
    blue:    { bg: "bg-blue-50",    border: "border-blue-400",    text: "text-blue-600"    },
    emerald: { bg: "bg-emerald-50", border: "border-emerald-400", text: "text-emerald-700" },
    violet:  { bg: "bg-violet-50",  border: "border-violet-400",  text: "text-violet-600"  },
    slate:   { bg: "bg-slate-100",  border: "border-slate-400",   text: "text-slate-600"   },
  };

  const cards = [
    { key: "meus_imoveis", label: "Imóveis",  valor: stats.imoveis,  sub: stats.imoveisAtivos != null ? `${stats.imoveisAtivos} ativos` : null, cor: "blue",
      icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></> },
    { key: "leads",        label: "Leads",    valor: stats.leads,    sub: stats.leadsNovos != null ? `${stats.leadsNovos} novos` : null, cor: "emerald",
      icon: <><rect x="2" y="13" width="4" height="8" rx="1" /><rect x="9" y="9" width="4" height="12" rx="1" /><rect x="16" y="5" width="4" height="16" rx="1" /><polyline points="3 10 8 6 13 9 20 3" strokeLinecap="round" strokeLinejoin="round" /></> },
    { key: "usuarios",     label: "Usuários", valor: stats.usuarios, sub: "cadastrados", cor: "violet",
      icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
  ];

  const acoes = [
    { key: "cadastrar",    label: "Cadastrar Imóvel", desc: "Adicionar novo anúncio",  cor: "blue",
      icon: <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" /> },
    { key: "meus_imoveis", label: "Meus Imóveis",    desc: "Gerenciar anúncios",       cor: "slate",
      icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></> },
    { key: "leads",        label: "Ver Leads",        desc: "Clientes e contatos",      cor: "emerald",
      icon: <><rect x="2" y="13" width="4" height="8" rx="1" /><rect x="9" y="9" width="4" height="12" rx="1" /><rect x="16" y="5" width="4" height="16" rx="1" /><polyline points="3 10 8 6 13 9 20 3" strokeLinecap="round" strokeLinejoin="round" /></> },
    { key: "usuarios",     label: "Usuários",         desc: "Gerenciar acessos",        cor: "violet",
      icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></> },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-7 shadow-xl shadow-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Nexus Admin</h1>
        <p className="text-slate-400 text-sm mt-1.5">Visão geral do sistema. Selecione uma ação abaixo ou use o menu lateral.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(({ key, label, valor, sub, cor, icon }) => {
          const c = corMap[cor];
          return (
            <button key={key} onClick={() => irPara(key)}
              className={`text-left bg-white border ${c.border} rounded-2xl p-5 shadow-lg shadow-slate-200 hover:bg-slate-50 transition-all group`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={c.text}>{icon}</svg>
                </div>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-600 group-hover:text-slate-400 transition-colors"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-3xl font-bold text-slate-800">
                {valor == null ? <span className="text-slate-400 text-lg animate-pulse">—</span> : valor}
              </p>
              {sub && <p className={`text-xs font-semibold mt-1 ${c.text}`}>{sub}</p>}
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xl shadow-slate-200">
        <div className="px-6 py-4 border-b border-slate-200/60 bg-slate-50/50">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ações Rápidas</p>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {acoes.map(({ key, label, desc, icon, cor }) => {
            const c = corMap[cor];
            return (
              <button key={key} onClick={() => irPara(key)}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border ${c.border} ${c.bg} hover:opacity-80 transition-all text-center`}>
                <div className={`w-10 h-10 rounded-xl bg-slate-100 border ${c.border} flex items-center justify-center`}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={c.text}>{icon}</svg>
                </div>
                <div>
                  <p className="text-slate-700 text-xs font-bold leading-tight">{label}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">{desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}