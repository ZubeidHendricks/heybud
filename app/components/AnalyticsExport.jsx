import React, { useState } from 'react';
import { Card, Button, DatePicker, Stack, Select, Banner } from '@shopify/polaris';
import { DownloadMinor } from '@shopify/polaris-icons';

export function AnalyticsExport() {
  const [startDate, setStartDate] = useState(new Date());
  const [format, setFormat] = useState('csv');
  const [downloading, setDownloading] = useState(false);

  const exportOptions = [
    { label: 'CSV', value: 'csv' },
    { label: 'JSON', value: 'json' },
    { label: 'Excel', value: 'xlsx' }
  ];

  const handleExport = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`/api/admin/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, format })
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString()}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card title="Export Analytics Data">
      <Card.Section>
        <Stack vertical>
          <DatePicker
            month={startDate.getMonth()}
            year={startDate.getFullYear()}
            onChange={setStartDate}
            selected={startDate}
          />
          <Select
            label="Export Format"
            options={exportOptions}
            onChange={setFormat}
            value={format}
          />
          <Button
            primary
            loading={downloading}
            icon={DownloadMinor}
            onClick={handleExport}
          >
            Export Data
          </Button>
        </Stack>
      </Card.Section>
    </Card>
  );
}