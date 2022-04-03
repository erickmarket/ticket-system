@echo off
cd ticket_system_backend
echo STARTING DJANGO BACKEND SERVER...
start python manage.py runserver
cd ..
cd ticket-system-frontend
echo STARTING REACT FRONTEND APP
start npm start
echo DONE...
ping -n 2 127.0.0.1 > nul
exit 0