import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://electricityyierbubu-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API请求失败:', error);
    
    // 统一错误处理
    let errorMessage = '网络请求失败';
    
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response;
      switch (status) {
        case 400:
          errorMessage = data?.error || '请求参数错误';
          break;
        case 401:
          errorMessage = '未授权访问';
          break;
        case 403:
          errorMessage = '禁止访问';
          break;
        case 404:
          errorMessage = '接口不存在';
          break;
        case 500:
          errorMessage = data?.error || '服务器内部错误';
          break;
        default:
          errorMessage = data?.error || `请求失败 (${status})`;
      }
    } else if (error.request) {
      // 网络错误
      errorMessage = '网络连接失败，请检查网络设置';
    } else {
      // 其他错误
      errorMessage = error.message || '未知错误';
    }
    
    // 创建统一的错误对象
    const apiError = new Error(errorMessage);
    apiError.originalError = error;
    apiError.status = error.response?.status;
    
    return Promise.reject(apiError);
  }
);

export const electricityApi = {
  // 获取总览数据
  getOverview: () => api.get('/overview'),
  
  // 获取过去24小时趋势
  get24HourTrend: () => api.get('/trend/24h'),
  
  // 获取当天用电（按小时）
  getTodayHourlyData: () => api.get('/trend/today'),
  
  // 获取最近30天每日用电
  getDaily30DaysData: () => api.get('/trend/30d'),
  
  // 获取每月用电
  getMonthlyData: () => api.get('/trend/monthly'),
  
  // 健康检查
  healthCheck: () => api.get('/health'),
};

export default electricityApi;