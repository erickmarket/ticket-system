from django.db import transaction, IntegrityError
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action, permission_classes
from rest_framework.authtoken.views import ObtainAuthToken

from tickets.models import Ticket, Status, TicketStatusLog
from tickets.permissions import IsRegularUser
from tickets.serializers import TicketStatusLogSerializer, UpdateStatusSerializer, UserSerializer, TicketSerializer, StatusSerializer
# Create your views here.


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TicketViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Ticket.objects.all() if request.user.is_staff \
            else Ticket.objects.filter(user__id = request.user.id)

        serializer = TicketSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = TicketSerializer(data=request.data)
        if serializer.is_valid():
            saved = serializer.save(user = request.user)
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        ticket = get_object_or_404(Ticket, pk=pk)
        if ticket.user != request.user and not request.user.is_staff:
            return Response(status=401)

        serializer = UpdateStatusSerializer(data=request.data)
        if serializer.is_valid():
            ticket.status = serializer.validated_data["status"]
            comment = serializer.validated_data["comment"]
            statusLog = TicketStatusLog(ticket=ticket,status=ticket.status, 
            user=request.user, comment=comment)

            try:
                with transaction.atomic():
                    statusLog.save()
                    ticket.save()
            except IntegrityError:
                return Response(status=500)
                
            return Response(serializer.data, status = 200)

        return Response(serializer.errors, status = 400)

    @action(detail=True, methods=["GET"])
    def get_status_logs(self, request, pk=None):
        ticket = get_object_or_404(Ticket, pk=pk)
        if ticket.user != request.user and not request.user.is_staff:
            return Response(status=401)

        queryset = TicketStatusLog.objects.filter(ticket__id=pk).order_by("-creation_date")
        serializer = TicketStatusLogSerializer(queryset, many=True)
        return Response(serializer.data, status=200)

    
    def get_permissions(self):
        if self.action == "create":
            permission_classes = [IsRegularUser]
        else:
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]
    

@permission_classes([IsAuthenticated])
class StatusViewSet(viewsets.ViewSet):
    def list(self, request):
        statuses = list(map(lambda x: Status(x[0], x[1]), Ticket.STATUSES))
        serializer = StatusSerializer(statuses, many=True)
        return Response(serializer.data, status=200)
            

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'username' : user.username,
            'is_staff' : user.is_staff
        })
    

        


