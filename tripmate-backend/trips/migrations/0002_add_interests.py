from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("trips", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="itinerary",
            name="interests",
            field=models.JSONField(blank=True, default=list),
        ),
    ]
