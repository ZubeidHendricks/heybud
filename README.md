# HeyBud - Shopify Shared Shopping Experience

A real-time shared shopping application for Shopify stores.

## Features

- Group Shopping Sessions
- Real-time Communication
- Split Payments
- Price Tracking
- Social Features
- Analytics Dashboard

## Setup

1. Clone the repository:
```bash
git clone https://github.com/ZubeidHendricks/heybud.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Run development server:
```bash
npm run dev
```

## Deployment

1. Deploy to Heroku:
```bash
git push heroku main
```

2. Set up environment variables in Heroku dashboard

3. Run database migrations:
```bash
heroku run npm run db:migrate
```

## License

MIT
