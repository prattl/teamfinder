# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-06-04 22:03
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('players', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='player',
            options={'ordering': ['user__username']},
        ),
    ]
