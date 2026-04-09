"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("inicio");
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
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-slate-200 flex-col md:flex-row font-sans antialiased">
      

      <aside className={`${menuAberto ? "flex" : "hidden"} md:flex w-full md:w-64 bg-[#111] border-r border-white/5 p-8 flex-col shrink-0`}>
        <h2 className="hidden md:block text-xl font-bold text-orange-600 mb-12 tracking-widest text-center uppercase italic">Imobi.Admin</h2>
        
        <nav className="flex-1 space-y-2">
          <button 

            onClick={() => { setAbaAtiva("cadastrar"); setImovelEditando(null); setMenuAberto(false); }} 
            className={`w-full text-left p-4 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all ${abaAtiva === "cadastrar" && !imovelEditando ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "hover:bg-white/5 text-slate-500"}`}
          >
            Cadastrar Imóvel
          </button>
          <button 
            onClick={() => { setAbaAtiva("meus_imoveis"); setMenuAberto(false); }} 
            className={`w-full text-left p-4 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all ${abaAtiva === "meus_imoveis" ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "hover:bg-white/5 text-slate-500"}`}
          >
            Meus Imóveis
          </button>
          <button 
            onClick={() => { setAbaAtiva("leads"); setMenuAberto(false); }} 
            className={`w-full text-left p-4 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all ${abaAtiva === "leads" ? "bg-orange-600 text-white" : "hover:bg-white/5 text-slate-500"}`}
          >
            Clientes (Leads)
          </button>
        </nav>

        <button onClick={fazerLogout} className="mt-12 md:mt-auto p-4 text-red-500 hover:bg-red-500/10 rounded-xl text-[10px] font-bold text-left uppercase tracking-[0.2em]">
          Sair do Sistema
        </button>
      </aside>


      <main className="flex-1 p-4 md:p-12 overflow-y-auto bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto"> 
          {abaAtiva === "inicio" && (
            <div className="bg-[#151515] p-10 rounded-3xl border border-white/5 shadow-2xl">
              <h1 className="text-2xl font-bold text-white mb-4 tracking-tight">Painel de Gestão</h1>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">Bem-vindo ao sistema. Escolha uma opção no menu lateral para começar.</p>
            </div>
          )}
          

          {abaAtiva === "cadastrar" && <FormularioNovoImovel imovelId={imovelEditando} />}
          

          {abaAtiva === "meus_imoveis" && <ListaImoveis aoEditar={iniciarEdicao} />}
          
          {abaAtiva === "leads" && <ListaLeads />}
        </div>
      </main>
    </div>
  );
}

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

  const LISTA_COMODIDADES = [
    "Piscina", "Academia", "Churrasqueira", "Salão de Festas", "Playground", 
    "Brinquedoteca", "Portaria 24h", "Elevador", "Varanda / Sacada", 
    "Ar Condicionado", "Mobiliado", "Closet", "Escritório", "Piso Porcelanato", 
    "SPA / Sauna", "Quadra Tênis", "Pet Friendly", "Jardim", "Área de Serviço",
    "Cozinha Americana", "Interfone", "Portão Eletrônico", "Sistema de Segurança", "Gerador"
  ];

  const passos = ["Dados Básicos", "Imagens", "Detalhes", "Endereço"];

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
                const campos = ["titulo", "descricao", "tipo_imovel", "tipo_finalidade", "finalidade", "area_util", "quartos", "suites", "banheiros", "vagas", "bairro", "endereco", "cidade"];
                campos.forEach(campo => {
                  const input = formRef.current.querySelector(`[name="${campo}"]`);
                  if (input && dados[campo] !== null) {
                    input.value = dados[campo];
                  }
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
        }
      } catch (err) {
        console.error("Erro ao buscar CEP", err);
      }
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

  const enviarFormulario = async () => {
    if (!imovelId && !fotoCapa) return alert("A foto de capa é obrigatória.");
    
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

    const url = imovelId 
      ? `http://localhost:8000/api/imoveis/${imovelId}/` 
      : "http://localhost:8000/api/imoveis/";
    const metodo = imovelId ? "PUT" : "POST";

    try {
      const resposta = await fetch(url, {
        method: metodo,
        headers: { "x-auth-token": token },
        body: formData,
      });

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

  const avancarEtapa = () => setEtapaAtual(prev => Math.min(prev + 1, 4));
  const voltarEtapa = () => setEtapaAtual(prev => Math.max(prev - 1, 1));

  const labelClass = "block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2";
  const inputClass = "w-full bg-[#111] border border-white/10 p-4 rounded-xl text-white text-sm outline-none focus:border-orange-600 transition-all font-medium placeholder:text-slate-800";

  if (carregandoDados) {
    return <div className="text-center py-20 text-orange-500 animate-pulse font-bold tracking-widest uppercase">Puxando dados do imóvel...</div>;
  }

  return (
    <div className="bg-[#151515] p-6 md:p-12 rounded-[40px] border border-white/5 shadow-2xl">
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight">
          {imovelId ? "Editar Imóvel" : "Cadastro de Imóvel"}
        </h2>
        {imovelId && <span className="bg-orange-600/20 text-orange-500 py-1 px-3 rounded-md text-xs font-bold uppercase tracking-widest">Modo Edição (ID: {imovelId})</span>}
      </div>

      <div className="flex justify-between items-center mb-12 relative">
        <div className="absolute left-0 top-1/2 w-full h-px bg-white/5 -z-10"></div>
        {passos.map((passo, idx) => {
          const num = idx + 1;
          const ativo = etapaAtual >= num;
          return (
            <div key={num} className="flex flex-col items-center gap-3 bg-[#151515] px-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${ativo ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30" : "bg-black border border-white/10 text-slate-600"}`}>
                {num}
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-bold ${ativo ? "text-orange-500" : "text-slate-600"}`}>{passo}</span>
            </div>
          );
        })}
      </div>
      
      <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="space-y-12">
        {/* ETAPA 1 */}
        <div className={etapaAtual === 1 ? "space-y-8 animate-in fade-in duration-500" : "hidden"}>
          <div>
            <label className={labelClass}>Título do Anúncio</label>
            <input name="titulo" type="text" className={`${inputClass} text-base font-bold`} />
          </div>
          <div>
            <label className={labelClass}>Descrição Detalhada</label>
            <textarea name="descricao" rows="5" className={inputClass}></textarea>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Tipo</label>
              <select name="tipo_imovel" className={inputClass}>
                <option value="Apartamento">Apartamento</option>
                <option value="Casa">Casa</option>
                <option value="Terreno">Terreno</option>
                <option value="Sala Comercial">Sala Comercial</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Uso</label>
              <select name="tipo_finalidade" className={inputClass}>
                <option value="Residencial">Residencial</option>
                <option value="Comercial">Comercial</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Negócio</label>
              <select name="finalidade" className={inputClass}>
                <option value="Venda">Venda</option>
                <option value="Locação">Locação</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-black/20 p-8 rounded-3xl border border-white/5">
            <div>
              <label className={labelClass}>Preço</label>
              <input name="preco" type="text" value={valores.preco} onChange={handleChangeDinheiro} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Condomínio</label>
              <input name="valor_condominio" type="text" value={valores.valor_condominio} onChange={handleChangeDinheiro} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>IPTU (Anual)</label>
              <input name="iptu" type="text" value={valores.iptu} onChange={handleChangeDinheiro} className={inputClass} />
            </div>
          </div>
        </div>

        <div className={etapaAtual === 2 ? "space-y-10 animate-in fade-in duration-500 text-center" : "hidden"}>
          <div className="space-y-4">
            <label className={labelClass}>Atualizar Capa (Opcional na edição)</label>
            <div 
              onClick={() => capaInputRef.current.click()}
              className={`cursor-pointer border border-dashed rounded-2xl p-10 transition-all flex flex-col items-center justify-center ${previaCapa ? 'border-orange-600 bg-orange-600/5' : 'border-white/10 bg-black/30 hover:border-orange-600'}`}
            >
              <input ref={capaInputRef} type="file" accept="image/*" onChange={aoSelecionarCapa} className="hidden" />
              {previaCapa ? (
                <div className="relative w-full max-w-lg mx-auto aspect-video rounded-xl overflow-hidden border border-orange-600 shadow-2xl shadow-orange-900/20">
                  <img src={previaCapa} className="w-full h-full object-cover" alt="Capa" />
                </div>
              ) : (
                <span className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">{imovelId ? "Deixe em branco para manter a foto atual" : "Selecionar Foto Principal"}</span>
              )}
            </div>
          </div>
        </div>

        <div className={etapaAtual === 3 ? "space-y-12 animate-in fade-in duration-500" : "hidden"}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <label className={labelClass}>Área (m²)</label>
              <input name="area_util" type="number" className={inputClass} />
            </div>
            {["quartos", "suites", "banheiros", "vagas"].map((campo) => (
              <div key={campo}>
                <label className={labelClass}>{campo}</label>
                <input name={campo} type="number" className={inputClass} />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <label className={labelClass}>Comodidades</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 bg-black/20 p-8 rounded-3xl border border-white/5">
              {LISTA_COMODIDADES.map((item) => (
                <label key={item} className="flex items-center space-x-3 cursor-pointer group">
                  <div 
                    onClick={() => alternarComodidade(item)}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${
                      comodidadesSelecionadas.includes(item) 
                      ? "bg-orange-600 border-orange-600" 
                      : "border-white/20 bg-white/5"
                    }`}
                  >
                    {comodidadesSelecionadas.includes(item) && (<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6L9 17L4 12"/></svg>)}
                  </div>
                  <span className={`text-[11px] font-bold uppercase ${comodidadesSelecionadas.includes(item) ? "text-orange-500" : "text-slate-500"}`}>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className={etapaAtual === 4 ? "space-y-8 animate-in fade-in duration-500" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>CEP</label>
              <input type="text" maxLength="9" onChange={handleCepChange} className={inputClass} placeholder="00000-000" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Endereço (Rua/Avenida)</label>
              <input name="endereco" type="text" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Número / Compl.</label>
              <input name="numero" type="text" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Bairro</label>
              <input name="bairro" type="text" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Cidade</label>
              <input name="cidade" type="text" className={inputClass} />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-10 border-t border-white/5">
          {etapaAtual > 1 && (
            <button type="button" onClick={voltarEtapa} className="flex-1 bg-black hover:bg-white/5 text-white font-bold py-6 rounded-2xl text-xs uppercase transition-all">Voltar</button>
          )}
          {etapaAtual < 4 ? (
            <button type="button" onClick={avancarEtapa} className="flex-[2] bg-slate-800 hover:bg-slate-700 text-white font-bold py-6 rounded-2xl text-xs uppercase transition-all">Avançar</button>
          ) : (
            <button type="button" onClick={enviarFormulario} disabled={salvando} className="flex-[2] bg-orange-600 hover:bg-orange-500 text-white font-bold py-6 rounded-2xl text-xs uppercase transition-all disabled:opacity-50">
              {salvando ? "Salvando..." : imovelId ? "Salvar Alterações" : "Finalizar Cadastro"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function ListaImoveis({ aoEditar }) {
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const alternarStatus = async (id) => {
    const token = localStorage.getItem("tokenImobiliaria");
    try {
      const resposta = await fetch(`http://localhost:8000/api/imoveis/${id}/`, {
        method: "PATCH",
        headers: { "x-auth-token": token }
      });
      if (resposta.ok) {
        setImoveis(prev => prev.map(imovel => 
          imovel.id === id ? { ...imovel, ativo: !imovel.ativo } : imovel
        ));
      }
    } catch (erro) {
      alert("Erro ao alterar status do imóvel.");
    }
  };

  useEffect(() => {
    const buscarImoveis = async () => {
      try {
        const resposta = await fetch("http://localhost:8000/api/imoveis/lista/");
        if (resposta.ok) {
          const dados = await resposta.json();
          setImoveis(dados);
        }
      } catch (erro) {
        console.error("Erro ao buscar imóveis:", erro);
      } finally {
        setCarregando(false);
      }
    };
    buscarImoveis();
  }, []);

  if (carregando) return <div className="text-center py-20 text-orange-500 animate-pulse font-bold tracking-widest">CARREGANDO BASE DE DADOS...</div>;

  return (
    <div className="bg-[#151515] p-6 md:p-12 rounded-[40px] border border-white/5 shadow-2xl animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-bold text-white tracking-tight">Meus Imóveis</h2>
        <span className="bg-orange-600/20 text-orange-500 py-1 px-4 rounded-full text-xs font-bold">{imoveis.length} Anúncios</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {imoveis.map((imovel) => (
          <div key={imovel.id} className={`bg-black/40 border border-white/5 rounded-2xl overflow-hidden transition-all group ${imovel.ativo ? 'hover:border-orange-500/30' : 'opacity-60 grayscale hover:grayscale-0'}`}>
            <div className="aspect-video bg-[#111] relative overflow-hidden">
              {imovel.capa ? (
                <img src={imovel.capa} alt={imovel.titulo} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-700 text-xs font-bold uppercase">Sem Foto</div>
              )}
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-[10px] px-3 py-1 rounded-md font-bold uppercase tracking-widest">{imovel.finalidade}</div>
              
              {/* TAG DE INATIVO */}
              {!imovel.ativo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-[0.2em] shadow-2xl">Inativo</span>
                </div>
              )}
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-white font-bold truncate text-sm" title={imovel.titulo}>{imovel.titulo}</h3>
                <p className="text-slate-500 text-xs mt-1">{imovel.tipo_imovel} • {imovel.bairro}</p>
              </div>
              <div className={`font-bold text-lg ${imovel.ativo ? 'text-orange-500' : 'text-slate-500'}`}>
                R$ {Number(imovel.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                <button 
                  onClick={() => aoEditar(imovel.id)} 
                  disabled={!imovel.ativo}
                  className="bg-white/5 hover:bg-orange-600 text-slate-300 hover:text-white py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Editar
                </button>
                <button 
                  onClick={() => alternarStatus(imovel.id)}
                  className={`${imovel.ativo ? 'bg-white/5 hover:bg-red-600 text-slate-300' : 'bg-orange-600/20 hover:bg-orange-600 text-orange-500'} hover:text-white py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest`}
                >
                  {imovel.ativo ? 'Inativar' : 'Reativar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListaLeads() {
  const [leads, setLeads] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarLeads();
  }, []);

  const buscarLeads = async () => {
    try {
      const resposta = await fetch("http://localhost:8000/api/leads/");
      if (resposta.ok) {
        const dados = await resposta.json();
        setLeads(dados);
      }
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
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
        body: JSON.stringify({ status: novoStatus })
      });
      if (resposta.ok) {
        setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: novoStatus } : lead));
      }
    } catch (erro) {
      alert("Erro ao atualizar status.");
    }
  };

  const abrirWhatsApp = (telefone, nome, imovel) => {
    const numeroLimpo = telefone.replace(/\D/g, "");
    // Monta a mensagem mágica
    const texto = `Olá, ${nome}! Sou o corretor da Imobi e vi que você se interessou pelo anúncio do ${imovel}. Como posso te ajudar?`;
    window.open(`https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(texto)}`, '_blank');
  };

  const getStatusCor = (status) => {
    switch(status) {
      case 'novo': return 'bg-blue-500/20 text-blue-500';
      case 'atendimento': return 'bg-amber-500/20 text-amber-500';
      case 'fechado': return 'bg-emerald-500/20 text-emerald-500';
      case 'perdido': return 'bg-red-500/20 text-red-500';
      default: return 'bg-slate-500/20 text-slate-500';
    }
  };

  if (carregando) return <div className="text-center py-20 text-orange-500 animate-pulse font-bold tracking-widest">CARREGANDO CLIENTES...</div>;

  return (
    <div className="bg-[#151515] p-6 md:p-12 rounded-[40px] border border-white/5 shadow-2xl animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-bold text-white tracking-tight">Gestão de Clientes (Leads)</h2>
        <span className="bg-orange-600/20 text-orange-500 py-1 px-4 rounded-full text-xs font-bold">{leads.length} Contatos</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-slate-500">
              <th className="pb-4 font-bold pl-4">Cliente / Contato</th>
              <th className="pb-4 font-bold">Interesse</th>
              <th className="pb-4 font-bold">Data</th>
              <th className="pb-4 font-bold">Status</th>
              <th className="pb-4 font-bold pr-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leads.map(lead => (
              <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="py-5 pl-4">
                  <p className="font-bold text-white text-sm">{lead.nome}</p>
                  <p className="text-xs text-slate-400 mt-1">{lead.telefone}</p>
                  <p className="text-[10px] text-slate-500 mt-2 truncate max-w-[200px] italic opacity-0 group-hover:opacity-100 transition-opacity" title={lead.mensagem}>"{lead.mensagem}"</p>
                </td>
                <td className="py-5">
                  <span className="bg-[#111] border border-white/5 text-slate-300 text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-md">
                    {lead.imovel_titulo}
                  </span>
                </td>
                <td className="py-5 text-xs text-slate-400 font-medium">
                  {lead.data_criacao}
                </td>
                <td className="py-5">
                  <select 
                    value={lead.status}
                    onChange={(e) => atualizarStatus(lead.id, e.target.value)}
                    className={`text-[10px] font-bold uppercase tracking-wider rounded-md px-3 py-1.5 border-none outline-none cursor-pointer appearance-none transition-colors ${getStatusCor(lead.status)}`}
                  >
                    <option value="novo" className="bg-[#111] text-white">Novo Contato</option>
                    <option value="atendimento" className="bg-[#111] text-white">Em Atendimento</option>
                    <option value="fechado" className="bg-[#111] text-white">Venda Fechada</option>
                    <option value="perdido" className="bg-[#111] text-white">Perdido</option>
                  </select>
                </td>
                <td className="py-5 pr-4 text-right">
                  <button 
                    onClick={() => abrirWhatsApp(lead.telefone, lead.nome, lead.imovel_titulo)}
                    className="bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white px-4 py-2 rounded-lg text-[10px] font-bold transition-all uppercase tracking-widest inline-flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    Responder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {leads.length === 0 && (
          <div className="text-slate-600 text-center py-24 font-medium italic border border-dashed border-white/10 rounded-2xl mt-4">
            Nenhum contato recebido ainda.
          </div>
        )}
      </div>
    </div>
  );
}