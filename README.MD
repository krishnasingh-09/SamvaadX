# SamvaadX - Real-Time Chat Application

SamvaadX is a modern, full-stack real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js). It features secure authentication, real-time messaging powered by Socket.io, and a beautiful, responsive UI.

> **"Samvaad"** means "conversation" or "dialogue" in Hindi, reflecting the app's core purpose of connecting people through meaningful conversations.

---

## 🚀 Live Demo

**[Visit SamvaadX Live](https://samvaad-x-znx1.vercel.app/)**


## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Authentication & Security
- **JWT-based Authentication** - Secure token-based authentication with HTTP-only cookies
- **Email Verification via OTP** - Users must verify their email with a 6-digit OTP before accessing the app
- **Password Reset** - Forgot password functionality with OTP-based verification
- **Arcjet Protection** - Rate limiting and bot detection to prevent abuse

### Chat Request System
- **Privacy-First Messaging** - Users cannot message each other until a chat request is accepted
- **Send/Accept/Reject Requests** - Full control over who can message you
- **Real-time Request Notifications** - Instant notifications when someone sends you a chat request
- **Request Status Tracking** - See pending, accepted, and rejected request status

### Real-Time Messaging
- **Instant Messaging** - Real-time message delivery powered by Socket.io
- **Online Presence Indicators** - See which users are currently online
- **Image Sharing** - Share images in conversations (uploaded to Cloudinary)
- **Message History** - Persistent chat history stored in MongoDB

### User Experience
- **Responsive Design** - Beautiful UI that works on desktop and mobile
- **Dark Theme** - Modern dark theme with cyan accents
- **Interactive Sound Effects** - Keystroke sounds, click sounds, and notification sounds
- **Animated Borders** - Sleek animated border effects on UI components
- **Profile Pictures** - Upload and display custom profile pictures
- **Contact Search** - Search through your contacts and all users

### Email Notifications
- **Welcome Email** - Personalized welcome email after successful signup
- **OTP Emails** - Styled HTML emails for OTP verification
- **Password Reset Emails** - Secure password reset OTP delivery
- **Dual Email Provider Support** - Supports both Resend and Gmail SMTP

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite | Build Tool |
| Zustand | State Management |
| React Router 7 | Client-side Routing |
| Socket.io Client | Real-time Communication |
| Tailwind CSS | Styling |
| DaisyUI | UI Components |
| Lucide React | Icons |
| Axios | HTTP Client |
| React Hot Toast | Notifications |
| Sass | CSS Preprocessing |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| Socket.io | Real-time Communication |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Cloudinary | Image Storage |
| Nodemailer | Email (SMTP) |
| Resend | Email (API) |
| Arcjet | Security (Rate Limiting & Bot Protection) |

---

## Project Structure

```
SamvaadX/
├── backend/
│   └── src/
│       ├── controllers/
│       │   ├── auth.controller.js      # Authentication logic
│       │   ├── chat-request.controller.js  # Chat request handling
│       │   └── message.controller.js   # Messaging logic
│       ├── emails/
│       │   ├── emailHandlers.js        # Email sending functions
│       │   └── emailTemplates.js       # HTML email templates
│       ├── lib/
│       │   ├── arcjet.js               # Arcjet configuration
│       │   ├── cloudinary.js           # Cloudinary setup
│       │   ├── db.js                   # MongoDB connection
│       │   ├── env.js                  # Environment variables
│       │   ├── nodemailer.js           # SMTP configuration
│       │   ├── resend.js               # Resend API setup
│       │   ├── socket.js               # Socket.io setup
│       │   └── utils.js                # Utility functions
│       ├── middleware/
│       │   ├── arcjet.middleware.js    # Security middleware
│       │   ├── auth.middleware.js      # JWT verification
│       │   └── socket.auth.middleware.js  # Socket authentication
│       ├── models/
│       │   ├── ChatRequest.js          # Chat request schema
│       │   ├── Message.js              # Message schema
│       │   └── User.js                 # User schema
│       ├── routes/
│       │   ├── auth.route.js           # Auth endpoints
│       │   ├── chat-request.route.js   # Chat request endpoints
│       │   └── message.route.js        # Message endpoints
│       └── server.js                   # Express app entry
│
├── frontend/
│   ├── public/
│   │   ├── sounds/                     # Sound effects
│   │   ├── avatar.png                  # Default avatar
│   │   └── *.png                       # Static images
│   └── src/
│       ├── components/
│       │   ├── ActiveTabSwitch.jsx     # Chat/Requests tab switcher
│       │   ├── BorderAnimatedContainer.jsx  # Animated border effect
│       │   ├── ChatContainer.jsx       # Main chat area
│       │   ├── ChatHeader.jsx          # Chat header with user info
│       │   ├── ChatRequestsPanel.jsx   # Pending requests list
│       │   ├── ChatsList.jsx           # Chat conversations list
│       │   ├── ContactList.jsx         # All contacts sidebar
│       │   ├── MessageInput.jsx        # Message composer
│       │   ├── ProfileHeader.jsx       # User profile display
│       │   ├── SendChatRequestModal.jsx    # Request sending modal
│       │   └── SendChatRequestPrompt.jsx   # Request CTA in chat
│       ├── pages/
│       │   ├── ChatPage.jsx            # Main chat interface
│       │   ├── ForgotPasswordPage.jsx  # Password reset
│       │   ├── LoginPage.jsx           # User login
│       │   ├── SignUpPage.jsx          # User registration
│       │   └── VerifyEmailPage.jsx     # OTP verification
│       ├── store/
│       │   ├── useAuthStore.js         # Authentication state
│       │   └── useChatStore.js         # Chat & messaging state
│       ├── App.jsx                     # Root component
│       └── main.jsx                    # React entry point
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or Atlas)
- **Cloudinary Account** (for image uploads)
- **Email Provider** (Resend API key OR Gmail App Password)
- **Arcjet Account** (optional, for security features)

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017/samvaadx

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email - Option 1: Resend (Recommended)
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=SamvaadX

# Email - Option 2: Gmail SMTP
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password

# Security (Optional)
ARCJET_KEY=ajkey_your_arcjet_key
ARCJET_ENV=development
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/krishnasingh-09/SamvaadX.git
   cd samvaadx
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The server will start on `http://localhost:3000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The app will open on `http://localhost:5173`

### Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start in production mode**
   ```bash
   cd backend
   NODE_ENV=production npm start
   ```

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register a new user |
| POST | `/verify-otp` | Verify email with OTP |
| POST | `/resend-otp` | Resend verification OTP |
| POST | `/login` | User login |
| POST | `/logout` | User logout |
| PUT | `/update-profile` | Update profile picture |
| POST | `/forgot-password` | Request password reset OTP |
| POST | `/reset-password` | Reset password with OTP |

### Messages (`/api/messages`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts` | Get all registered users |
| GET | `/chats` | Get users with accepted chat requests |
| GET | `/chat-status/:id` | Check chat request status with a user |
| GET | `/:id` | Get messages with a specific user |
| POST | `/send/:id` | Send a message to a user |

### Chat Requests (`/api/chat-requests`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pending` | Get all pending chat requests |
| POST | `/send/:receiverId` | Send a chat request |
| PUT | `/accept/:requestId` | Accept a chat request |
| PUT | `/reject/:requestId` | Reject a chat request |

---

## Security Features

### Authentication Security
- **Password Hashing** - All passwords are hashed using bcryptjs with salt rounds
- **JWT Tokens** - Secure, HTTP-only cookies for session management
- **OTP Verification** - Time-limited OTPs (10 minutes) for email verification

### API Protection
- **Rate Limiting** - Arcjet-powered rate limiting to prevent abuse
- **Bot Detection** - Automatic detection and blocking of malicious bots
- **Spoofed Bot Detection** - Identifies bots pretending to be legitimate browsers

### Data Protection
- **Chat Request System** - Users must accept requests before receiving messages
- **Input Validation** - All inputs are validated on both client and server
- **CORS Protection** - Configured CORS to only allow requests from the frontend

---

## Screenshots

### Login Page
![Login](frontend/public/login.png)

### Signup Page
![Signup](frontend/public/signup.png)


**Made with love by the Krishna**
