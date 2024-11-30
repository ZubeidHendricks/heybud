import React, { useState } from 'react';
import { Card, Stack, Select, TextField, Button, Banner } from '@shopify/polaris';

export function AutomatedReports() {
  const [schedule, setSchedule] = useState('daily');
  const [recipients, setRecipients] = useState('');
  const [reportTypes, setReportTypes] = useState([]);
  const [saved, setSaved] = useState(false);

  const scheduleOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' }
  ];

  const reportOptions = [
    { label: 'Session Analytics', value: 'sessions' },
    { label: 'User Engagement', value: 'engagement' },
    { label: 'Product Views', value: 'products' },
    { label: 'Revenue Reports', value: 'revenue' }
  ];

  const handleSave = async () => {
    try {
      await fetch('/api/admin/reports/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedule,
          recipients: recipients.split(',').map(email => email.trim()),
          reportTypes
        })
      });
      setSaved(true);
    } catch (error) {
      console.error('Failed to save report schedule:', error);
    }
  };

  return (
    <Card title="Automated Reports">
      <Card.Section>
        {saved && (
          <Banner status="success" onDismiss={() => setSaved(false)}>
            Report schedule saved successfully
          </Banner>
        )}
        <Stack vertical>
          <Select
            label="Schedule"
            options={scheduleOptions}
            onChange={setSchedule}
            value={schedule}
          />
          <TextField
            label="Recipients (comma-separated emails)"
            value={recipients}
            onChange={setRecipients}
            placeholder="email@example.com, another@example.com"
          />
          <Select
            label="Report Types"
            options={reportOptions}
            onChange={setReportTypes}
            value={reportTypes}
            multiple
          />
          <Button primary onClick={handleSave}>
            Save Report Schedule
          </Button>
        </Stack>
      </Card.Section>
    </Card>
  );
}