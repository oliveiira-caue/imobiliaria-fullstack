from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import ImovelCriarView, ImovelListaView, ImovelDetalhesView, LeadListaView, LeadDetalheView

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('imoveis/', ImovelCriarView.as_view(), name='criar_imovel'),

    path('imoveis/lista/', ImovelListaView.as_view(), name='listar_imoveis'),

    path('imoveis/<int:pk>/', ImovelDetalhesView.as_view(), name='detalhe_imovel'),

    path('leads/', LeadListaView.as_view(), name='listar_criar_leads'),
    path('leads/<int:pk>/', LeadDetalheView.as_view(), name='atualizar_lead'),
]