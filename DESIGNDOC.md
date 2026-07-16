# Design Doc

*Project 3 Name*: GraduateTrack — A Graduate School Application Tracker

*Team Members*: Shota Togawa, Daiwei Zhang

## Description:

GraduateTrack is a web application designed to help users organize and monitor their graduate school application process in one place. Instead of managing spreadsheets or scattered notes, users can securely manage applications, networking contacts, deadlines, interviews, and outcomes through a clean dashboard.
For this project scope, the application will focus on persistent CRUD functionality for three MongoDB collections: Users, Applications, and Contacts.

## User Personas:

1. Emily, The Graduate School Applicant
Emily is a senior undergraduate student applying to dozens of graduate schools. She wants to securely manage all of her applications, interview schedules, and networking contacts in one place.

2. Kevin, The Graduate School Applicant
Kevin is preparing applications for multiple master's programs. He wants to track deadlines, admission progress, and conversations with professors while keeping his data private through a personal account.

## User Stories:

### Users Collection

- As a new user, I want to create an account so that I can securely save my application data.
- As a logged-in user, I want my applications and contacts to be private so that only I can view and manage them.
- As a user, I want to log out securely when I finish using the application.

### Applications Collection

- As a user, I want to create a new application with the school name, program, application date, deadline, status, and notes, so I can keep track of all my applications.
- As a user, I want to view a list of all my applications and filter them by status, so I can quickly see which applications are pending, interviewing, accepted, rejected, or completed.
- As a user, I want to view detailed information for a specific application, so I can review its timeline and associated networking contacts.
- As a user, I want to update an application's information, including its status, interview dates, deadlines, and notes, so my tracker always reflects the latest progress.
- As a user, I want to delete an application, so I can remove duplicate or unnecessary entries.

### Contacts Collection

- As a user, I want to add a networking contact associated with an application, so I can remember, professors or alumni I have communicated with.
- As a user, I want to view all contacts related to a specific application, so I can easily review previous conversations.
- As a user, I want to edit a contact's information, including their name, school, role, email and communication notes.
- As a user, I want to delete a contact, so I can remove outdated or incorrect networking information.

## Work Division:
**Shota Togawa** — Applications Management Feature,

- Full Stack:
    - Frontend: Schools/programs catalog with search and pagination, program detail page, applications list with expandable rows, application edit form, and authentication pages (login/signup).
    - Backend & Database: Express API routes for Auth, Schools, and the Applications collection, including create, read, update, delete, and JWT-based auth middleware.

**Daiwei Zhang** — Contacts Management Feature,
- Full Stack:
    - Frontend: Contacts section on the application detail view, add/edit contact form, and contact delete controls.
    - Backend & Database: Express API routes for the Contacts collection, including create, read, update, and delete operations scoped to a user and linked to an application by `applicationId`.

### Shared Responsibilities:

Homepage/navigation, MongoDB Atlas setup, project structure, ESLint/Prettier configuration, README, deployment, and demo video.

### Tech Stack:
- Frontend: React 19 with Hooks, React Router, Vite
- Backend: Node.js + Express
- Database: MongoDB using the native MongoDB Node.js driver
- Auth: Passport (local + JWT strategies), bcrypt for password hashing
- Data Requests: Fetch API

### Desing Mock
