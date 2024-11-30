import React, { useState, useEffect } from 'react';
import { Card, Tabs, DataTable, Stack, Select, Button, TextStyle } from '@shopify/polaris';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function ShoppingHistory({ userId, groupId }) {
  const [history, setHistory] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchHistory();
    fetchStatistics();
  }, [timeRange]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/shopping/history?timeRange=${timeRange}`);
      const data = await response.json();
      setHistory(data.history);
    } catch (error) {
      console.error('Failed to fetch shopping history:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`/api/shopping/statistics?timeRange=${timeRange}`);
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  const tabs = [
    {
      id: 'purchases',
      content: 'Purchases',
      component: (
        <DataTable
          columnContentTypes={['text', 'text', 'numeric', 'text']}
          headings={['Date', 'Product', 'Amount', 'Status']}
          rows={history.map(item => [
            new Date(item.date).toLocaleDateString(),
            item.productName,
            `$${item.amount}`,
            item.status
          ])}
        />
      )
    },
    {
      id: 'spending',
      content: 'Spending Analysis',
      component: (
        <Stack vertical>
          <BarChart width={600} height={300} data={statistics.spending}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
          <Card sectioned>
            <Stack distribution="equalSpacing">
              <Stack vertical>
                <TextStyle variation="strong">Total Spent</TextStyle>
                <p>${statistics.totalSpent}</p>
              </Stack>
              <Stack vertical>
                <TextStyle variation="strong">Average Order</TextStyle>
                <p>${statistics.averageOrder}</p>
              </Stack>
              <Stack vertical>
                <TextStyle variation="strong">Most Common Category</TextStyle>
                <p>{statistics.topCategory}</p>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      )
    },
    {
      id: 'shared',
      content: 'Group Sessions',
      component: (
        <DataTable
          columnContentTypes={['text', 'numeric', 'numeric', 'text']}
          headings={['Session', 'Participants', 'Total Spent', 'Top Product']}
          rows={statistics.groupSessions?.map(session => [
            session.id,
            session.participantCount,
            `$${session.totalSpent}`,
            session.topProduct
          ]) || []}
        />
      )
    }
  ];

  return (
    <Card title="Shopping History">
      <Card.Section>
        <Stack alignment="center" distribution="equalSpacing">
          <Select
            label="Time Range"
            options={[
              {label: 'This Month', value: 'month'},
              {label: '3 Months', value: 'quarter'},
              {label: 'This Year', value: 'year'}
            ]}
            value={timeRange}
            onChange={setTimeRange}
          />
          <Button>Export Data</Button>
        </Stack>
      </Card.Section>

      <Tabs
        tabs={tabs}
        selected={selectedTab}
        onSelect={setSelectedTab}
      >
        <Card.Section>
          {tabs[selectedTab].component}
        </Card.Section>
      </Tabs>
    </Card>
  );
}