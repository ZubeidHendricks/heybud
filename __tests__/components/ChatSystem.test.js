import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ChatSystem } from '../../app/components/ChatSystem';

describe('ChatSystem', () => {
  const mockProps = {
    sessionId: 'test-session',
    userName: 'Test User',
  };

  it('renders without crashing', () => {
    const { getByPlaceholderText } = render(<ChatSystem {...mockProps} />);
    expect(getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });

  it('sends a message when clicking send button', () => {
    const { getByPlaceholderText, getByText } = render(<ChatSystem {...mockProps} />);
    const input = getByPlaceholderText('Type your message...');
    const sendButton = getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello, world!' } });
    fireEvent.click(sendButton);

    expect(input.value).toBe('');
  });

  it('displays received messages', async () => {
    const { getByText } = render(<ChatSystem {...mockProps} />);
    
    // Simulate receiving a message
    const mockMessage = {
      id: 1,
      text: 'Test message',
      sender: 'Other User',
      timestamp: new Date().toISOString(),
    };

    // TODO: Add socket message simulation

    await waitFor(() => {
      expect(getByText('Test message')).toBeInTheDocument();
    });
  });
});