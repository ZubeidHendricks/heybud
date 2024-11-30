# Deployment Guide

## Heroku Deployment

1. Create a Heroku account at heroku.com
2. Install Heroku CLI:
   ```bash
   npm install -g heroku
   ```

3. Login to Heroku:
   ```bash
   heroku login
   ```

4. Create a new Heroku app:
   ```bash
   heroku create heybud-app
   ```

5. Set environment variables:
   ```bash
   heroku config:set SHOPIFY_API_KEY=your_api_key
   heroku config:set SHOPIFY_API_SECRET=your_api_secret
   heroku config:set HOST=https://your-app-name.herokuapp.com
   ```

6. Deploy the app:
   ```bash
   git push heroku main
   ```

## Shopify App Setup

1. Go to your Shopify Partner dashboard
2. Update your app URLs:
   - App URL: https://your-app-name.herokuapp.com
   - Allowed redirection URL(s): https://your-app-name.herokuapp.com/auth/callback

3. Save the changes

## Testing the Deployment

1. Install the app on a development store
2. Test all features:
   - Real-time communication
   - Product synchronization
   - Chat system
   - Analytics

## Monitoring

1. View logs:
   ```bash
   heroku logs --tail
   ```

2. Monitor dyno status:
   ```bash
   heroku ps
   ```

## Scaling

To scale the app:
```bash
heroku ps:scale web=2
```

## Troubleshooting

1. Check logs for errors
2. Verify environment variables
3. Ensure WebSocket connection is working
4. Test database connectivity