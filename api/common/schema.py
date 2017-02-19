import graphene
from graphene import relay, ObjectType, AbstractType
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from .models import Position, Region, SkillBracket, TeamMember


class PositionNode(DjangoObjectType):
    class Meta:
        model = Position
        filter_fields = ('name', 'secondary', )
        filter_order_by = ('name', )
        interfaces = (relay.Node, )


class Query(ObjectType):
    position = relay.Node.Field(PositionNode)
    all_positions = DjangoFilterConnectionField(PositionNode)

schema = graphene.Schema(query=Query)
