# Ticket System v1.0 
## Metadata
- Author: **Erick Market**
- Country : Dominican Republic
- Date: April 2nd 2022
- Purpose: Have fun with React & Django.

## How it works
- After setting up the Backend project, you can create admin and regular users.
- Regular users can log into the frontend project and create tickets.
- Regular users can see their own tickets and their history logs.
- Admin users can see tickets from all users but can't create their own.

## Possible Roadmap
- Implement Refresh Token Scheme for Authentication
- Add rules for status changes and log visibility by user type
- Implement Filtering and Pagination.
- Add the capability to assign tickets to other staff users.
- Internationalization and Localization


## Back-End Project
- Language: Python
- Framework/Libraries: Django, Django Rest Framework
- Prerequisites: Install Python 3.x
- Setup:
  1. Open your **terminal** and navigate to the back-end project folder.
  2. Run **python -m pip install -r requirements.txt** to install all dependencies.
  3. Run **python manage.py migrate** to create the local database.
  4. Run **python manage.py createsuperuser** and follow instructions to create the admin user.
  5. Run **python manage.py runserver** to start the project.
  6. Navigate to [http://localhost:8000/admin/](http://localhost:8000/admin/) in your browser to 
  access the admin area and create regular users (don't check the is_staff option for those).

## Front-End Project
- Language: Javascript
- Framework/Libraries: ReactJS, React-Router, Bootstrap
- Prerequisites: Install NodeJS 
- Setup:
  1. Open your **terminal** and navigate to the front-end project folder.
  2. Run **npm install** to install all dependencies.
  3. Run **npm start** to start the project.
  4. Navigate to [http://localhost:3000](http://localhost:3000) in your browser.
  5. Log in with the admin or regular users you've created in the backend project.
