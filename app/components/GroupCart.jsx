import React, { useState, useEffect } from 'react';
import { Card, ResourceList, Stack, Button, TextStyle, Badge } from '@shopify/polaris';

export function GroupCart({ sessionId, participants }) {
  const [cartItems, setCartItems] = useState([]);
  const [contributions, setContributions] = useState({});

  const addToCart = (product) => {
    setCartItems(prev => [...prev, {
      id: Date.now(),
      product,
      addedBy: 'currentUser',
      timestamp: new Date(),
    }]);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + parseFloat(item.product.price), 0);
  };

  return (
    <Card title="Group Cart">
      <Card.Section>
        <ResourceList
          items={cartItems}
          renderItem={(item) => (
            <ResourceList.Item
              id={item.id}
              accessibilityLabel={`View details for ${item.product.title}`}
              media={<img src={item.product.image} alt={item.product.title} />}
            >
              <Stack>
                <Stack.Item fill>
                  <h3><TextStyle variation="strong">{item.product.title}</TextStyle></h3>
                  <p>${item.product.price}</p>
                  <Badge>{item.addedBy}'s pick</Badge>
                </Stack.Item>
                <Stack.Item>
                  <Button destructive onClick={() => removeFromCart(item.id)}>Remove</Button>
                </Stack.Item>
              </Stack>
            </ResourceList.Item>
          )}
        />
      </Card.Section>
      <Card.Section>
        <Stack distribution="equalSpacing">
          <TextStyle variation="strong">Total: ${calculateTotal()}</TextStyle>
          <Button primary>Proceed to Split Payment</Button>
        </Stack>
      </Card.Section>
    </Card>
  );
}