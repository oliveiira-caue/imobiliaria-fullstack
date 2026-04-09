from django.urls import path
from .views import ImovelCriarView, ImovelListaView, ImovelDetalhesView, LeadListaView, LeadDetalheView

urlpatterns = [
    path('imoveis/', ImovelCriarView.as_view(), name='criar_imovel'),

    path('imoveis/lista/', ImovelListaView.as_view(), name='listar_imoveis'),

    path('imoveis/<int:pk>/', ImovelDetalhesView.as_view(), name='detalhe_imovel'),

    path('leads/', LeadListaView.as_view(), name='listar_criar_leads'),
    path('leads/<int:pk>/', LeadDetalheView.as_view(), name='atualizar_lead'),
]