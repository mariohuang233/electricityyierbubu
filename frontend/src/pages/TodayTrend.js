import React, { useState, useEffect } from 'react';
import { Layout, message, Spin, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import TrendChart from '../components/TrendChart';
import { electricityApi } from '../api/electricityApi';

const { Content, Header } = Layout;

const TodayTrend = ({ onBack }) => {
  const [todayData, setTodayData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayData();
    // 每10分钟刷新一次数据
    const interval = setInterval(fetchTodayData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTodayData = async () => {
    try {
      setLoading(true);
      const data = await electricityApi.getTodayTrend();
      setTodayData(data);
    } catch (error) {
      console.error('获取当天数据失败:', error);
      message.error('获取当天数据失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={onBack}
          style={{ marginRight: '16px' }}
        >
          返回
        </Button>
        <h2 style={{ margin: 0, color: '#1890ff' }}>当天用电趋势</h2>
      </Header>
      
      <Content style={{ padding: '16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Spin spinning={loading}>
            <TrendChart
              title="今日各小时用电量"
              data={todayData}
              loading={loading}
              type="today"
            />
          </Spin>
        </div>
      </Content>
    </Layout>
  );
};

export default TodayTrend;