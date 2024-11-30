import React, { useState, useEffect, useRef } from 'react';
import { Card, TextField, Button, Stack, Avatar, Text, Badge } from '@shopify/polaris';
import { MessageMajor } from '@shopify/polaris-icons';

export function ChatSystem({ sessionId, userName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: userName,
      timestamp: new Date().toISOString(),
    };

    // Emit message to socket
    window.socket.emit('chat-message', { sessionId, message });

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <Card title="Chat">
      <Card.Section>
        <div style={{ height: '300px', overflowY: 'auto' }}>
          <Stack vertical spacing="tight">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender === userName ? 'sent' : 'received'}`}>
                <Stack alignment="center" spacing="tight">
                  <Avatar customer size="small" name={message.sender} />
                  <Stack vertical spacing="extraTight">
                    <Text variation="strong">{message.sender}</Text>
                    <p>{message.text}</p>
                    <Text variation="subdued" as="span">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </Text>
                  </Stack>
                </Stack>
              </div>
            ))}
            <div ref={chatEndRef} />
          </Stack>
        </div>
      </Card.Section>
      <Card.Section>
        <Stack>
          <TextField
            label=""
            value={newMessage}
            onChange={setNewMessage}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button primary onClick={handleSendMessage} icon={MessageMajor}>
            Send
          </Button>
        </Stack>
      </Card.Section>
    </Card>
  );
}