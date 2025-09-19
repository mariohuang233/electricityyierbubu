#!/usr/bin/env node

// 连接问题修复脚本
const https = require('https');
const http = require('http');

// 颜色定义
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function print(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function printHeader() {
  print('purple', '🔧 连接问题修复工具');
  print('purple', '================================');
}

function testConnection(url, description) {
  return new Promise((resolve) => {
    print('blue', `\n🔍 测试 ${description}`);
    print('cyan', `URL: ${url}`);
    
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        print('green', `✅ 连接成功 (${res.statusCode})`);
        
        // 检查 CORS 头
        const corsHeaders = {
          'Access-Control-Allow-Origin': res.headers['access-control-allow-origin'],
          'Access-Control-Allow-Methods': res.headers['access-control-allow-methods'],
          'Access-Control-Allow-Headers': res.headers['access-control-allow-headers']
        };
        
        print('cyan', '📋 CORS 头信息:');
        Object.entries(corsHeaders).forEach(([key, value]) => {
          if (value) {
            print('green', `   ${key}: ${value}`);
          } else {
            print('yellow', `   ${key}: 未设置`);
          }
        });
        
        try {
          const json = JSON.parse(data);
          print('green', `📊 响应数据: ${JSON.stringify(json, null, 2)}`);
        } catch (e) {
          print('yellow', `⚠️  响应不是 JSON 格式`);
        }
        
        resolve({ success: true, status: res.statusCode, headers: res.headers });
      });
    });
    
    req.on('error', (error) => {
      print('red', `❌ 连接失败: ${error.message}`);
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(15000, () => {
      print('red', `❌ 连接超时`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

function testCorsPreflight(url, origin) {
  return new Promise((resolve) => {
    print('blue', `\n🔍 测试 CORS 预检请求`);
    print('cyan', `URL: ${url}`);
    print('cyan', `Origin: ${origin}`);
    
    const client = url.startsWith('https') ? https : http;
    
    const options = {
      method: 'OPTIONS',
      headers: {
        'Origin': origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    };
    
    const req = client.request(url, options, (res) => {
      print('green', `✅ 预检请求成功 (${res.statusCode})`);
      
      const corsHeaders = {
        'Access-Control-Allow-Origin': res.headers['access-control-allow-origin'],
        'Access-Control-Allow-Methods': res.headers['access-control-allow-methods'],
        'Access-Control-Allow-Headers': res.headers['access-control-allow-headers']
      };
      
      print('cyan', '📋 CORS 预检响应:');
      Object.entries(corsHeaders).forEach(([key, value]) => {
        if (value) {
          print('green', `   ${key}: ${value}`);
        } else {
          print('red', `   ${key}: 未设置`);
        }
      });
      
      resolve({ success: true, status: res.statusCode, headers: res.headers });
    });
    
    req.on('error', (error) => {
      print('red', `❌ 预检请求失败: ${error.message}`);
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      print('red', `❌ 预检请求超时`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
    
    req.end();
  });
}

async function main() {
  printHeader();
  
  const testUrl = process.argv[2];
  const frontendOrigin = process.argv[3] || 'https://electricity-monitor.vercel.app';
  
  if (!testUrl) {
    print('red', '❌ 请提供测试 URL');
    print('yellow', '💡 使用方法:');
    print('yellow', '   node fix-connection.js https://your-backend-url.com/api/health');
    print('yellow', '   node fix-connection.js https://your-backend-url.com/api/health https://your-frontend-url.com');
    process.exit(1);
  }
  
  // 测试基本连接
  const basicTest = await testConnection(testUrl, '基本连接测试');
  
  // 测试健康检查
  const healthUrl = testUrl.replace('/api/health', '/api/health');
  const healthTest = await testConnection(healthUrl, '健康检查');
  
  // 测试总览数据
  const overviewUrl = testUrl.replace('/api/health', '/api/overview');
  const overviewTest = await testConnection(overviewUrl, '总览数据');
  
  // 测试 CORS 预检
  const corsTest = await testCorsPreflight(testUrl, frontendOrigin);
  
  // 总结
  print('purple', '\n================================');
  print('purple', '📊 测试结果总结');
  print('purple', '================================');
  
  const tests = [
    { name: '基本连接', result: basicTest },
    { name: '健康检查', result: healthTest },
    { name: '总览数据', result: overviewTest },
    { name: 'CORS 预检', result: corsTest }
  ];
  
  let successCount = 0;
  tests.forEach(test => {
    if (test.result.success) {
      print('green', `✅ ${test.name}: 成功`);
      successCount++;
    } else {
      print('red', `❌ ${test.name}: 失败`);
    }
  });
  
  print('blue', `\n📈 成功率: ${successCount}/${tests.length} (${Math.round(successCount/tests.length*100)}%)`);
  
  if (successCount === tests.length) {
    print('green', '🎉 所有测试都成功了！');
  } else if (successCount > 0) {
    print('yellow', '⚠️  部分测试失败，需要进一步检查');
  } else {
    print('red', '❌ 所有测试都失败了！');
  }
  
  // 提供修复建议
  print('purple', '\n💡 修复建议:');
  
  if (!basicTest.success) {
    print('yellow', '1. 检查后端服务是否正在运行');
    print('yellow', '2. 验证 URL 是否正确');
    print('yellow', '3. 检查网络连接');
  }
  
  if (!corsTest.success) {
    print('yellow', '4. 检查后端 CORS 配置');
    print('yellow', '5. 确保前端域名在允许列表中');
    print('yellow', '6. 验证预检请求处理');
  }
  
  if (overviewTest.success && !overviewTest.headers['access-control-allow-origin']) {
    print('yellow', '7. 后端缺少 CORS 头，需要重新部署');
  }
}

main().catch(console.error);
