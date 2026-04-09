from django.urls import path
from .views import ImovelCriarView, ImovelDetalhesView, ImovelListaView

urlpatterns = [
    path('imoveis/', ImovelCriarView.as_view(), name='criar_imovel'),

    path('imoveis/lista/', ImovelListaView.as_view(), name='listar_imoveis'),

    path('imoveis/<int:pk>/', ImovelDetalhesView.as_view(), name='detalhe_imovel'),
]