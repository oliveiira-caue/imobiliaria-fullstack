"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("cadastrar");
  const [menuAberto, setMenuAberto] = useState(false);
  const [imovelEditando, setImovelEditando] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("tokenImobiliaria");
    if (!token) {
      router.push("/admin");
    } else {
      setCarregando(false);
    }
  }, [router]);

  const fazerLogout = () => {
    localStorage.removeItem("tokenImobiliaria");
    router.push("/admin");
  };

  const iniciarEdicao = (id) => {
    setImovelEditando(id);
    setAbaAtiva("cadastrar");
  };

  if (carregando) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B1120]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1120] text-slate-200 flex-col md:flex-row font-sans antialiased">
      {/* SIDEBAR */}
      <aside className={`${menuAberto ? "flex" : "hidden"} md:flex w-full md:w-52 bg-[#080E1A] border-r border-slate-800/60 p-5 flex-col shrink-0`}>
        <h2 className="hidden md:block text-sm font-bold text-blue-500 mb-10 tracking-[0.3em] text-center uppercase">
          IMOBI<span className="text-white">.ADMIN</span>
        </h2>

        <nav className="flex-1 space-y-1">
          {[
            { key: "cadastrar", label: "Cadastrar Imóvel", icon: <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" /> },
            { key: "meus_imoveis", label: "Meus Imóveis", icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></> },
            { key: "leads", label: "Clientes (Leads)", icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
          ].map(({ key, label, icon }) => {
            const isActive = abaAtiva === key && !(key === "cadastrar" && imovelEditando);
            return (
              <button
                key={key}
                onClick={() => { setAbaAtiva(key); if (key !== "cadastrar") setImovelEditando(null); setMenuAberto(false); }}
                className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${isActive ? "bg-blue-600/15 text-blue-400 border border-blue-500/20" : "hover:bg-slate-800/40 text-slate-500 hover:text-slate-300 border border-transparent"}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icon}</svg>
                {label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-5 border-t border-slate-800/60 space-y-3">
          <div className="flex items-center gap-3 px-1">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0">N</div>
            <p className="font-semibold text-xs text-slate-400">Nelson Costa</p>
          </div>
          <button onClick={fazerLogout} className="text-slate-600 hover:text-red-400 text-xs font-semibold transition-colors flex items-center gap-2 px-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Sair do sistema
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-[#0B1120]">
        <div className="max-w-6xl mx-auto">
          {abaAtiva === "inicio" && (
            <div className="bg-[#0F172A] p-10 rounded-3xl border border-slate-800 shadow-xl shadow-black/40">
              <h1 className="text-2xl font-bold text-white mb-4 tracking-tight">Painel de Gestão</h1>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">Bem-vindo ao sistema. Escolha uma opção no menu lateral para começar.</p>
            </div>
          )}
          {/* Formulário sempre montado — exibido/escondido via CSS para preservar o estado ao trocar de aba */}
          <div className={abaAtiva === "cadastrar" ? "" : "hidden"}>
            <FormularioNovoImovel imovelId={imovelEditando} />
          </div>
          {abaAtiva === "meus_imoveis" && <ListaImoveis aoEditar={iniciarEdicao} />}
          {abaAtiva === "leads" && <ListaLeads />}
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
function FormularioNovoImovel({ imovelId }) {
  const [salvando, setSalvando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(!!imovelId);
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [comodidadesSelecionadas, setComodidadesSelecionadas] = useState([]);

  const [fotoCapa, setFotoCapa] = useState(null);
  const [previaCapa, setPreviaCapa] = useState(null);
  const [arquivosGaleria, setArquivosGaleria] = useState([]);
  const [previasGaleria, setPreviasGaleria] = useState([]);

  const capaInputRef = useRef(null);
  const galeriaInputRef = useRef(null);
  const formRef = useRef(null);
  const [valores, setValores] = useState({ preco: "R$ 0,00", valor_condominio: "R$ 0,00", iptu: "R$ 0,00" });
  const [erros, setErros] = useState({});
  const [resumoDados, setResumoDados] = useState({});

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
          const res = await fetch(`http://localhost:8000/api/imoveis/${imovelId}/`);
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
            setTimeout(() => {
              if (formRef.current) {
                const campos = ["titulo", "descricao", "tipo_imovel", "tipo_finalidade", "finalidade", "area_util", "quartos", "suites", "banheiros", "vagas", "bairro", "endereco", "numero", "complemento", "cidade", "cep"];
                campos.forEach(campo => {
                  const input = formRef.current.querySelector(`[name="${campo}"]`);
                  if (input && dados[campo] !== null) input.value = dados[campo];
                });
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

  const handleCepChange = async (e) => {
    let cepStr = e.target.value.replace(/\D/g, "");
    e.target.value = cepStr.replace(/^(\d{5})(\d)/, "$1-$2");
    if (cepStr.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepStr}/json/`);
        const data = await res.json();
        if (!data.erro) {
          document.querySelector("input[name='endereco']").value = data.logradouro || "";
          document.querySelector("input[name='bairro']").value = data.bairro || "";
          document.querySelector("input[name='cidade']").value = data.localidade || "Belém";
          setErros(prev => ({ ...prev, endereco: null, bairro: null, cidade: null }));
        }
      } catch (err) { console.error("Erro ao buscar CEP", err); }
    }
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
    const token = localStorage.getItem("tokenImobiliaria");
    const formData = new FormData();
    const inputs = formRef.current.querySelectorAll('input[name], select[name], textarea[name]');
    inputs.forEach(input => {
      let val = input.value;
      if (["preco", "valor_condominio", "iptu"].includes(input.name)) {
        val = val.replace(/\D/g, "") / 100;
      }
      formData.append(input.name, val);
    });
    formData.append("comodidades_condominio", comodidadesSelecionadas.join(","));
    if (fotoCapa) formData.append("galeria", fotoCapa);
    arquivosGaleria.forEach(arq => formData.append("galeria", arq));
    const url = imovelId ? `http://localhost:8000/api/imoveis/${imovelId}/` : "http://localhost:8000/api/imoveis/";
    const metodo = imovelId ? "PUT" : "POST";
    try {
      const resposta = await fetch(url, { method: metodo, headers: { "x-auth-token": token }, body: formData });
      if (resposta.ok) {
        alert(imovelId ? "Imóvel atualizado com sucesso!" : "Imóvel publicado com sucesso!");
        window.location.reload();
      } else {
        const d = await resposta.json();
        alert("Erro no servidor: " + d.erro);
      }
    } catch (err) {
      alert("Falha de conexão com o servidor.");
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
      if (arquivosGaleria.length < 10) novosErros.galeria = `Adicione pelo menos 10 fotos do imóvel. Você adicionou ${arquivosGaleria.length}.`;
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
        comodidades: comodidadesSelecionadas,
        totalFotos: arquivosGaleria.length,
      });
    }
    setEtapaAtual(prev => Math.min(prev + 1, 5));
  };

  const voltarEtapa = () => setEtapaAtual(prev => Math.max(prev - 1, 1));

  const labelClass = "block text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5";
  const inputClass = "w-full bg-[#080E1A] border border-slate-800 p-2.5 rounded-xl text-white text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium placeholder:text-slate-600";
  const erroClass = "text-red-400 text-[10px] font-semibold mt-1.5 flex items-center gap-1";

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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${ativo ? "bg-[#0F172A] border border-slate-700/80 shadow-md shadow-black/30" : "border border-transparent"} ${!ativo && !concluido ? "opacity-40" : ""}`}
            >
              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-200 ${ativo ? "bg-blue-600 text-white shadow-md shadow-blue-600/40" : concluido ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30" : "bg-slate-800/60 text-slate-500 border border-slate-700/50"}`}>
                {concluido ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                ) : num}
              </div>
              <div className="min-w-0">
                <p className={`text-[13px] font-bold leading-tight truncate ${ativo ? "text-white" : concluido ? "text-slate-400" : "text-slate-500"}`}>{passo.nome}</p>
                <p className={`text-[11px] leading-tight mt-0.5 ${ativo ? "text-blue-400" : "text-slate-600"}`}>{passo.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ÁREA DO FORMULÁRIO */}
      <div className="flex-1 bg-[#0F172A] rounded-2xl border border-slate-800/80 shadow-xl shadow-black/30 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between bg-[#0B1427]/60">
          <div>
            <h2 className="text-sm font-bold text-white">{imovelId ? "Editar Imóvel" : PASSOS[etapaAtual - 1].nome}</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">{PASSOS[etapaAtual - 1].desc}</p>
          </div>
          {imovelId && <span className="bg-amber-500/10 text-amber-400 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-500/20">Modo Edição</span>}
        </div>

        <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="flex-1 overflow-y-auto">
          <div className="p-5 md:p-6 space-y-5">

            {/* ── ETAPA 1: DADOS BÁSICOS ─────────────────────────────── */}
            <div className={etapaAtual === 1 ? "step-animate space-y-5" : "hidden"}>
              <div>
                <label className={`${labelClass} ${erros.titulo ? "text-red-400" : ""}`}>Título do Anúncio</label>
                <input name="titulo" type="text" placeholder="Ex: Apartamento moderno no Jardins..." className={`${inputClass} ${erros.titulo ? "border-red-500/60" : ""}`} onChange={() => setErros(prev => ({ ...prev, titulo: null }))} />
                {erros.titulo && <p className={erroClass}><span>⚠</span>{erros.titulo}</p>}
              </div>
              <div>
                <label className={`${labelClass} ${erros.descricao ? "text-red-400" : ""}`}>Descrição Detalhada</label>
                <textarea name="descricao" rows="3" placeholder="Descreva o imóvel com detalhes..." className={`${inputClass} ${erros.descricao ? "border-red-500/60" : ""}`} onChange={() => setErros(prev => ({ ...prev, descricao: null }))}></textarea>
                {erros.descricao && <p className={erroClass}><span>⚠</span>{erros.descricao}</p>}
              </div>
              <div className="grid grid-cols-3 gap-3">
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
              <div className="grid grid-cols-3 gap-3 bg-gradient-to-br from-[#080E1A] to-[#0B1427] p-4 rounded-xl border border-slate-800/60">
                {[
                  { name: "preco", label: "Preço", err: erros.preco },
                  { name: "valor_condominio", label: "Condomínio", err: erros.valor_condominio },
                  { name: "iptu", label: "IPTU (Anual)", err: erros.iptu },
                ].map(({ name, label, err }) => (
                  <div key={name}>
                    <label className={`${labelClass} ${err ? "text-red-400" : ""}`}>{label}</label>
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
                  <label className={`${labelClass} ${erros.capa ? "text-red-400" : ""}`}>Foto de Capa Principal</label>
                  {!previaCapa ? (
                    <div
                      onClick={() => capaInputRef.current.click()}
                      className={`cursor-pointer border border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all group ${erros.capa ? "border-red-500/60 bg-red-500/5" : "border-slate-700/60 bg-[#080E1A] hover:border-blue-500/60 hover:bg-blue-900/5"}`}
                    >
                      <input ref={capaInputRef} type="file" accept="image/*" onChange={(e) => { aoSelecionarCapa(e); setErros(prev => ({ ...prev, capa: null })); }} className="hidden" />
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${erros.capa ? "border-red-500/40 bg-red-500/10 text-red-400" : "border-slate-700 bg-slate-800/60 text-slate-400 group-hover:border-blue-500/40 group-hover:text-blue-400"}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs font-semibold ${erros.capa ? "text-red-400" : "text-slate-300"}`}>{imovelId ? "Clique para alterar a foto de capa" : "Selecionar foto de capa"}</p>
                        <p className="text-[10px] text-slate-500 mt-1">JPG, PNG — Será exibida como thumbnail principal</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-slate-800 shadow-xl group">
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
                <div className="border-t border-slate-800/60 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <label className={`${labelClass} ${erros.galeria ? "text-red-400" : ""}`}>Galeria do Imóvel</label>
                      <p className="text-[10px] text-slate-500">Mínimo de 10 fotos · JPG, PNG · Máx. 20 fotos</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${arquivosGaleria.length >= 10 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
                      {arquivosGaleria.length}/20
                    </span>
                  </div>

                  {previasGaleria.length === 0 ? (
                    <div
                      onClick={() => galeriaInputRef.current.click()}
                      className={`cursor-pointer border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 transition-all group ${erros.galeria ? "border-red-500/50 bg-red-500/5" : "border-slate-700/50 bg-[#080E1A] hover:border-blue-500/50 hover:bg-blue-900/5"}`}
                    >
                      <input ref={galeriaInputRef} type="file" accept="image/*" multiple onChange={aoSelecionarGaleria} className="hidden" />
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${erros.galeria ? "border-red-500/40 bg-red-500/10 text-red-400" : "border-slate-700 bg-slate-800/50 text-slate-400 group-hover:border-blue-500/50 group-hover:text-blue-400 group-hover:bg-blue-900/10"}`}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" x2="12" y1="3" y2="15" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-bold ${erros.galeria ? "text-red-400" : "text-slate-200"}`}>Arraste suas fotos aqui</p>
                        <p className={`text-xs mt-1 ${erros.galeria ? "text-red-400/70" : "text-slate-500"}`}>Ou clique para selecionar arquivos do seu computador</p>
                      </div>
                      <button type="button" className={`px-5 py-2 rounded-full text-xs font-semibold border transition-all ${erros.galeria ? "border-red-500/40 text-red-400 hover:bg-red-500/10" : "border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"}`}>
                        Selecionar Fotos
                      </button>
                      <p className="text-[10px] text-slate-600">Formatos aceitos: JPG, PNG. Máximo de 20 fotos.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
                        {previasGaleria.map((src, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-800 group">
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
                          <div onClick={() => galeriaInputRef.current.click()} className="aspect-square rounded-lg border-2 border-dashed border-slate-700/60 bg-[#080E1A] hover:border-blue-500/50 hover:bg-blue-900/5 cursor-pointer flex flex-col items-center justify-center gap-1 transition-all group">
                            <input ref={galeriaInputRef} type="file" accept="image/*" multiple onChange={aoSelecionarGaleria} className="hidden" />
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500 group-hover:text-blue-400 transition-colors"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                            <span className="text-[9px] text-slate-500 group-hover:text-blue-400 font-bold uppercase tracking-wide transition-colors">Adicionar</span>
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
                      <label className={`${labelClass} ${erros[campo] ? "text-red-400" : ""}`}>{LABELS_CAMPOS[campo]}</label>
                      <div className="relative">
                        <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${erros[campo] ? "text-red-400" : "text-slate-500"}`}>{ICONES_CAMPOS[campo]}</div>
                        <input name={campo} type="number" min="0" onChange={() => setErros(prev => ({ ...prev, [campo]: null }))} className={`${inputClass} pl-8 ${erros[campo] ? "border-red-500/60" : ""}`} />
                      </div>
                      {erros[campo] && <p className={erroClass}><span>⚠</span>{erros[campo]}</p>}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`${labelClass} ${erros.comodidades ? "text-red-400" : ""}`}>Comodidades</label>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${comodidadesSelecionadas.length >= 3 ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"}`}>
                      {comodidadesSelecionadas.length} selecionadas
                    </span>
                  </div>
                  {erros.comodidades && <p className={`${erroClass} mb-2`}><span>⚠</span>{erros.comodidades}</p>}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 bg-[#080E1A] p-4 rounded-xl border border-slate-800/60">
                    {LISTA_COMODIDADES.map((item) => {
                      const sel = comodidadesSelecionadas.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => { alternarComodidade(item); setErros(prev => ({ ...prev, comodidades: null })); }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-wide transition-all text-left border ${sel ? "bg-blue-600/10 border-blue-500/30 text-blue-400" : "bg-slate-800/40 border-slate-700/40 text-slate-500 hover:border-slate-600 hover:text-slate-300"}`}
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
                    <label className={`${labelClass} ${erros.cep ? "text-red-400" : ""}`}>CEP</label>
                    <input name="cep" type="text" maxLength="9" onChange={(e) => { handleCepChange(e); setErros(prev => ({ ...prev, cep: null })); }} className={`${inputClass} ${erros.cep ? "border-red-500/60" : ""}`} placeholder="00000-000" />
                    {erros.cep && <p className={erroClass}><span>⚠</span>{erros.cep}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className={`${labelClass} ${erros.endereco ? "text-red-400" : ""}`}>Rua / Avenida</label>
                    <input name="endereco" type="text" onChange={() => setErros(prev => ({ ...prev, endereco: null }))} className={`${inputClass} ${erros.endereco ? "border-red-500/60" : ""}`} />
                    {erros.endereco && <p className={erroClass}><span>⚠</span>{erros.endereco}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className={`${labelClass} ${erros.numero ? "text-red-400" : ""}`}>Número</label>
                    <input name="numero" type="text" onChange={() => setErros(prev => ({ ...prev, numero: null }))} className={`${inputClass} ${erros.numero ? "border-red-500/60" : ""}`} />
                    {erros.numero && <p className={erroClass}><span>⚠</span>{erros.numero}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Complemento <span className="text-slate-600 normal-case">(opcional)</span></label>
                    <input name="complemento" type="text" placeholder="Apto, Bloco..." className={inputClass} />
                  </div>
                  <div>
                    <label className={`${labelClass} ${erros.bairro ? "text-red-400" : ""}`}>Bairro</label>
                    <input name="bairro" type="text" onChange={() => setErros(prev => ({ ...prev, bairro: null }))} className={`${inputClass} ${erros.bairro ? "border-red-500/60" : ""}`} />
                    {erros.bairro && <p className={erroClass}><span>⚠</span>{erros.bairro}</p>}
                  </div>
                  <div>
                    <label className={`${labelClass} ${erros.cidade ? "text-red-400" : ""}`}>Cidade</label>
                    <input name="cidade" type="text" onChange={() => setErros(prev => ({ ...prev, cidade: null }))} className={`${inputClass} ${erros.cidade ? "border-red-500/60" : ""}`} />
                    {erros.cidade && <p className={erroClass}><span>⚠</span>{erros.cidade}</p>}
                  </div>
                </div>
            </div>

            {/* ── ETAPA 5: REVISÃO ───────────────────────────────────── */}
            <div className={etapaAtual === 5 ? "step-animate space-y-3" : "hidden"}>
                <div className="text-center pb-2">
                  <h3 className="text-base font-bold text-white">Revise antes de publicar</h3>
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">1 foto de capa + {resumoDados.totalFotos || 0} fotos da galeria</p>
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
                        <div key={label} className="bg-[#080E1A] rounded-lg p-2.5 flex items-center gap-2 border border-slate-800/60">
                          <span className="text-blue-400/60 shrink-0">{icon}</span>
                          <div>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">{label}</p>
                            <p className="text-white font-bold text-xs">{valor}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {resumoDados.comodidades?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800/60">
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wide mb-2">Comodidades</p>
                        <div className="flex flex-wrap gap-1">
                          {resumoDados.comodidades.map(item => (
                            <span key={item} className="bg-blue-600/10 text-blue-400 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border border-blue-500/20">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </ResumoCard>

                  <ResumoCard titulo="Localização" onEdit={() => setEtapaAtual(4)}>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400/60 shrink-0 mt-0.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        <div>
                          <p className="text-white text-xs font-bold">{resumoDados.endereco}, {resumoDados.numero} {resumoDados.complemento && `- ${resumoDados.complemento}`}</p>
                          <p className="text-slate-400 text-[10px] mt-0.5">{resumoDados.bairro} · {resumoDados.cidade}</p>
                          <p className="text-slate-500 text-[10px] mt-1 font-mono">CEP: {resumoDados.cep}</p>
                        </div>
                      </div>
                    </div>
                  </ResumoCard>
                </div>
            </div>
          </div>

          {/* Botões de navegação */}
          <div className="px-5 md:px-6 pb-5 pt-3 border-t border-slate-800/60 flex gap-3 bg-[#0B1427]/40">
            {etapaAtual > 1 && (
              <button type="button" onClick={voltarEtapa} className="flex-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wide transition-all border border-slate-700/50">
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
    <div className="bg-[#080E1A] border border-slate-800/60 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800/60">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{titulo}</h4>
        <button type="button" onClick={onEdit} className="text-blue-400 hover:text-blue-300 text-[10px] font-semibold flex items-center gap-1.5 transition-colors">
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
      <p className={`text-sm font-bold ${destaque ? "text-emerald-400" : "text-white"}`}>{valor || "—"}</p>
    </div>
  );
}

// ─── Lista Imóveis ─────────────────────────────────────────────────────────
function ListaImoveis({ aoEditar }) {
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const alternarStatus = async (id) => {
    const token = localStorage.getItem("tokenImobiliaria");
    try {
      const resposta = await fetch(`http://localhost:8000/api/imoveis/${id}/`, { method: "PATCH", headers: { "x-auth-token": token } });
      if (resposta.ok) {
        setImoveis(prev => prev.map(imovel => imovel.id === id ? { ...imovel, ativo: !imovel.ativo } : imovel));
      }
    } catch (erro) {
      alert("Erro ao alterar status do imóvel.");
    }
  };

  useEffect(() => {
    const buscarImoveis = async () => {
      try {
        const resposta = await fetch("http://localhost:8000/api/imoveis/lista/");
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
    <div className="bg-[#0F172A] p-5 md:p-8 rounded-2xl border border-slate-800/80 shadow-xl shadow-black/40">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-bold text-white tracking-tight">Meus Imóveis</h2>
        <span className="bg-blue-900/30 text-blue-400 py-1 px-3 rounded-full text-xs font-bold border border-blue-500/20">{imoveis.length} anúncios</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {imoveis.map((imovel) => (
          <div key={imovel.id} className={`bg-[#080E1A] border border-slate-800 rounded-xl overflow-hidden transition-all group ${imovel.ativo ? "hover:border-blue-500/40" : "opacity-60 grayscale hover:grayscale-0"}`}>
            <div className="aspect-video bg-[#0F172A] relative overflow-hidden">
              {imovel.capa ? (
                <img src={imovel.capa} alt={imovel.titulo} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-600 text-xs font-bold uppercase">Sem Foto</div>
              )}
              <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[9px] px-2.5 py-1 rounded font-bold uppercase tracking-widest">{imovel.finalidade}</div>
              {!imovel.ativo && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0B1120]/80 backdrop-blur-sm">
                  <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-widest shadow-2xl">Inativo</span>
                </div>
              )}
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-white font-bold truncate text-sm">{imovel.titulo}</h3>
                <p className="text-slate-400 text-xs mt-0.5">{imovel.tipo_imovel} · {imovel.bairro}</p>
              </div>
              <div className={`font-bold text-base ${imovel.ativo ? "text-blue-400" : "text-slate-500"}`}>
                R$ {Number(imovel.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
                <button onClick={() => aoEditar(imovel.id)} disabled={!imovel.ativo} className="bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wide disabled:opacity-30 disabled:cursor-not-allowed">
                  Editar
                </button>
                <button onClick={() => alternarStatus(imovel.id)} className={`${imovel.ativo ? "bg-slate-800 hover:bg-red-600 border border-slate-700 hover:border-red-500 text-slate-300 hover:text-white" : "bg-blue-900/30 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20"} py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wide`}>
                  {imovel.ativo ? "Inativar" : "Reativar"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {imoveis.length === 0 && (
        <div className="text-center py-20 text-slate-500 border border-dashed border-slate-700/50 rounded-xl">
          Nenhum imóvel cadastrado ainda.
        </div>
      )}
    </div>
  );
}

// ─── Lista Leads ───────────────────────────────────────────────────────────
function ListaLeads() {
  const [leads, setLeads] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => { buscarLeads(); }, []);

  const buscarLeads = async () => {
    try {
      const resposta = await fetch("http://localhost:8000/api/leads/");
      if (resposta.ok) setLeads(await resposta.json());
    } catch (erro) {
      console.error("Erro ao buscar leads:", erro);
    } finally {
      setCarregando(false);
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    const token = localStorage.getItem("tokenImobiliaria");
    try {
      const resposta = await fetch(`http://localhost:8000/api/leads/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ status: novoStatus })
      });
      if (resposta.ok) setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: novoStatus } : lead));
    } catch (erro) { alert("Erro ao atualizar status."); }
  };

  const abrirWhatsApp = (telefone, nome, imovel) => {
    const numeroLimpo = telefone.replace(/\D/g, "");
    const texto = `Olá, ${nome}! Sou o corretor da Imobi e vi que você se interessou pelo anúncio do ${imovel}. Como posso te ajudar?`;
    window.open(`https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(texto)}`, "_blank");
  };

  const getStatusCor = (status) => {
    switch (status) {
      case "novo": return "bg-blue-500/15 text-blue-400 border-blue-500/20";
      case "atendimento": return "bg-amber-500/15 text-amber-400 border-amber-500/20";
      case "fechado": return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
      case "perdido": return "bg-red-500/15 text-red-400 border-red-500/20";
      default: return "bg-slate-500/15 text-slate-400 border-slate-500/20";
    }
  };

  if (carregando) return <div className="text-center py-20 text-blue-500 animate-pulse font-bold tracking-widest">CARREGANDO CLIENTES...</div>;

  return (
    <div className="bg-[#0F172A] p-5 md:p-8 rounded-2xl border border-slate-800/80 shadow-xl shadow-black/40">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-bold text-white tracking-tight">Gestão de Leads</h2>
        <span className="bg-[#1E293B] text-blue-400 py-1 px-3 rounded-full text-xs font-bold border border-blue-500/20">{leads.length} contatos</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 text-[9px] uppercase tracking-widest text-slate-500">
              <th className="pb-3 font-bold pl-4">Cliente</th>
              <th className="pb-3 font-bold">Interesse</th>
              <th className="pb-3 font-bold">Data</th>
              <th className="pb-3 font-bold">Status</th>
              <th className="pb-3 font-bold pr-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {leads.map(lead => (
              <tr key={lead.id} className="hover:bg-slate-800/20 transition-colors group">
                <td className="py-4 pl-4">
                  <p className="font-bold text-white text-sm">{lead.nome}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{lead.telefone}</p>
                  <p className="text-[10px] text-slate-500 mt-1 truncate max-w-[200px] italic opacity-0 group-hover:opacity-100 transition-opacity">"{lead.mensagem}"</p>
                </td>
                <td className="py-4">
                  <span className="bg-slate-800/60 border border-slate-700/50 text-slate-300 text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded">{lead.imovel_titulo}</span>
                </td>
                <td className="py-4 text-xs text-slate-400">{lead.data_criacao}</td>
                <td className="py-4">
                  <select
                    value={lead.status}
                    onChange={(e) => atualizarStatus(lead.id, e.target.value)}
                    className={`text-[10px] font-bold uppercase tracking-wide rounded px-2.5 py-1.5 outline-none cursor-pointer border transition-colors ${getStatusCor(lead.status)}`}
                  >
                    <option value="novo" className="bg-[#0F172A] text-slate-200">Novo Contato</option>
                    <option value="atendimento" className="bg-[#0F172A] text-slate-200">Em Atendimento</option>
                    <option value="fechado" className="bg-[#0F172A] text-slate-200">Venda Fechada</option>
                    <option value="perdido" className="bg-[#0F172A] text-slate-200">Perdido</option>
                  </select>
                </td>
                <td className="py-4 pr-4 text-right">
                  <button
                    onClick={() => abrirWhatsApp(lead.telefone, lead.nome, lead.imovel_titulo)}
                    className="bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wide inline-flex items-center gap-1.5 border border-green-600/20 hover:border-green-600"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                    Responder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <div className="text-slate-500 text-center py-20 italic border border-dashed border-slate-700/50 rounded-xl mt-4">
            Nenhum contato recebido ainda.
          </div>
        )}
      </div>
    </div>
  );
}