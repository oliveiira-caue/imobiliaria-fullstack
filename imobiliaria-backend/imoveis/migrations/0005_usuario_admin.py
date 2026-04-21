from django.db import migrations
from django.contrib.auth.hashers import make_password


def criar_usuario_admin(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    if not User.objects.filter(username='admin').exists():
        User.objects.create(
            username='admin',
            password=make_password('83146948'),
            email='',
            is_staff=True,
            is_superuser=True,
            is_active=True,
        )


class Migration(migrations.Migration):
    dependencies = [
        ('imoveis', '0008_alter_imovel_latitude_alter_imovel_longitude'),
    ]

    operations = [
        migrations.RunPython(criar_usuario_admin, migrations.RunPython.noop),
    ]
