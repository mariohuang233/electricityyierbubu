// 调试API调用
const testAPI = async () => {
  try {
    console.log('🔍 开始测试API调用...');
    
    // 测试总览API
    const response = await fetch('http://localhost:3001/api/overview');
    console.log('📡 API响应状态:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📊 API返回数据:', data);
    
    // 检查关键字段
    console.log('🔋 current_remaining_kwh:', data.current_remaining_kwh);
    console.log('⏰ last_updated:', data.last_updated);
    
    if (data.current_remaining_kwh !== undefined) {
      console.log('✅ 剩余电量字段存在');
    } else {
      console.log('❌ 剩余电量字段缺失');
    }
    
    return data;
  } catch (error) {
    console.error('❌ API调用失败:', error);
    throw error;
  }
};

// 在浏览器控制台中运行
if (typeof window !== 'undefined') {
  window.testAPI = testAPI;
  console.log('💡 在浏览器控制台中运行: testAPI()');
}

module.exports = testAPI;
