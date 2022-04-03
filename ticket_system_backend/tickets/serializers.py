from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Ticket, TicketStatusLog

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email']

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ["id", "title","description", "level", "creation_date", "mod_date", "user", "status"]
        read_only_fields = ["id", "user", "status"]
    
    user = serializers.SlugRelatedField(slug_field="username", read_only=True)

    status = serializers.CharField(source="get_status_display")

    #title = serializers.CharField(max_length=100, \
    #    validators = [UniqueValidator(queryset=Ticket.objects.all(), \
    #    message="Title needs to be unique")])

    def create(self, validated_data):
        return Ticket.objects.create(**validated_data)

    def validate_description(self, description):
        if "http" in description.lower():
            raise serializers.ValidationError("Links are not allowed in the description of the ticket") 
        return description

class UpdateStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Ticket.STATUSES)
    comment = serializers.CharField(max_length=200)


class StatusSerializer(serializers.Serializer):
    id = serializers.CharField()
    text = serializers.CharField()

class TicketStatusLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketStatusLog
        fields = "__all__"
    
    status = serializers.CharField(source="get_status_display")
    user = serializers.SlugRelatedField(slug_field="username", read_only=True)

    def validate(self, log):
        print(log)
        return True



