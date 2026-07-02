# Salesforce Validation Rule Manager

A full-stack application built as part of the CloudVandana Associate Software Engineer assignment.

The application connects to a Salesforce Developer Org using OAuth 2.0 and allows users to view and manage Account validation rules through a simple React interface.

---

## Features

- OAuth 2.0 authentication with Salesforce
- Fetch Account validation rules using the Salesforce Tooling API
- Enable or disable individual validation rules
- Enable all validation rules
- Disable all validation rules
- Clean and responsive React interface

---

## Tech Stack

### Frontend
- React (Vite)
- Axios
- Styled Components

### Backend
- Node.js
- Express.js
- jsforce
- dotenv
- CORS

### Salesforce
- Salesforce Developer Org
- Connected App (OAuth 2.0)
- Tooling API
- Validation Rules

---

## Project Structure

```
project/
│
├── sf-assignment-frontend/
│   ├── src/
│   ├── package.json
│
├── sf-assignment-backend/
│   ├── server.js
│   ├── .env
│   ├── package.json
│
└── README.md
```

---

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd project
```

---

### 2. Backend

Install dependencies

```bash
cd sf-assignment-backend
npm install
```

Create a `.env` file

```env
SF_CLIENT_ID=YOUR_CLIENT_ID
SF_CLIENT_SECRET=YOUR_CLIENT_SECRET
SF_REDIRECT_URI=http://localhost:5000/oauth2/callback
PORT=5000
```

Start the server

```bash
npm start
```

---

### 3. Frontend

Install dependencies

```bash
cd sf-assignment-frontend
npm install
```

Start Vite

```bash
npm run dev
```

---

## OAuth Flow

1. User clicks **Login to Salesforce**
2. Backend redirects to Salesforce login page
3. User authenticates
4. Salesforce redirects to the callback URL
5. Backend exchanges the authorization code for an access token
6. User is redirected back to the React application

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/auth/login` | Start OAuth login |
| GET | `/oauth2/callback` | OAuth callback |
| GET | `/api/rules` | Fetch validation rules |
| POST | `/api/rules/toggle` | Toggle a validation rule |
| POST | `/api/rules/enable-all` | Enable all rules |
| POST | `/api/rules/disable-all` | Disable all rules |

---

## Validation Rules Used

The project demonstrates managing multiple Account validation rules such as:

- Revenue required for Prospect accounts
- Website format validation
- Billing country and postal code validation
- Phone number format validation
- Parent account requirement for partner accounts

---

## Future Improvements

- Session-based authentication
- Token refresh support
- Better error handling
- Loading indicators
- Search and filter validation rules
- Deployment using Vercel and Render

---

## Author

**Siddhant Singh**

GitHub: https://github.com/siddhant3636

LinkedIn: https://www.linkedin.com/in/siddhant36/