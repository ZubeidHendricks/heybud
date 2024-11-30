import React from 'react';
import { Card, Button, ButtonGroup, Stack, Text } from '@shopify/polaris';
import { ShareMinor, MicrophoneMajor, LeaveMajor } from '@shopify/polaris-icons';

export function SessionControls({
  isSharing,
  isMuted,
  onToggleShare,
  onToggleMute,
  onLeaveSession,
  sessionInfo
}) {
  return (
    <Card>
      <Card.Section>
        <Stack distribution="equalSpacing" alignment="center">
          <Stack vertical spacing="extraTight">
            <Text variation="strong">Session ID: {sessionInfo.id}</Text>
            <Text variation="subdued">Duration: {sessionInfo.duration}</Text>
          </Stack>
          <ButtonGroup segmented>
            <Button
              icon={ShareMinor}
              pressed={isSharing}
              onClick={onToggleShare}
            >
              {isSharing ? 'Stop Sharing' : 'Share Screen'}
            </Button>
            <Button
              icon={MicrophoneMajor}
              pressed={isMuted}
              onClick={onToggleMute}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
            <Button
              icon={LeaveMajor}
              destructive
              onClick={onLeaveSession}
            >
              Leave
            </Button>
          </ButtonGroup>
        </Stack>
      </Card.Section>
    </Card>
  );
}