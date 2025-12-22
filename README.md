# Mini Wallet Dashboard

A React-based mini banking dashboard with real-time transactions, account management, and money transfer capabilities.

## Features

**Real-time Transaction Dashboard**
- View all transactions with running balance
- Filter by category, date range and search
- Responsive design (360px to desktop)

**Secure Money Transfers**
- Transfer between accounts with validation
- Form validation (positive decimals, sufficient balance)

**State Management**
- Built with Zustand for predictable state
- Optimistic updates for smooth UX
- Use createJSONStorage and persist from Zustand middleware to persist the data

**Security & Best Practices**
- No sensitive data logged in console
- Disabled submit during processing
- Clear error messages without exposing internals

**Accessibility**
- Semantic HTML elements
- Keyboard navigation support
- ARIA labels where needed

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast builds
- **Zustand** for state management
- **Tailwind CSS** for styling
- **React Router** for navigation
- **date-fns** for date formatting
- **Lucide React** for icons

## Setup Instructions

 **Clone and install:**
```bash
git clone https://github.com/adewale2018/mini_wallet.git
cd mini_wallet
npm install
npm run dev to start the application
