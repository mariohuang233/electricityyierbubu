import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Card } from 'antd';
import '../styles/airbnb-theme.css';

const TrendChart = ({ title, data, loading, type = 'line' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && !loading && data) {
      // 初始化图表
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current);
      }

      const option = getChartOption(type, data);
      chartInstance.current.setOption(option);

      // 响应式调整
      const handleResize = () => {
        chartInstance.current?.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [data, loading, type]);

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  const getChartOption = (chartType, chartData) => {
    const baseOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: {
            color: '#CD853F',
            opacity: 0.6
          }
        },
        backgroundColor: '#FEFEFE',
        borderColor: '#CD853F',
        borderWidth: 1,
        borderRadius: 8,
        textStyle: {
          color: '#2F2F2F',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        extraCssText: 'box-shadow: var(--shadow-medium);'
      },
      legend: {
        data: [],
        textStyle: {
          color: '#6B6B6B',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: 14
        },
        itemGap: 20
      },
      grid: {
        left: '8%',
        right: '8%',
        top: '15%',
        bottom: '15%',
        containLabel: true,
        backgroundColor: 'transparent'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        axisLine: {
          lineStyle: {
            color: '#E8E8E8'
          }
        },
        axisTick: {
          lineStyle: {
            color: '#E8E8E8'
          }
        },
        axisLabel: {
          color: '#6B6B6B',
          fontFamily: 'var(--font-family-primary)',
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        name: 'kWh',
        nameTextStyle: {
          color: '#6B6B6B',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        axisLine: {
          lineStyle: {
            color: '#E8E8E8'
          }
        },
        axisTick: {
          lineStyle: {
            color: '#E8E8E8'
          }
        },
        axisLabel: {
          color: '#6B6B6B',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: 12
        },
        splitLine: {
          lineStyle: {
            color: '#E8E8E8',
            type: 'dashed'
          }
        }
      },
      series: []
    };

    switch (chartType) {
      case '24h':
        return {
          ...baseOption,
          legend: {
            data: ['用电量', '剩余电量']
          },
          xAxis: {
            type: 'category',
            // 正确处理UTC时间，转换为北京时间显示
            data: chartData.map(item => {
              const utcDate = new Date(item.time);
              const beijingDate = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000);
              return `${beijingDate.getUTCHours().toString().padStart(2, '0')}:${beijingDate.getUTCMinutes().toString().padStart(2, '0')}`;
            })
          },
          series: [
            {
              name: '用电量',
              type: 'bar',
              data: chartData.map(item => item.used_kwh),
              itemStyle: { 
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#9CAF88' },
                    { offset: 1, color: '#CD853F' }
                  ]
                },
                borderRadius: [4, 4, 0, 0]
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: '#CD853F'
                }
              }
            },
            {
              name: '剩余电量',
              type: 'line',
              yAxisIndex: 0,
              data: chartData.map(item => item.remaining_kwh),
              itemStyle: { color: '#7CB342' },
              lineStyle: { 
                width: 3,
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 1, y2: 0,
                  colorStops: [
                    { offset: 0, color: '#7CB342' },
                    { offset: 1, color: '#9CAF88' }
                  ]
                }
              },
              symbol: 'circle',
              symbolSize: 6,
              smooth: true,
              areaStyle: {
                opacity: 0.1,
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#7CB342' },
                    { offset: 1, color: 'transparent' }
                  ]
                }
              }
            }
          ]
        };

      case 'today':
        return {
          ...baseOption,
          legend: {
            data: ['用电量']
          },
          xAxis: {
            type: 'category',
            data: chartData.map(item => `${item.hour}:00`)
          },
          series: [
            {
              name: '用电量',
              type: 'bar',
              data: chartData.map(item => item.used_kwh),
              itemStyle: { color: '#1890ff' }
            }
          ]
        };

      // 已删除 todayHourly 类型，统一使用 today 类型

      case 'daily30Days':
        // 过去30天用电趋势（折线图+柱状对比）
        return {
          ...baseOption,
          legend: {
            data: ['每日用电(折线)', '每日用电(柱状)']
          },
          xAxis: {
            type: 'category',
            data: chartData.map(item => {
              const date = new Date(item.date);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            })
          },
          yAxis: {
            type: 'value',
            name: '用电量 (kWh)'
          },
          series: [
            {
              name: '每日用电(折线)',
              type: 'line',
              smooth: true,
              data: chartData.map(item => item.used_kwh),
              itemStyle: { color: '#52c41a' },
              lineStyle: { width: 3 }
            },
            {
              name: '每日用电(柱状)',
              type: 'bar',
              data: chartData.map(item => item.used_kwh),
              itemStyle: { color: '#1890ff', opacity: 0.6 },
              barWidth: '40%'
            }
          ]
        };

      case '30d':
        return {
          ...baseOption,
          legend: {
            data: ['每日用电']
          },
          xAxis: {
            type: 'category',
            data: chartData.map(item => item.date.split('-').slice(1).join('/'))
          },
          series: [
            {
              name: '每日用电',
              type: 'line',
              smooth: true,
              data: chartData.map(item => item.used_kwh),
              itemStyle: { color: '#52c41a' },
              areaStyle: { opacity: 0.3 }
            }
          ]
        };

      case 'monthly':
        // 每月用电柱状图（1-12月）
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;
          const found = chartData.find(item => {
            const itemMonth = new Date(item.month).getMonth() + 1;
            return itemMonth === month;
          });
          return found ? found.used_kwh : 0;
        });
        const monthLabels = Array.from({ length: 12 }, (_, i) => `${i + 1}月`);
        
        return {
          ...baseOption,
          legend: {
            data: ['月度用电量']
          },
          xAxis: {
            type: 'category',
            data: monthLabels
          },
          yAxis: {
            type: 'value',
            name: '用电量 (kWh)'
          },
          series: [
            {
              name: '月度用电量',
              type: 'bar',
              data: monthlyData,
              itemStyle: { color: '#faad14' },
              barWidth: '60%'
            }
          ]
        };

      default:
        return baseOption;
    }
  };

  return (
    <Card 
      className="airbnb-card airbnb-chart-container chart-module modular-card--secondary fabric-texture fade-in-up apple-hover"
      style={{
        background: 'var(--neutral-cream)',
        border: '1px solid rgba(139, 69, 19, 0.1)',
        borderRadius: 'var(--radius-large)',
        boxShadow: 'var(--shadow-soft)',
        marginBottom: 'var(--spacing-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}
      headStyle={{
        background: 'linear-gradient(135deg, var(--primary-wood) 0%, var(--accent-warm-orange) 100%)',
        color: 'var(--neutral-cream)',
        borderRadius: 'var(--radius-large) var(--radius-large) 0 0',
        fontSize: 'var(--font-size-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        fontFamily: 'var(--font-family-primary)',
        padding: 'var(--spacing-lg) var(--spacing-xl)',
        border: 'none',
        position: 'relative',
        zIndex: 2
      }}
      bodyStyle={{
        padding: 'var(--spacing-xl)',
        background: 'transparent',
        position: 'relative',
        zIndex: 1
      }}
      title={title}
      loading={loading}
    >
      <div 
        className="airbnb-chart-container"
        ref={chartRef} 
        style={{ 
          width: '100%', 
          height: '400px',
          minHeight: '300px',
          background: 'var(--neutral-warm-white)',
          borderRadius: 'var(--radius-medium)',
          position: 'relative'
        }} 
      />
    </Card>
  );
};

export default TrendChart;