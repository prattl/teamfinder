# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-06-24 15:43
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('teams', '0002_auto_20170623_2352'),
    ]

    operations = [
        migrations.AddField(
            model_name='team',
            name='mmr_average',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='team',
            name='mmr_last_updated',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]