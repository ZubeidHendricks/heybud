import React, { useState, useEffect } from 'react';
import { Card, ProgressBar, Stack, Button, TextStyle } from '@shopify/polaris';

export function ShoppingTimer({ sessionId, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onTimeUp();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addTime = () => {
    setTimeLeft(timeLeft => timeLeft + 300); // Add 5 minutes
  };

  return (
    <Card title="Shopping Session Timer">
      <Card.Section>
        <Stack vertical>
          <TextStyle variation="strong">Time Remaining: {formatTime(timeLeft)}</TextStyle>
          <ProgressBar
            progress={(timeLeft / (30 * 60)) * 100}
            size="small"
            color={timeLeft < 300 ? 'critical' : 'primary'}
          />
          <Stack distribution="equalSpacing">
            <Button onClick={() => setIsActive(!isActive)}>
              {isActive ? 'Pause' : 'Resume'}
            </Button>
            <Button onClick={addTime}>Add 5 Minutes</Button>
          </Stack>
        </Stack>
      </Card.Section>
    </Card>
  );
}