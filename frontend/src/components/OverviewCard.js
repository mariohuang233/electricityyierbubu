import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { ThunderboltOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import '../styles/airbnb-theme.css';

const OverviewCard = ({ data, loading }) => {
  return (
    <Card 
      className="airbnb-card modular-card modular-card--primary wood-texture fade-in-up apple-hover"
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
      title="📊 用电总览"
      loading={loading}
    >
      <Row gutter={[16, 24]}>
        <Col xs={12} sm={12} md={6} lg={6}>
          <div className="airbnb-statistic stat-module ripple-effect fade-in-up" style={{
            background: 'linear-gradient(135deg, rgba(152, 251, 152, 0.1) 0%, rgba(152, 251, 152, 0.05) 100%)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-medium)',
            textAlign: 'center',
            border: '1px solid rgba(152, 251, 152, 0.2)',
            transition: 'all var(--transition-normal)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="stat-module__icon icon-rotate" style={{
              fontSize: 'var(--font-size-2xl)',
              marginBottom: 'var(--spacing-sm)'
            }}>⚡</div>
            <div className="stat-module__value count-up" style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--primary-wood)',
              fontFamily: 'var(--font-family-primary)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              {(data?.today_usage || 0).toFixed(2)} kWh
            </div>
            <div className="stat-module__label" style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--neutral-dark-gray)',
              fontFamily: 'var(--font-family-primary)',
              opacity: 0.8
            }}>
              今日用电
            </div>
          </div>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <div className="airbnb-statistic stat-module ripple-effect fade-in-up" style={{
            background: 'linear-gradient(135deg, rgba(255, 218, 185, 0.1) 0%, rgba(255, 218, 185, 0.05) 100%)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-medium)',
            textAlign: 'center',
            border: '1px solid rgba(255, 218, 185, 0.2)',
            transition: 'all var(--transition-normal)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="stat-module__icon icon-rotate" style={{
              fontSize: 'var(--font-size-2xl)',
              marginBottom: 'var(--spacing-sm)'
            }}>📊</div>
            <div className="stat-module__value count-up" style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--primary-wood)',
              fontFamily: 'var(--font-family-primary)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              {(data?.week_usage || 0).toFixed(2)} kWh
            </div>
            <div className="stat-module__label" style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--neutral-dark-gray)',
              fontFamily: 'var(--font-family-primary)',
              opacity: 0.8
            }}>
              本周用电
            </div>
          </div>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <div className="airbnb-statistic stat-module ripple-effect fade-in-up" style={{
            background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, rgba(139, 69, 19, 0.05) 100%)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-medium)',
            textAlign: 'center',
            border: '1px solid rgba(139, 69, 19, 0.2)',
            transition: 'all var(--transition-normal)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="stat-module__icon icon-rotate" style={{
              fontSize: 'var(--font-size-2xl)',
              marginBottom: 'var(--spacing-sm)'
            }}>📅</div>
            <div className="stat-module__value count-up" style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--primary-wood)',
              fontFamily: 'var(--font-family-primary)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              {(data?.month_usage || 0).toFixed(2)} kWh
            </div>
            <div className="stat-module__label" style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--neutral-dark-gray)',
              fontFamily: 'var(--font-family-primary)',
              opacity: 0.8
            }}>
              本月用电
            </div>
          </div>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <div className="airbnb-statistic stat-module ripple-effect fade-in-up pulse-effect" style={{
            background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(255, 165, 0, 0.05) 100%)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-medium)',
            textAlign: 'center',
            border: '1px solid rgba(255, 165, 0, 0.2)',
            transition: 'all var(--transition-normal)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="stat-module__icon icon-rotate" style={{
              fontSize: 'var(--font-size-2xl)',
              marginBottom: 'var(--spacing-sm)'
            }}>💰</div>
            <div className="stat-module__value count-up" style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--primary-wood)',
              fontFamily: 'var(--font-family-primary)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              ¥{(data?.estimated_cost || 0).toFixed(2)}
            </div>
            <div className="stat-module__label" style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--neutral-dark-gray)',
              fontFamily: 'var(--font-family-primary)',
              opacity: 0.8
            }}>
              本月预计费用
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default OverviewCard;