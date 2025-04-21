import React, { useEffect, useState } from 'react'
import { Line } from '@ant-design/charts'
import { Card, Space } from 'antd'
import api from '../../../utils/api'

const DemoChart: React.FC = () => {
  const [data, setData] = useState<{ date: string; value: number }[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/events/stats')
        res.data = res.data.map((item: { date: string; value: number }) => ({
          date: new Date(item.date).toLocaleDateString(),
          value: item.value,
        }))
        setData(res.data)
      } catch (err) {
        console.error('Failed to load event stats', err)
      }
    }

    fetchStats()
  }, [])

  const lineConfig = {
    data,
    xField: 'date',
    yField: 'value',
    point: {
      shapeField: 'square',
      sizeField: 4,
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2,
    },
  }

  return (
    <div className="p-4" style={{ width: '100%' }}>
      <Space direction="vertical" size="large" style={{ display: 'flex', width: '100%' }}>
        <Card title="Events Created per Day" style={{ width: '100%' }}>
          <div style={{ width: '100%', minHeight: '300px' }}>
            <Line {...lineConfig} />
          </div>
        </Card>
      </Space>
    </div>
  )
}

export default DemoChart
