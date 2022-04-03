from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Ticket(models.Model):
    PENDING_STATUS = "P"
    IN_PROGRESS = "IP"
    COMPLETED = "C"

    STATUSES = [
        (PENDING_STATUS, "Pending"),
        (IN_PROGRESS, "In Progress"),
        (COMPLETED, "Completed"),
    ]

    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    level = models.CharField(max_length=20)
    creation_date = models.DateTimeField(auto_now_add=True)
    mod_date = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUSES, default=PENDING_STATUS)


class Status():
    def __init__(self, id, text):
        self.id = id
        self.text = text


class TicketStatusLog(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=Ticket.STATUSES, default=Ticket.PENDING_STATUS)
    comment = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)



