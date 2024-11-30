import React, { useState } from 'react';
import { Card, Stack, Button, TextStyle, Thumbnail, Icon } from '@shopify/polaris';
import { ThumbsUpMinor, ThumbsDownMinor } from '@shopify/polaris-icons';

export function VotingSystem({ product, participants }) {
  const [votes, setVotes] = useState({});
  const [comments, setComments] = useState([]);

  const handleVote = (userId, voteType) => {
    setVotes(prev => ({
      ...prev,
      [userId]: voteType
    }));
  };

  const addComment = (userId, comment) => {
    setComments(prev => [...prev, {
      id: Date.now(),
      userId,
      comment,
      timestamp: new Date()
    }]);
  };

  const calculateVoteResults = () => {
    const totalVotes = Object.values(votes).length;
    const positiveVotes = Object.values(votes).filter(v => v === 'up').length;
    return (positiveVotes / totalVotes) * 100;
  };

  return (
    <Card title="Group Decision Making">
      <Card.Section>
        <Stack vertical>
          <Stack alignment="center">
            <Thumbnail
              source={product.image}
              alt={product.title}
              size="small"
            />
            <Stack.Item fill>
              <TextStyle variation="strong">{product.title}</TextStyle>
              <p>${product.price}</p>
            </Stack.Item>
          </Stack>
          
          <Stack distribution="center">
            <Button 
              icon={ThumbsUpMinor}
              onClick={() => handleVote('currentUser', 'up')}
            >
              Yes ({Object.values(votes).filter(v => v === 'up').length})
            </Button>
            <Button 
              icon={ThumbsDownMinor}
              onClick={() => handleVote('currentUser', 'down')}
            >
              No ({Object.values(votes).filter(v => v === 'down').length})
            </Button>
          </Stack>

          {Object.keys(votes).length > 0 && (
            <div>
              <p>Group Interest: {calculateVoteResults().toFixed(0)}%</p>
              <progress value={calculateVoteResults()} max="100" />
            </div>
          )}
        </Stack>
      </Card.Section>
    </Card>
  );
}