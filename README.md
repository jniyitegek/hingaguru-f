# Hingaguru

A comprehensive farm management platform that empowers farmers with smart solutions for managing employees, farmlands, crops, finances, and AI-powered insights.

## Tech Stack

### Frontend
- Next.js 15
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React Icons

### Backend
- Node.js
- Express
- MongoDB

## Project Structure

```
hingaguru/
├── frontend/          # Next.js 15 application
└── backend/           # Express API server
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

By default the API listens on port `3000`. You can override this in `.env` (see below).

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Set the `NEXT_PUBLIC_API_BASE_URL` environment variable so the Next.js app knows how to reach the Express API (defaults to `http://localhost:3000` when unset).

## Features

- **Employee Management** - Track workforce, scheduling, and performance
- **Farmland Management** - Visualize and manage land with detailed mapping
- **Crop Management** - Monitor crop cycles and optimize yields
- **Financial Tracking** - Expense tracking and revenue analysis
- **AI Assistant** - Intelligent insights and crop disease detection
- **Partner Collaboration** - Seamless collaboration with suppliers and buyers

## Environment Variables

Create `.env` files in both frontend and backend directories with appropriate configurations.

#### Backend (`backend/.env`)

```
MONGO_URL=mongodb://127.0.0.1:27017/hingaguru
PORT=3000
DUMMY_USER_EMAIL=demo@hingaguru.com
DUMMY_USER_NAME=Demo Farmer
DUMMY_USER_PHONE=+250700000000
```

#### Frontend (`frontend/.env.local`)

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## License

© 2025 Hingaguru. All rights reserved.