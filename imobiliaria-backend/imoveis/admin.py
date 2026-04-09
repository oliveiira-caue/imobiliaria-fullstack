from django.contrib import admin

from django.contrib import admin
from .models import ImagemImovel, Imovel

class ImagemImovelInline(admin.TabularInline):
    model = ImagemImovel
    extra = 1

@admin.register(Imovel)
class ImovelAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'preco', 'bairro', 'tipo_imovel')
    search_fields = ('titulo', 'bairro')
    inlines = [ImagemImovelInline]