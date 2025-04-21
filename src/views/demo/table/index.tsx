import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Table } from 'antd';
import type { TableProps } from 'antd';
import api from '../../../utils/api';

interface DataType {
  key: string;
  eventName: string;
  startTime: string;
  endTime: string;
  calendarName: string;
}

const DemoTable: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
    total: number;
  }>({
    current: 1,
    pageSize: 10,
    total: 40,
  });

  
  const handleUpdate = (record: DataType) => {
    console.log('Update clicked for:', record)
    // Example: open a modal or navigate to edit page
    // navigate(`/events/edit/${record.key}`)
  }

  const handleDelete = async (record: DataType) => {
    try {
      await api.delete(`/events/${record.key}`)
      fetchEvents({
        event_name: query || undefined,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize,
      })
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
  }

  const fetchEvents = async (params: { event_name?: string; limit: number; offset: number }) => {
    try {
      setLoading(true);

      const response = await api.get('/events', {
        params,
      });

      const events = response.data.data;
      const total = response.data.pagination.totalCount || 0; // Make sure your API returns total

      const transformed: DataType[] = events.map((event: any) => ({
        key: event.id.toString(),
        eventName: event.event_name,
        startTime: new Date(event.start_time).toLocaleString(),
        endTime: new Date(event.end_time).toLocaleString(),
        calendarName: event.calendar?.calendar_name || '—',
      }));

      setData(transformed);
      setPagination((prev) => ({ ...prev, total }));
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange: TableProps<DataType>['onChange'] = (paginationConfig) => {
    const { current = 1, pageSize = 10 } = paginationConfig;
    setPagination((prev) => ({ ...prev, current, pageSize }));

    fetchEvents({
      event_name: query || undefined,
      limit: pageSize,
      offset: (current - 1) * pageSize,
    });
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 })); // reset to first page
    setQuery(searchTerm.trim());
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Fetch on first load and on query change
  useEffect(() => {
    fetchEvents({
      event_name: query || undefined,
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
    });
  }, [query, pagination.current, pagination.pageSize]);

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Event Name',
      dataIndex: 'eventName',
      key: 'eventName',
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: 'Calendar',
      dataIndex: 'calendarName',
      key: 'calendarName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_text, record) => (
        <Space size="middle">
          <Button onClick={() => handleUpdate(record)}>Update</Button>
          <Button danger onClick={() => handleDelete(record)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by event name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleInputKeyDown}
          allowClear
        />
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          showTotal: (total) => `Total ${total} items`,
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default DemoTable;
