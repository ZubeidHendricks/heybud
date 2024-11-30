import React, { useState, useEffect } from 'react';
import { Card, ResourceList, Stack, Button, TextStyle, ProgressBar } from '@shopify/polaris';

export function GroupRecommendations({ sessionId, participants }) {
  const [recommendations, setRecommendations] = useState([]);
  const [preferences, setPreferences] = useState({});

  useEffect(() => {
    // Fetch group preferences and generate recommendations
    fetchRecommendations();
  }, [sessionId]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`/api/recommendations/group/${sessionId}`);
      const data = await response.json();
      setRecommendations(data.recommendations);
      setPreferences(data.preferences);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    }
  };

  const calculateGroupMatch = (product) => {
    // Calculate how well a product matches group preferences
    const scores = participants.map(participant => {
      const userPrefs = preferences[participant.id] || {};
      return calculateMatchScore(product, userPrefs);
    });
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  };

  const calculateMatchScore = (product, preferences) => {
    // Implement preference matching logic
    let score = 0;
    if (preferences.priceRange) {
      const inRange = product.price >= preferences.priceRange[0] && 
                     product.price <= preferences.priceRange[1];
      score += inRange ? 1 : 0;
    }
    if (preferences.categories && preferences.categories.includes(product.category)) {
      score += 1;
    }
    // Add more preference matching logic here
    return score;
  };

  return (
    <Card title="Group Recommendations">
      <Card.Section>
        <ResourceList
          items={recommendations}
          renderItem={(product) => {
            const matchScore = calculateGroupMatch(product);
            return (
              <ResourceList.Item
                id={product.id}
                media={<img src={product.image} alt={product.title} />}
              >
                <Stack>
                  <Stack.Item fill>
                    <h3><TextStyle variation="strong">{product.title}</TextStyle></h3>
                    <p>${product.price}</p>
                    <div style={{ marginTop: '1rem' }}>
                      <TextStyle variation="subdued">Group Match:</TextStyle>
                      <ProgressBar
                        progress={matchScore * 100}
                        size="small"
                        color="primary"
                      />
                    </div>
                  </Stack.Item>
                  <Stack.Item>
                    <Button onClick={() => window.open(product.url)}>View Product</Button>
                  </Stack.Item>
                </Stack>
              </ResourceList.Item>
            );
          }}
        />
      </Card.Section>
    </Card>
  );
}