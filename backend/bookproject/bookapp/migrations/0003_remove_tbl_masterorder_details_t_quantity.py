# Generated by Django 5.0.6 on 2025-02-28 07:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("bookapp", "0002_alter_tbl_masterorder_details_t_quantity"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="tbl_masterorder_details",
            name="T_Quantity",
        ),
    ]
