import React, { useState, useEffect } from 'react';
import { Layout, message, Spin } from 'antd';
import OverviewCard from '../components/OverviewCard';
import TrendChart from '../components/TrendChart';
import { electricityApi } from '../api/electricityApi';
import '../styles/airbnb-theme.css';

const { Content } = Layout;

const Overview = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [trend24h, setTrend24h] = useState([]);
  const [todayHourly, setTodayHourly] = useState([]);
  const [daily30Days, setDaily30Days] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // 每5分钟刷新一次数据
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [overview, trend, hourly, daily, monthly] = await Promise.all([
        electricityApi.getOverview(),
        electricityApi.get24HourTrend(),
        electricityApi.getTodayHourlyData(),
        electricityApi.getDaily30DaysData(),
        electricityApi.getMonthlyData()
      ]);
      
      setOverviewData(overview);
      setTrend24h(trend);
      setTodayHourly(hourly);
      setDaily30Days(daily);
      setMonthlyTrend(monthly);
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
    }}>
      <Content style={{ 
        padding: '40px 24px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%'
      }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            padding: '0 var(--spacing-md)'
          }}>
            <div className="title-slide" style={{ 
              textAlign: 'center',
              marginBottom: '80px',
              padding: '60px 0 40px 0',
              position: 'relative'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <span style={{
                  fontSize: '28px',
                  marginRight: '12px',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }}>🏠</span>
                <h1 style={{ 
                  margin: 0, 
                  fontSize: '48px',
                  fontWeight: '700',
                  lineHeight: '1.1',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, #1d1d1f 0%, #86868b 50%, #1d1d1f 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none'
                }}>
                  家庭用电监控系统
                </h1>
              </div>
              <p style={{
                margin: '0',
                color: '#86868b',
                fontSize: '21px',
                fontWeight: '400',
                lineHeight: '1.4',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                letterSpacing: '-0.01em',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                智能监控，精准分析，让每一度电都物有所值
              </p>
            </div>
          
          <Spin spinning={loading} style={{
            background: 'transparent'
          }}>
            <OverviewCard data={overviewData} loading={loading} />
            
            <TrendChart
              title="过去24小时用电趋势"
              data={trend24h}
              loading={loading}
              type="24h"
            />
            
            <TrendChart
              title="当天用电分布"
              data={todayHourly}
              loading={loading}
              type="today"
            />
            
            <TrendChart
              title="过去30天用电趋势"
              data={daily30Days}
              loading={loading}
              type="30d"
            />
            
            <TrendChart
              title="月度用电统计"
              data={monthlyTrend}
              loading={loading}
              type="monthly"
            />
          </Spin>
        </div>
      </Content>
    </Layout>
  );
};

export default Overview;