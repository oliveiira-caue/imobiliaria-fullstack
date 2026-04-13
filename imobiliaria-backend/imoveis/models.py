from django.db import models
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image
from io import BytesIO
import sys

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

    def save(self, *args, **kwargs):
        # Só faz a compressão se a imagem estiver sendo criada pela primeira vez
        if self.imagem and not self.id:
            # 1. Abre a imagem enviada pelo usuário
            img = Image.open(self.imagem)

            # 2. Converte para RGB (Evita erros com imagens PNG transparentes que serão JPG)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            # 3. Redimensiona caso seja gigante (Limite de 1280px mantendo a proporção)
            max_size = (1280, 1280)
            img.thumbnail(max_size, Image.Resampling.LANCZOS)

            # 4. Cria um espaço na memória para salvar a nova versão
            output = BytesIO()
            
            # 5. Salva a imagem comprimida na memória (Qualidade 75 é o padrão ouro de web)
            img.save(output, format='JPEG', quality=75, optimize=True)
            output.seek(0)

            # 6. Troca o arquivo original pesado pelo nosso arquivo leve recém-criado
            nome_arquivo = f"{self.imagem.name.split('.')[0]}.jpg"
            
            self.imagem = InMemoryUploadedFile(
                output, 
                'ImageField', 
                nome_arquivo, 
                'image/jpeg',
                sys.getsizeof(output), 
                None
            )

        # Continua o processo normal de salvamento do Django (agora mandando o arquivo leve pro S3)
        super(ImagemImovel, self).save(*args, **kwargs)

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