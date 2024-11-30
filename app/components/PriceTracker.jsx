import React, { useState, useEffect } from 'react';
import { Card, Stack, Button, TextStyle, DataTable, Banner } from '@shopify/polaris';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function PriceTracker({ productId }) {
  const [priceHistory, setPriceHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [targetPrice, setTargetPrice] = useState(null);

  const addPriceAlert = async (price) => {
    try {
      const response = await fetch('/api/price-alerts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          targetPrice: price
        })
      });

      const data = await response.json();
      if (data.success) {
        setAlerts(prev => [...prev, data.alert]);
      }
    } catch (error) {
      console.error('Failed to create price alert:', error);
    }
  };

  return (
    <Card title="Price Tracker">
      <Card.Section>
        <LineChart width={600} height={300} data={priceHistory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </Card.Section>

      <Card.Section title="Price Alerts">
        <Stack vertical>
          {alerts.map(alert => (
            <Banner
              key={alert.id}
              status={alert.triggered ? 'success' : 'info'}
              onDismiss={() => {}}
            >
              Alert when price drops below ${alert.targetPrice}
            </Banner>
          ))}
          <Button onClick={() => addPriceAlert(targetPrice)}>Add Price Alert</Button>
        </Stack>
      </Card.Section>

      <Card.Section title="Price Statistics">
        <DataTable
          columnContentTypes={['text', 'numeric']}
          headings={['Metric', 'Value']}
          rows={[
            ['Lowest Price', `$${Math.min(...priceHistory.map(p => p.price))}`],
            ['Highest Price', `$${Math.max(...priceHistory.map(p => p.price))}`],
            ['Average Price', `$${(priceHistory.reduce((a, b) => a + b.price, 0) / priceHistory.length).toFixed(2)}`]
          ]}
        />
      </Card.Section>
    </Card>
  );
}