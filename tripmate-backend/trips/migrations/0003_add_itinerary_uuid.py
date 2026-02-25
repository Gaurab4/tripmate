import uuid
from django.db import migrations, models


def fill_uuid(apps, schema_editor):
    Itinerary = apps.get_model("trips", "Itinerary")
    for row in Itinerary.objects.all():
        row.uuid = uuid.uuid4()
        row.save(update_fields=["uuid"])


class Migration(migrations.Migration):

    dependencies = [
        ("trips", "0002_add_interests"),
    ]

    operations = [
        migrations.AddField(
            model_name="itinerary",
            name="uuid",
            field=models.UUIDField(db_index=True, null=True, unique=False),
        ),
        migrations.RunPython(fill_uuid, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="itinerary",
            name="uuid",
            field=models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
