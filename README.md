EventEase - Event Management System
📋 Project Overview
EventEase is a complete event management platform that allows users to discover, book, and manage events. Admins can create and manage events while users can browse events and make bookings.

Core Features 
Booking Logic: 
● Users can book up to 2 seats per event. 
● Prevent booking if event is at full capacity. 
● Auto-generate custom event IDs using the format: 
EVT-[MMM][YYYY]-[Random3] (e.g., EVT-AUG2025-X4T) 
Event Status: 
● Dynamically determine status based on event date: 
○ Upcoming: Event is in the future 
○ Ongoing: Event is today 
○ Completed: Event has passed 
Access & Authentication: 
● JWT-based user login and registration 
● Role-based access control for admin and users 
● Basic route protection 
Backend Middleware: 
● Create a custom middleware that logs each new booking with user and timestamp info. 
Date Formatting: 
● Use consistent DD-MMM-YYYY format across the application
Responsive
Pagination,
Seat Tracker,
Email Confirmation,
Testing: Add basic unit or integration tests. 

📋 Project Overview
EventEase is a complete event management platform that allows users to discover, book, and manage events. Admins can create and manage events while users can browse events and make bookings.

✨ Features Implemented
🔐 Authentication System
User registration and login

JWT token-based authentication

Role-based access (User/Admin)

Protected routes

🎫 Event Management
Create, read, update, delete events

Event categories (Tech, Music, Business, etc.)

Online and In-Person events

Event search and filtering

Pagination support

📅 Booking System
Book events (1-2 seats per booking)

Booking confirmation with PDF generation

View booking history

Cancel bookings

Email confirmation simulation

👥 User Features
User profile management

My bookings section

Event browsing and filtering

🛡️ Admin Features
Full event management

View event attendees

Admin-only access controls

🛠️ Tech Stack Used
Backend
Node.js - Runtime environment

Express.js - Web framework

MongoDB - Database

Mongoose - ODM for MongoDB

JWT - Authentication

bcryptjs - Password hashing

Jest - Testing framework

Supertest - API testing

Frontend (Ready to implement)
React.js - Frontend framework

Tailwind CSS - Styling

Axios - API calls

React Router - Navigation


🚀 Setup Instructions
Backend Setup
Clone the repository

bash
git clone <your-repo-url>
cd backend
Install dependencies

bash
npm install
Environment Setup

Create .env file in root directory

Add these variables:
add env file

Make sure MongoDB is running on your system

Default: mongodb://localhost:27017

Run the application

bash
# Development
npm run dev

test cases ->
npm run test


# Production
npm start
Run tests

bash
npm test
Frontend Setup (To be implemented)
Navigate to frontend directory

bash
cd frontend
Install dependencies

bash
npm install
Environment Setup

Create .env file

Add:

text
REACT_APP_API_URL=http://localhost:5000/api
Start development server

bash ---

npm run dev
