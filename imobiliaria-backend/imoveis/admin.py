from django.contrib import admin
from .models import ImagemImovel, Imovel


class ImagemImovelInline(admin.TabularInline):
    model = ImagemImovel
    extra = 1


@admin.register(Imovel)
class ImovelAdmin(admin.ModelAdmin):
    list_display  = ('titulo', 'tipo_imovel', 'finalidade', 'bairro', 'preco', 'ativo')
    list_filter   = ('tipo_imovel', 'finalidade', 'ativo')
    search_fields = ('titulo', 'bairro', 'cidade')
    inlines       = [ImagemImovelInline]

    fieldsets = (
        ('Informações Gerais', {
            'fields': ('titulo', 'descricao', 'tipo_imovel', 'tipo_finalidade', 'finalidade', 'ativo')
        }),
        ('Preços e Áreas', {
            'fields': ('preco', 'valor_condominio', 'iptu', 'area_util')
        }),
        ('Características', {
            'fields': ('quartos', 'suites', 'banheiros', 'vagas', 'comodidades_condominio')
        }),
        ('Endereço', {
            'fields': ('bairro', 'endereco', 'numero', 'complemento', 'cep', 'cidade')
        }),
        ('Localização no Mapa (Google Maps)', {
            'fields': ('latitude', 'longitude'),
            'description': 'Coordenadas geográficas para exibição no mapa. Ex: latitude -1.455833, longitude -48.490079',
        }),
    )