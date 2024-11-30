# HeyBud - Shopify Shared Shopping Experience

A Shopify app that enables real-time shared shopping experiences with voice chat and screen sharing capabilities.

## Features

- Real-time screen sharing
- Voice chat integration
- Session management
- Shopify Polaris UI components
- WebSocket-based communication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```env
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SCOPES=read_products,write_products
HOST=your_app_host
```

3. Start development server:
```bash
npm run dev
```

## Structure

- `/app` - Frontend React components
- `/server` - Backend Express server
- `/snippets` - Shopify theme integration

## License

MIT