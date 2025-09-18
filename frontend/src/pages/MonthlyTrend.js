import React, { useState, useEffect } from 'react';
import { Layout, message, Spin, Button, Tabs } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import TrendChart from '../components/TrendChart';
import { electricityApi } from '../api/electricityApi';

const { Content, Header } = Layout;
const { TabPane } = Tabs;

const MonthlyTrend = ({ onBack }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [monthly, daily] = await Promise.all([
        electricityApi.getMonthlyTrend(),
        electricityApi.get30DayTrend()
      ]);
      
      setMonthlyData(monthly);
      setDailyData(daily);
    } catch (error) {
      console.error('获取趋势数据失败:', error);
      message.error('获取趋势数据失败');
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
        <h2 style={{ margin: 0, color: '#1890ff' }}>用电趋势分析</h2>
      </Header>
      
      <Content style={{ padding: '16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Spin spinning={loading}>
            <Tabs defaultActiveKey="30d" size="large">
              <TabPane tab="最近30天" key="30d">
                <TrendChart
                  title="最近30天每日用电量"
                  data={dailyData}
                  loading={loading}
                  type="30d"
                />
              </TabPane>
              
              <TabPane tab="月度统计" key="monthly">
                <TrendChart
                  title="最近12个月用电量"
                  data={monthlyData}
                  loading={loading}
                  type="monthly"
                />
              </TabPane>
            </Tabs>
          </Spin>
        </div>
      </Content>
    </Layout>
  );
};

export default MonthlyTrend;