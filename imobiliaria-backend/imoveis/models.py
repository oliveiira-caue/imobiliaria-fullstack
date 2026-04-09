from django.db import models

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
    cidade = models.CharField(max_length=100, default="Belém")

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
