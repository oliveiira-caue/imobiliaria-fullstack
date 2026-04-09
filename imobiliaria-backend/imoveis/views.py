from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Imovel, ImagemImovel
from django.shortcuts import get_object_or_404

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
                cidade=dados.get('cidade', 'Belém'),
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
            url_capa = capa.imagem.url if (capa and capa.imagem) else None

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
            "cidade": imovel.cidade,
            "comodidades_condominio": imovel.comodidades_condominio,
        }
        return Response(dados, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        imovel = get_object_or_404(Imovel, pk=pk)
        dados = request.data
        
        try:
            imovel.titulo = dados.get('titulo', imovel.titulo)
            imovel.descricao = dados.get('descricao', imovel.descricao)
            imovel.tipo_imovel = dados.get('tipo_imovel', imovel.tipo_imovel)
            imovel.tipo_finalidade = dados.get('tipo_finalidade', imovel.tipo_finalidade)
            imovel.finalidade = dados.get('finalidade', imovel.finalidade)
            imovel.preco = dados.get('preco', imovel.preco)
            imovel.valor_condominio = dados.get('valor_condominio', imovel.valor_condominio)
            imovel.iptu = dados.get('iptu', imovel.iptu)
            imovel.area_util = dados.get('area_util', imovel.area_util)
            imovel.quartos = dados.get('quartos', imovel.quartos)
            imovel.suites = dados.get('suites', imovel.suites)
            imovel.banheiros = dados.get('banheiros', imovel.banheiros)
            imovel.vagas = dados.get('vagas', imovel.vagas)
            imovel.bairro = dados.get('bairro', imovel.bairro)
            imovel.endereco = dados.get('endereco', imovel.endereco)
            imovel.comodidades_condominio = dados.get('comodidades_condominio', imovel.comodidades_condominio)
            
            imovel.save()
            return Response({"mensagem": "Imóvel atualizado com sucesso!"}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"erro": str(e)}, status=status.HTTP_400_BAD_REQUEST)


    def patch(self, request, pk):
        imovel = get_object_or_404(Imovel, pk=pk)
        imovel.ativo = not imovel.ativo  
        imovel.save()
        return Response({"mensagem": "Status alterado com sucesso!", "ativo": imovel.ativo}, status=status.HTTP_200_OK)