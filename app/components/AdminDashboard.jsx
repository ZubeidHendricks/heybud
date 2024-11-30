import React, { useState, useEffect } from 'react';
import { Card, Tabs, Layout, DataTable, Filters, Button, Badge } from '@shopify/polaris';

export function AdminDashboard() {
  const [selected, setSelected] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [products, setProducts] = useState([]);

  const tabs = [
    { id: 'sessions', content: 'Active Sessions', accessibilityLabel: 'Active Sessions' },
    { id: 'participants', content: 'Participants', accessibilityLabel: 'Participants' },
    { id: 'messages', content: 'Messages', accessibilityLabel: 'Messages' },
    { id: 'products', content: 'Viewed Products', accessibilityLabel: 'Viewed Products' },
    { id: 'analytics', content: 'Analytics', accessibilityLabel: 'Analytics' },
  ];

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selected]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/admin/${tabs[selected].id}`);
      const data = await response.json();
      
      switch(tabs[selected].id) {
        case 'sessions':
          setSessions(data);
          break;
        case 'participants':
          setParticipants(data);
          break;
        case 'messages':
          setMessages(data);
          break;
        case 'products':
          setProducts(data);
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderContent = () => {
    switch(tabs[selected].id) {
      case 'sessions':
        return (
          <Card>
            <DataTable
              columnContentTypes={['text', 'text', 'numeric', 'text']}
              headings={['Session ID', 'Shop Domain', 'Participants', 'Status']}
              rows={sessions.map(session => [
                session.session_id,
                session.shop_domain,
                session.participant_count,
                <Badge status={session.active ? 'success' : 'critical'}>
                  {session.active ? 'Active' : 'Inactive'}
                </Badge>
              ])}
            />
          </Card>
        );

      case 'participants':
        return (
          <Card>
            <DataTable
              columnContentTypes={['text', 'text', 'text', 'text']}
              headings={['Name', 'Session', 'Joined At', 'Status']}
              rows={participants.map(participant => [
                participant.user_name,
                participant.session_id,
                new Date(participant.joined_at).toLocaleString(),
                <Badge status={participant.status.online ? 'success' : 'critical'}>
                  {participant.status.online ? 'Online' : 'Offline'}
                </Badge>
              ])}
            />
          </Card>
        );

      case 'messages':
        return (
          <Card>
            <DataTable
              columnContentTypes={['text', 'text', 'text', 'text']}
              headings={['Time', 'Session', 'User', 'Message']}
              rows={messages.map(message => [
                new Date(message.created_at).toLocaleString(),
                message.session_id,
                message.user_name,
                message.content
              ])}
            />
          </Card>
        );

      case 'products':
        return (
          <Card>
            <DataTable
              columnContentTypes={['text', 'text', 'numeric', 'text']}
              headings={['Product', 'Session', 'Views', 'Last Viewed']}
              rows={products.map(product => [
                product.product_data.title,
                product.session_id,
                product.view_count,
                new Date(product.last_viewed_at).toLocaleString()
              ])}
            />
          </Card>
        );

      case 'analytics':
        return (
          <Layout>
            <Layout.Section oneHalf>
              <Card title="Session Statistics">
                <Card.Section>
                  <p>Average Session Duration: {sessions.avg_duration} minutes</p>
                  <p>Active Sessions: {sessions.active_count}</p>
                  <p>Total Sessions Today: {sessions.total_today}</p>
                </Card.Section>
              </Card>
            </Layout.Section>
            <Layout.Section oneHalf>
              <Card title="Engagement Metrics">
                <Card.Section>
                  <p>Messages per Session: {messages.avg_per_session}</p>
                  <p>Products Viewed per Session: {products.avg_per_session}</p>
                  <p>Average Participants: {participants.avg_per_session}</p>
                </Card.Section>
              </Card>
            </Layout.Section>
          </Layout>
        );
    }
  };

  return (
    <div>
      <Tabs tabs={tabs} selected={selected} onSelect={setSelected} />
      {renderContent()}
    </div>
  );
}