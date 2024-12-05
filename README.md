# Event Booking System

An event booking system built with Next.js, TypeScript, and PostgresSQL. This project allows users to sign up, log in, and book tickets for events. Admins can create, update, and manage events, while users can view events and make transactions.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## Description

The Event Booking System is a simple web application designed to imitate the process of discovering and booking events. The platform allows event organizers to create and manage events, while users can browse and register for tickets. The system integrates with PostgresSQL for authentication and data storage.

### Technologies Used:

- **Next.js** for the frontend and server-side rendering
- **Tailwind CSS** for styling
- **NextAuth.js** for managing user sessions
- **shadcn/ui** for the ui components

## Features

- User registration and login using email and password
- Event creation
- User event registration (purchase tickets)
- Dynamic forms with validation
- Responsive design using Tailwind CSS
- Toast notifications for success/error feedback
- Email-based authentication

## Installation

Follow these steps to install and set up your project locally:

### Prerequisites

- Node.js (version 14 or higher)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/diego-dc/EventlyTest.git
   ```
2. Navigate into the project directory:
   ```bash
   cd evently-test
   ```
3. Install dependencies:
   ```bash
   npm install   # or yarn install
   ```
4. Set up environment variables:

   - Rename `.env.example` to `.env.local` and configure the following values:
     ```
     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     NEXTAUTH_SECRET=your-next-auth-secret
     DATABASE_URL="file:./dev.db"
     NEXTAUTH_URL="http://localhost:3000"
     ```

5. Run the development server:
   ```bash
   npm run dev   # or yarn dev
   ```
6. Open your browser and go to `http://localhost:3000` to view the application.

## Usage

1. To start using the system, visit the login page (`/auth/login`).
2. Sign up or log in using your email and password.
3. Browse the available events on the main page (`/events`).
4. Select an event and register for it by entering your details and purchasing tickets.
5. Admins can manage events from the admin dashboard.

## Local DB

For local testing, you can use SQLite DB. Replace in prisma/schema.prisma:

```datasource db {
  provider  = "postgresql"
  url  	    = env("DATABASE_URL")
}
```

for:

```datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

And generate/make migrations:

`npx prisma generate `

`npx prisma migrate dev --name init`
