# Spacey Mail

A digital-to-physical mailing platform under Spacey Science that allows users to write digital letters to loved ones, military personnel, and inmates, converting digital drafts into physical, high-quality delivered mail.

## Features

- **Easy Letter Writing** - Write and send letters online from the comfort of your home
- **Multiple Recipients** - Send to loved ones, soldiers, and prisoners
- **Customization Options** - Choose paper and envelope colors, floral scents, and add postcards, photos, and documents
- **Emoji Support** - Use emojis in your letters, rendered in color for recipients
- **High Quality** - Professional printing on premium paper with specialized printers
- **Trackable Delivery** - Shipped on the first business day with SMS tracking codes
- **Permanent Access** - Re-read your sent letters anytime unless deleted
- **Time Saving** - No need to wait in line at the post office

## Tech Stack

### Client (Current)
- React 19
- React Router v7
- Tailwind CSS v4
- Vite

### Server (Planned)
- Node.js
- Express.js

## Project Structure

```
spacey-mail/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── layouts/        # Page layouts (MainLayout, AuthLayout, etc.)
│   │   ├── pages/
│   │   │   ├── marketing/  # Public marketing pages (Home, About, etc.)
│   │   │   ├── auth/       # Authentication pages
│   │   │   ├── dashboard/  # User dashboard pages
│   │   │   └── errors/     # Error pages (404, 500, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── styles/         # Global styles and Tailwind config
│   │   ├── App.tsx         # Main app component with routing
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Global styles with brand design system
│   ├── public/
│   │   └── fonts/          # Local font files
│   └── package.json
├── server/                 # Express backend (to be built)
└── README.md
```

## Brand Design System

### Fonts
- **Headings**: Readex Pro (Variable font, weights 100-900) with -2% letter-spacing
- **Body**: IBM Plex Mono (Regular 400, Bold 700)

### Color Palette
- **Brand BG**: `#080808` (50% Black - dominant base)
- **Neon Green**: `#32FCC7` (20% Innovation Accent)
- **Neon Blue**: `#1AD6FF` (10% Trust Accent)
- **Light Grey**: `#EAEAEA` (10% Primary Readable Text)
- **Baby Blue**: `#BCECFF` (5% Text Decoration & Emphasis)
- **Dark Grey**: `#1F242C` (5% Supporting UI container color)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Client Setup

```bash
cd client
npm install
npm run dev
```

The client will be available at `http://localhost:5173`

## Deployment

- **Client**: Deployed to `mail.spaceyscience.com`
- **Server**: To be deployed separately

## License

Proprietary - Spacey Science