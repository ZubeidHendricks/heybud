import React, { useState, useEffect } from 'react';
import { Card, Stack, Banner, Button } from '@shopify/polaris';

export function NotificationSystem({ sessionId, userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for real-time notifications
    window.socket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    return () => {
      window.socket.off('notification');
    };
  }, []);

  const handleDismiss = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  return (
    <Card title="Notifications">
      <Card.Section>
        <Stack vertical>
          {notifications.map((notification) => (
            <Banner
              key={notification.id}
              status={notification.type}
              onDismiss={() => handleDismiss(notification.id)}
              action={notification.action ? {
                content: notification.action.text,
                onAction: notification.action.handler
              } : null}
            >
              <p>{notification.message}</p>
            </Banner>
          ))}
          {notifications.length === 0 && (
            <p>No new notifications</p>
          )}
        </Stack>
      </Card.Section>
    </Card>
  );
}