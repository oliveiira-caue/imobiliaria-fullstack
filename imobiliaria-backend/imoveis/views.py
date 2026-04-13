import os
import json
from groq import Groq
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from .models import Imovel, ImagemImovel, Lead

# -------------------------------------------------------------------
# VIEWS DE IMÓVEIS
# -------------------------------------------------------------------
class ImovelCriarView(APIView):
    def post(self, request, *args, **kwargs):
        dados = request.data
        try:
            imovel = Imovel.objects.create(
                titulo=dados.get('titulo'),
                descricao=dados.get('descricao'),
                tipo_imovel=dados.get('tipo_imovel'),
                tipo_finalidade=dados.get('tipo_finalidade'),
                finalidade=dados.get('finalidade'),
                preco=dados.get('preco'),
                valor_condominio=dados.get('valor_condominio') or 0,
                iptu=dados.get('iptu') or 0,
                area_util=dados.get('area_util'),
                quartos=dados.get('quartos') or 0,
                suites=dados.get('suites') or 0,
                banheiros=dados.get('banheiros') or 0,
                vagas=dados.get('vagas') or 0,
                bairro=dados.get('bairro'),
                endereco=dados.get('endereco'),
                numero=dados.get('numero', ''),
                complemento=dados.get('complemento', ''),
                cep=dados.get('cep', ''),
                cidade=dados.get('cidade', 'Belém'),
                latitude=dados.get('latitude') or None,
                longitude=dados.get('longitude') or None,
                comodidades_condominio=dados.get('comodidades_condominio', '')
            )

            imagens = request.FILES.getlist('galeria')
            for index, img in enumerate(imagens):
                eh_capa = (index == 0) 
                ImagemImovel.objects.create(imovel=imovel, imagem=img, is_capa=eh_capa)

            return Response({"mensagem": "Imóvel e fotos salvos com sucesso!", "id": imovel.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"erro": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ImovelListaView(APIView):
    def get(self, request):
        imoveis = Imovel.objects.all().order_by('-id')
        dados_imoveis = []

        for imovel in imoveis:
            capa = ImagemImovel.objects.filter(imovel=imovel, is_capa=True).first()
            url_capa = request.build_absolute_uri(capa.imagem.url) if (capa and capa.imagem) else None

            dados_imoveis.append({
                "id": imovel.id,
                "titulo": imovel.titulo,
                "tipo_imovel": imovel.tipo_imovel,
                "finalidade": imovel.finalidade,
                "bairro": imovel.bairro,
                "preco": imovel.preco,
                "capa": url_capa,
                "ativo": imovel.ativo 
            })
        return Response(dados_imoveis, status=status.HTTP_200_OK)

class ImovelDetalhesView(APIView):
    def get(self, request, pk):
        imovel = get_object_or_404(Imovel, pk=pk)

        capa_obj = ImagemImovel.objects.filter(imovel=imovel, is_capa=True).first()
        galeria_objs = ImagemImovel.objects.filter(imovel=imovel, is_capa=False).order_by('criado_em')

        capa_url = request.build_absolute_uri(capa_obj.imagem.url) if (capa_obj and capa_obj.imagem) else None
        galeria_urls = [
            {"id": img.id, "url": request.build_absolute_uri(img.imagem.url)}
            for img in galeria_objs if img.imagem
        ]

        dados = {
            "id": imovel.id,
            "titulo": imovel.titulo,
            "descricao": imovel.descricao,
            "tipo_imovel": imovel.tipo_imovel,
            "tipo_finalidade": imovel.tipo_finalidade,
            "finalidade": imovel.finalidade,
            "preco": imovel.preco,
            "valor_condominio": imovel.valor_condominio,
            "iptu": imovel.iptu,
            "area_util": imovel.area_util,
            "quartos": imovel.quartos,
            "suites": imovel.suites,
            "banheiros": imovel.banheiros,
            "vagas": imovel.vagas,
            "bairro": imovel.bairro,
            "endereco": imovel.endereco,
            "numero": imovel.numero,
            "complemento": imovel.complemento,
            "cep": imovel.cep,
            "cidade": imovel.cidade,
            "latitude": imovel.latitude,
            "longitude": imovel.longitude,
            "comodidades_condominio": imovel.comodidades_condominio,
            "capa": capa_url,
            "fotos_galeria": galeria_urls,
        }
        return Response(dados, status=status.HTTP_200_OK)

    def put(self, request, pk):
        imovel = get_object_or_404(Imovel, pk=pk)
        dados = request.data
        try:
            for campo in ['titulo', 'descricao', 'tipo_imovel', 'tipo_finalidade', 'finalidade', 'preco', 'valor_condominio', 'iptu', 'area_util', 'quartos', 'suites', 'banheiros', 'vagas', 'bairro', 'endereco', 'numero', 'complemento', 'cep', 'cidade', 'comodidades_condominio']:
                if campo in dados:
                    setattr(imovel, campo, dados[campo])
            # Latitude e longitude: aceita vazio ou "null" como NULL
            for campo_geo in ['latitude', 'longitude']:
                if campo_geo in dados:
                    val = dados[campo_geo]
                    if val in (None, '', 'null', 'None'):
                        setattr(imovel, campo_geo, None)
                    else:
                        setattr(imovel, campo_geo, val)
            imovel.save()
            return Response({"mensagem": "Imóvel atualizado com sucesso!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"erro": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        imovel = get_object_or_404(Imovel, pk=pk)
        imovel.ativo = not imovel.ativo  
        imovel.save()
        return Response({"mensagem": "Status alterado com sucesso!", "ativo": imovel.ativo}, status=status.HTTP_200_OK)

# -------------------------------------------------------------------
# VIEWS DE LEADS
# -------------------------------------------------------------------
class LeadListaView(APIView):
    def get(self, request):
        leads = Lead.objects.all().order_by('-data_criacao')
        dados_leads = []
        for lead in leads:
            dados_leads.append({
                "id": lead.id,
                "nome": lead.nome,
                "email": lead.email,
                "telefone": lead.telefone,
                "mensagem": lead.mensagem,
                "status": lead.status,
                "data_criacao": lead.data_criacao.strftime("%d/%m/%Y %H:%M"),
                "imovel_titulo": lead.imovel_interesse.titulo if lead.imovel_interesse else "Contato Geral",
                "melhor_horario": lead.melhor_horario, 
                "meio_contato": lead.meio_contato      
            })
        return Response(dados_leads, status=status.HTTP_200_OK)

    def post(self, request):
        dados = request.data
        try:
            imovel_id = dados.get('imovel_id') or dados.get('imovel')
            imovel = Imovel.objects.filter(id=imovel_id).first() if imovel_id else None
            
            novo_lead = Lead.objects.create(
                nome=dados.get('nome'),
                email=dados.get('email', ''),
                telefone=dados.get('telefone'),
                mensagem=dados.get('mensagem', ''),
                melhor_horario=dados.get('melhor_horario', ''), 
                meio_contato=dados.get('meio_contato', ''),     
                imovel_interesse=imovel
            )

            try:
                nome_imovel = imovel.titulo if imovel else "Contato Geral"
                assunto = f"🔥 NOVO LEAD: {novo_lead.nome} - {nome_imovel}"
                mensagem_html = f"""
                <html>
                    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background-color: #0F172A; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                            <h2 style="color: #3B82F6; margin: 0;">IMOBI.APP</h2>
                            <p style="color: #94A3B8; margin: 5px 0 0 0;">Novo Lead Recebido</p>
                        </div>
                        <div style="padding: 20px; border: 1px solid #E2E8F0; border-radius: 0 0 8px 8px;">
                            <p><strong>Nome:</strong> {novo_lead.nome}</p>
                            <p><strong>Telefone:</strong> {novo_lead.telefone}</p>
                            <p><strong>E-mail:</strong> {novo_lead.email}</p>
                            <p><strong>Melhor Horário:</strong> {novo_lead.melhor_horario}</p>
                            <p><strong>Meio de Contato:</strong> {novo_lead.meio_contato}</p>
                            <p><strong>Imóvel:</strong> {nome_imovel}</p>
                            <div style="background-color: #F8FAFC; padding: 15px; border-left: 4px solid #3B82F6; margin-top: 20px; border-radius: 4px;">
                                <strong>Mensagem:</strong><br>
                                <span style="color: #475569;">{novo_lead.mensagem if novo_lead.mensagem else "Nenhuma mensagem."}</span>
                            </div>
                        </div>
                    </body>
                </html>
                """
                send_mail(
                    subject=assunto,
                    message="Novo lead recebido.",
                    html_message=mensagem_html,
                    from_email=settings.EMAIL_HOST_USER, 
                    recipient_list=[settings.EMAIL_HOST_USER], 
                    fail_silently=True,
                )
            except Exception:
                pass

            return Response({"mensagem": "Contato recebido com sucesso!"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"erro": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LeadDetalheView(APIView):
    def patch(self, request, pk):
        lead = get_object_or_404(Lead, pk=pk)
        novo_status = request.data.get('status')
        status_validos = dict(Lead.STATUS_CHOICES).keys()
        if novo_status in status_validos:
            lead.status = novo_status
            lead.save()
            return Response({"mensagem": "Status atualizado!"}, status=status.HTTP_200_OK)
        return Response({"erro": "Status inválido"}, status=status.HTTP_400_BAD_REQUEST)

# -------------------------------------------------------------------
# VIEW DE BUSCA COM INTELIGÊNCIA ARTIFICIAL (GROQ)
# -------------------------------------------------------------------
class BuscaIAView(APIView):
    def post(self, request):
        texto_busca = request.data.get("busca", "")
        if not texto_busca:
            return Response({"erro": "O que você está procurando?"}, status=status.HTTP_400_BAD_REQUEST)

        client = Groq(api_key=os.getenv("GROQ_API_KEY"))

        instrucoes_ia = """
        Você é um assistente imobiliário. Extraia os filtros de busca do texto do usuário.
        Retorne APENAS um JSON puro, sem explicações.
        
        Campos:
        - tipo_imovel: ("Apartamento", "Casa", "Terreno" ou "Sala Comercial")
        - finalidade: ("Venda" ou "Aluguel")
        - bairro: (Nome do bairro em Belém)
        - quartos: (Número inteiro)
        - preco_maximo: (Número inteiro)
        """

        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": instrucoes_ia},
                    {"role": "user", "content": texto_busca}
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"} 
            )
            
            filtros = json.loads(chat_completion.choices[0].message.content)
            
        except Exception as e:
            print(f"Erro na Groq: {e}")
            return Response({"erro": "Falha na comunicação com a IA."}, status=500)

        imoveis = Imovel.objects.filter(ativo=True)

        if filtros.get('tipo_imovel'):
            imoveis = imoveis.filter(tipo_imovel__icontains=filtros['tipo_imovel'])
        if filtros.get('finalidade'):
            imoveis = imoveis.filter(finalidade__icontains=filtros['finalidade'])
        if filtros.get('bairro'):
            imoveis = imoveis.filter(bairro__icontains=filtros['bairro'])
        if filtros.get('quartos'):
            imoveis = imoveis.filter(quartos__gte=filtros['quartos'])
        if filtros.get('preco_maximo'):
            imoveis = imoveis.filter(preco__lte=filtros['preco_maximo'])

        dados_imoveis = []
        for imovel in imoveis:
            capa = ImagemImovel.objects.filter(imovel=imovel, is_capa=True).first()
            url_capa = request.build_absolute_uri(capa.imagem.url) if (capa and capa.imagem) else None
            
            dados_imoveis.append({
                "id": imovel.id,
                "titulo": imovel.titulo,
                "preco": imovel.preco,
                "bairro": imovel.bairro,
                "capa": url_capa,
                "latitude": getattr(imovel, 'latitude', None),
                "longitude": getattr(imovel, 'longitude', None)
            })

        return Response({
            "filtros_entendidos": filtros,
            "imoveis": dados_imoveis
        }, status=status.HTTP_200_OK)