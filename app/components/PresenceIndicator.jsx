import React from 'react';
import { Stack, Avatar, Text, Badge } from '@shopify/polaris';

export function PresenceIndicator({ participants }) {
  return (
    <Stack vertical spacing="tight">
      {participants.map((participant) => (
        <Stack key={participant.id} alignment="center" spacing="tight">
          <div style={{ position: 'relative' }}>
            <Avatar customer size="medium" name={participant.name} />
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: participant.isActive ? '#50b83c' : '#8c9196',
                border: '2px solid white',
              }}
            />
          </div>
          <Stack.Item fill>
            <Text variation="strong">{participant.name}</Text>
          </Stack.Item>
          {participant.isSharing && (
            <Badge status="info">Sharing</Badge>
          )}
          {participant.isMuted && (
            <Badge status="warning">Muted</Badge>
          )}
        </Stack>
      ))}
    </Stack>
  );
}