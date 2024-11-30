# HeyBud Setup Guide

## Prerequisites
- Node.js 14.x or higher
- npm 6.x or higher
- A Shopify Partner account
- A Shopify development store

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YourUsername/heybud.git
cd heybud
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit .env with your Shopify app credentials.

4. Start development server:
```bash
npm run dev
```

## Configuration

### Shopify App Setup
1. Go to your Shopify Partner dashboard
2. Create a new app
3. Set the App URL to your development URL
4. Add the required scopes
5. Copy the API credentials to your .env file

### WebSocket Setup
1. Make sure your server supports WebSocket connections
2. Configure CORS if needed
3. Set up SSL for secure connections

## Testing
```bash
npm run test
```

## Deployment
1. Build the app:
```bash
npm run build
```

2. Deploy to your hosting service
3. Update the Shopify app URLs
4. Test the deployment