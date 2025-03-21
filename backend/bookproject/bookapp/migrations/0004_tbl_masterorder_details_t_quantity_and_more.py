# Generated by Django 5.0.6 on 2025-02-28 07:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("bookapp", "0003_remove_tbl_masterorder_details_t_quantity"),
    ]

    operations = [
        migrations.AddField(
            model_name="tbl_masterorder_details",
            name="T_Quantity",
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name="tbl_masterorder_details",
            name="T_Amount",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
