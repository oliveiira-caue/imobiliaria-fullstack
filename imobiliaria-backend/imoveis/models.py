import os
from django.db import models
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image
from io import BytesIO

class Imovel(models.Model):
    TIPO_IMOVEL_CHOICES = [
        ('Apartamento', 'Apartamento'),
        ('Casa', 'Casa'),
        ('Terreno', 'Terreno'),
        ('Sala Comercial', 'Sala Comercial'),
    ]

    titulo = models.CharField(max_length=255)
    descricao = models.TextField()
    tipo_imovel = models.CharField(max_length=50, choices=TIPO_IMOVEL_CHOICES)
    tipo_finalidade = models.CharField(max_length=50)
    finalidade = models.CharField(max_length=50)

    preco = models.DecimalField(max_digits=12, decimal_places=2)
    valor_condominio = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    iptu = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    area_util = models.IntegerField()

    quartos = models.IntegerField(default=0)
    suites = models.IntegerField(default=0)
    banheiros = models.IntegerField(default=0)
    vagas = models.IntegerField(default=0)

    bairro = models.CharField(max_length=100)
    endereco = models.CharField(max_length=255)
    numero = models.CharField(max_length=20, blank=True, default="")
    complemento = models.CharField(max_length=100, blank=True, default="")
    cep = models.CharField(max_length=10, blank=True, default="")
    cidade = models.CharField(max_length=100, default="Belém")

    # CAMPOS PARA O GOOGLE MAPS
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    comodidades_condominio = models.TextField(blank=True, null=True)

    criado_em = models.DateTimeField(auto_now_add=True)

    ativo = models.BooleanField(default=True)

    def __str__(self):
        return self.titulo
    
class ImagemImovel(models.Model):
    imovel = models.ForeignKey(Imovel, related_name='galeria', on_delete=models.CASCADE)
    imagem = models.ImageField(upload_to='imoveis/fotos/')
    is_capa = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    # Dimensões máximas por tipo de imagem
    MAX_CAPA    = (1600, 900)   # capa: widescreen, aparece grande no site
    MAX_GALERIA = (1280, 960)   # galeria: menor, carrega mais rápido

    def save(self, *args, **kwargs):
        # Só comprime na criação (nunca re-processa imagem já salva no S3)
        if self.imagem and not self.pk:
            self.imagem = self._comprimir(self.imagem, self.is_capa)
        super().save(*args, **kwargs)

    def _comprimir(self, arquivo, is_capa):
        img = Image.open(arquivo)

        # Remove metadados EXIF (GPS, modelo do celular, data, etc.)
        # Isso reduz o tamanho e protege a privacidade do fotógrafo
        img_sem_exif = Image.new(img.mode, img.size)
        img_sem_exif.putdata(list(img.getdata()))
        img = img_sem_exif

        # Converte para RGB — necessário para salvar como JPEG
        # (PNG com transparência, WEBP, paleta indexada, etc.)
        if img.mode != "RGB":
            img = img.convert("RGB")

        # Redimensiona respeitando a proporção original (nunca estica)
        max_size = self.MAX_CAPA if is_capa else self.MAX_GALERIA
        img.thumbnail(max_size, Image.Resampling.LANCZOS)

        output = BytesIO()

        # Progressive JPEG: o browser mostra a imagem inteira desfocada
        # e vai focando aos poucos — percepção de carregamento muito mais rápida
        # Quality 82: ponto ideal para imóveis (qualidade visual alta, arquivo ~60% menor)
        img.save(output, format='JPEG', quality=82, optimize=True, progressive=True)
        output.seek(0)

        # Nome seguro: pega só o nome do arquivo, sem extensão, e força .jpg
        nome_base = os.path.splitext(os.path.basename(arquivo.name))[0]
        nome_arquivo = f"{nome_base}.jpg"
        tamanho_real = output.getbuffer().nbytes  # tamanho correto em bytes

        return InMemoryUploadedFile(
            output,
            'ImageField',
            nome_arquivo,
            'image/jpeg',
            tamanho_real,
            None,
        )

    def __str__(self):
        return f"Foto de: {self.imovel.titulo}"
    

class Lead(models.Model):
    STATUS_CHOICES = [
        ('novo', 'Novo Contato'),
        ('atendimento', 'Em Atendimento'),
        ('fechado', 'Negócio Fechado'),
        ('perdido', 'Perdido/Desistiu'),
    ]

    nome = models.CharField(max_length=150)
    email = models.EmailField(blank=True, null=True)
    telefone = models.CharField(max_length=20)
    mensagem = models.TextField()
    
    # NOVOS CAMPOS ADICIONADOS
    melhor_horario = models.CharField(max_length=50, blank=True, null=True)
    meio_contato = models.CharField(max_length=50, blank=True, null=True)

    imovel_interesse = models.ForeignKey(
        Imovel, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='leads'
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='novo')
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} - {self.telefone}"