# Generated by Django 5.0.6 on 2025-02-28 07:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("bookapp", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tbl_masterorder_details",
            name="T_Quantity",
            field=models.IntegerField(default=1),
        ),
    ]
