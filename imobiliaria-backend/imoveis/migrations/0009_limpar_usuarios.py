from django.db import migrations


def limpar_usuarios(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    User.objects.exclude(username='admin').delete()


class Migration(migrations.Migration):
    dependencies = [
        ('imoveis', '0005_usuario_admin'),
    ]

    operations = [
        migrations.RunPython(limpar_usuarios, migrations.RunPython.noop),
    ]
