from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import (
    ImovelCriarView,
    ImovelListaView,
    ImovelDetalhesView,
    LeadListaView,
    LeadDetalheView,
    BuscaIAView,
    GeocodificarView,
    UsuariosView,
    UsuarioDetalheView,
)

urlpatterns = [
    # Autenticação
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Imóveis
    path('imoveis/', ImovelCriarView.as_view(), name='criar_imovel'),
    path('imoveis/lista/', ImovelListaView.as_view(), name='listar_imoveis'),
    path('imoveis/<int:pk>/', ImovelDetalhesView.as_view(), name='detalhe_imovel'),
    
    # Leads
    path('leads/', LeadListaView.as_view(), name='listar_criar_leads'),
    path('leads/<int:pk>/', LeadDetalheView.as_view(), name='atualizar_lead'),
    
    # Busca com Inteligência Artificial (Groq)
    path('busca-ia/', BuscaIAView.as_view(), name='busca-ia'),

    # Proxy de geocodificação (Nominatim via servidor)
    path('geocodificar/', GeocodificarView.as_view(), name='geocodificar'),

    # Gerenciamento de usuários
    path('usuarios/', UsuariosView.as_view(), name='usuarios'),
    path('usuarios/<int:pk>/', UsuarioDetalheView.as_view(), name='usuario_detalhe'),
]