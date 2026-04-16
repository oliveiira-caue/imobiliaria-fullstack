import os
import json
import urllib.request
import urllib.parse
from groq import Groq
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from .models import Imovel, ImagemImovel, Lead

# ─── Helper ────────────────────────────────────────────────────────────────
CAMPOS_SCALARES = [
    'titulo', 'descricao', 'tipo_imovel', 'tipo_finalidade', 'finalidade',
    'preco', 'valor_condominio', 'iptu', 'area_util',
    'quartos', 'suites', 'banheiros', 'vagas',
    'bairro', 'endereco', 'numero', 'complemento', 'cep', 'cidade',
    'comodidades_condominio',
]
CAMPOS_GEO = ['latitude', 'longitude']

def _geo_value(val):
    """Converte strings vazias / 'null' em None para DecimalField."""
    if val in (None, '', 'null', 'None'):
        return None
    return val

def _capa_url(request, imovel):
    capa = ImagemImovel.objects.filter(imovel=imovel, is_capa=True).first()
    return request.build_absolute_uri(capa.imagem.url) if (capa and capa.imagem) else None


# -------------------------------------------------------------------
# VIEWS DE IMÓVEIS
# -------------------------------------------------------------------
class ImovelCriarView(APIView):
    def post(self, request, *args, **kwargs):
        d = request.data
        try:
            imovel = Imovel.objects.create(
                titulo=d.get('titulo'),
                descricao=d.get('descricao'),
                tipo_imovel=d.get('tipo_imovel'),
                tipo_finalidade=d.get('tipo_finalidade'),
                finalidade=d.get('finalidade'),
                preco=d.get('preco'),
                valor_condominio=d.get('valor_condominio') or 0,
                iptu=d.get('iptu') or 0,
                area_util=d.get('area_util'),
                quartos=d.get('quartos') or 0,
                suites=d.get('suites') or 0,
                banheiros=d.get('banheiros') or 0,
                vagas=d.get('vagas') or 0,
                bairro=d.get('bairro'),
                endereco=d.get('endereco'),
                numero=d.get('numero', ''),
                complemento=d.get('complemento', ''),
                cep=d.get('cep', ''),
                cidade=d.get('cidade', 'Belém'),
                latitude=_geo_value(d.get('latitude')),
                longitude=_geo_value(d.get('longitude')),
                comodidades_condominio=d.get('comodidades_condominio', ''),
            )
            for index, img in enumerate(request.FILES.getlist('galeria')):
                ImagemImovel.objects.create(imovel=imovel, imagem=img, is_capa=(index == 0))
            return Response({"mensagem": "Imóvel e fotos salvos com sucesso!", "id": imovel.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"erro": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ImovelListaView(APIView):
    def get(self, request):
        imoveis = Imovel.objects.all().order_by('-id')
        dados = [
            {
                "id": im.id,
                "titulo": im.titulo,
                "tipo_imovel": im.tipo_imovel,
                "finalidade": im.finalidade,
                "bairro": im.bairro,
                "cidade": im.cidade,
                "preco": im.preco,
                "area_util": im.area_util,
                "quartos": im.quartos,
                "banheiros": im.banheiros,
                "vagas": im.vagas,
                "capa": _capa_url(request, im),
                "ativo": im.ativo,
            }
            for im in imoveis
        ]
        return Response(dados, status=status.HTTP_200_OK)


class ImovelDetalhesView(APIView):
    def get(self, request, pk):
        imovel = get_object_or_404(Imovel, pk=pk)
        galeria_objs = ImagemImovel.objects.filter(imovel=imovel, is_capa=False).order_by('criado_em')
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
            "capa": _capa_url(request, imovel),
            "fotos_galeria": [
                {"id": img.id, "url": request.build_absolute_uri(img.imagem.url)}
                for img in galeria_objs if img.imagem
            ],
        }
        return Response(dados, status=status.HTTP_200_OK)

    def put(self, request, pk):
        imovel = get_object_or_404(Imovel, pk=pk)
        d = request.data
        try:
            for campo in CAMPOS_SCALARES:
                if campo in d:
                    setattr(imovel, campo, d[campo])
            for campo in CAMPOS_GEO:
                if campo in d:
                    setattr(imovel, campo, _geo_value(d[campo]))
            imovel.save()
            return Response({"mensagem": "Imóvel atualizado com sucesso!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"erro": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        imovel = get_object_or_404(Imovel, pk=pk)
        imovel.ativo = not imovel.ativo
        imovel.save()
        return Response({"mensagem": "Status alterado com sucesso!", "ativo": imovel.ativo}, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        imovel = get_object_or_404(Imovel, pk=pk)
        titulo = imovel.titulo
        imovel.delete()
        return Response({"mensagem": f'Imóvel "{titulo}" excluído com sucesso!'}, status=status.HTTP_200_OK)


# -------------------------------------------------------------------
# VIEWS DE LEADS
# -------------------------------------------------------------------
class LeadListaView(APIView):
    def get(self, request):
        leads = Lead.objects.all().order_by('-data_criacao')
        dados = [
            {
                "id": lead.id,
                "nome": lead.nome,
                "email": lead.email,
                "telefone": lead.telefone,
                "mensagem": lead.mensagem,
                "status": lead.status,
                "data_criacao": lead.data_criacao.strftime("%d/%m/%Y %H:%M"),
                "imovel_titulo": lead.imovel_interesse.titulo if lead.imovel_interesse else "Contato Geral",
                "melhor_horario": lead.melhor_horario,
                "meio_contato": lead.meio_contato,
            }
            for lead in leads
        ]
        return Response(dados, status=status.HTTP_200_OK)

    def post(self, request):
        d = request.data
        try:
            imovel_id = d.get('imovel_id') or d.get('imovel')
            imovel = Imovel.objects.filter(id=imovel_id).first() if imovel_id else None
            novo_lead = Lead.objects.create(
                nome=d.get('nome'),
                email=d.get('email', ''),
                telefone=d.get('telefone'),
                mensagem=d.get('mensagem', ''),
                melhor_horario=d.get('melhor_horario', ''),
                meio_contato=d.get('meio_contato', ''),
                imovel_interesse=imovel,
            )
            # Notificação por e-mail (falha silenciosa)
            try:
                nome_imovel = imovel.titulo if imovel else "Contato Geral"
                mensagem_html = f"""
                <html>
                    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background-color: #0F172A; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                            <h2 style="color: #3B82F6; margin: 0;">Nexus Habitar</h2>
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
                                <span style="color: #475569;">{novo_lead.mensagem or "Nenhuma mensagem."}</span>
                            </div>
                        </div>
                    </body>
                </html>
                """
                send_mail(
                    subject=f"🔥 NOVO LEAD: {novo_lead.nome} - {nome_imovel}",
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
        if novo_status in dict(Lead.STATUS_CHOICES):
            lead.status = novo_status
            lead.save()
            return Response({"mensagem": "Status atualizado!"}, status=status.HTTP_200_OK)
        return Response({"erro": "Status inválido"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, _request, pk):
        lead = get_object_or_404(Lead, pk=pk)
        nome = lead.nome
        lead.delete()
        return Response({"mensagem": f'Lead "{nome}" excluído com sucesso!'}, status=status.HTTP_200_OK)


# -------------------------------------------------------------------
# VIEW DE PROXY DE GEOCODIFICAÇÃO (Google Maps Geocoding API)
# -------------------------------------------------------------------
class GeocodificarView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({"erro": "Parâmetro 'q' obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        api_key = os.getenv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")
        if not api_key:
            return Response({"erro": "Chave da API do Google Maps não configurada."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        url = (
            "https://maps.googleapis.com/maps/api/geocode/json"
            f"?address={urllib.parse.quote(query)}"
            f"&key={api_key}"
            "&language=pt-BR"
            "&region=br"
        )
        try:
            with urllib.request.urlopen(url, timeout=10) as resp:
                data = json.loads(resp.read().decode())

            if data.get("status") == "OK" and data.get("results"):
                location = data["results"][0]["geometry"]["location"]
                return Response({"lat": location["lat"], "lon": location["lng"]}, status=status.HTTP_200_OK)

            if data.get("status") == "ZERO_RESULTS":
                return Response({"erro": "Endereço não encontrado. Tente preencher com mais detalhes."}, status=status.HTTP_404_NOT_FOUND)

            return Response({"erro": f"Erro na API: {data.get('status')}"}, status=status.HTTP_502_BAD_GATEWAY)
        except Exception as e:
            return Response({"erro": f"Falha no serviço de geocodificação: {e}"}, status=status.HTTP_502_BAD_GATEWAY)


# -------------------------------------------------------------------
# VIEW DE BUSCA COM INTELIGÊNCIA ARTIFICIAL (GROQ)
# -------------------------------------------------------------------
class BuscaIAView(APIView):
    def post(self, request):
        texto_busca = request.data.get("busca", "").strip()
        if not texto_busca:
            return Response({"erro": "O que você está procurando?"}, status=status.HTTP_400_BAD_REQUEST)

        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        instrucoes = (
            "Você é um assistente imobiliário. Extraia os filtros de busca do texto do usuário. "
            "Retorne APENAS um JSON puro, sem explicações. "
            "Campos possíveis: tipo_imovel (Apartamento|Casa|Terreno|Sala Comercial), "
            "finalidade (Venda|Aluguel), bairro (string), quartos (inteiro), preco_maximo (inteiro)."
        )
        try:
            completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": instrucoes},
                    {"role": "user", "content": texto_busca},
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"},
            )
            filtros = json.loads(completion.choices[0].message.content)
        except Exception as e:
            print(f"Erro na Groq: {e}")
            return Response({"erro": "Falha na comunicação com a IA."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

        dados = [
            {
                "id": im.id,
                "titulo": im.titulo,
                "tipo_imovel": im.tipo_imovel,
                "bairro": im.bairro,
                "quartos": im.quartos,
                "preco": im.preco,
                "capa": _capa_url(request, im),
                "latitude": im.latitude,
                "longitude": im.longitude,
            }
            for im in imoveis
        ]
        return Response({"filtros_entendidos": filtros, "imoveis": dados}, status=status.HTTP_200_OK)