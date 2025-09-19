#!/usr/bin/env node

// API 连接测试脚本
const https = require('https');
const http = require('http');

// 颜色定义
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function print(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testApi(url, description) {
  return new Promise((resolve) => {
    print('blue', `\n🔍 测试 ${description}: ${url}`);
    
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          print('green', `✅ ${description} 连接成功 (${res.statusCode})`);
          try {
            const json = JSON.parse(data);
            print('green', `📊 响应数据: ${JSON.stringify(json, null, 2)}`);
          } catch (e) {
            print('yellow', `⚠️  响应不是 JSON 格式: ${data.substring(0, 100)}...`);
          }
          resolve(true);
        } else {
          print('red', `❌ ${description} 连接失败 (${res.statusCode})`);
          print('red', `📄 响应: ${data.substring(0, 200)}...`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      print('red', `❌ ${description} 连接错误: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      print('red', `❌ ${description} 连接超时`);
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  print('blue', '🚀 API 连接诊断工具');
  print('blue', '================================');
  
  // 测试常见的后端 URL
  const testUrls = [
    {
      url: 'http://localhost:3001/api/health',
      description: '本地后端健康检查'
    },
    {
      url: 'http://localhost:3001/api/overview',
      description: '本地后端总览数据'
    }
  ];
  
  // 如果提供了命令行参数，测试指定的 URL
  const customUrl = process.argv[2];
  if (customUrl) {
    testUrls.push({
      url: customUrl,
      description: '自定义后端 URL'
    });
  }
  
  let successCount = 0;
  const totalTests = testUrls.length;
  
  for (const test of testUrls) {
    const success = await testApi(test.url, test.description);
    if (success) successCount++;
  }
  
  print('blue', '\n================================');
  print('blue', `📊 测试结果: ${successCount}/${totalTests} 成功`);
  
  if (successCount === 0) {
    print('red', '❌ 所有测试都失败了！');
    print('yellow', '💡 请检查：');
    print('yellow', '   1. 后端服务是否正在运行');
    print('yellow', '   2. 端口是否正确 (3001)');
    print('yellow', '   3. 网络连接是否正常');
    print('yellow', '   4. 防火墙设置');
  } else if (successCount < totalTests) {
    print('yellow', '⚠️  部分测试失败');
    print('yellow', '💡 请检查失败的 URL 是否正确');
  } else {
    print('green', '🎉 所有测试都成功了！');
  }
  
  print('blue', '\n💡 使用方法:');
  print('blue', '   node test-api.js                    # 测试本地 API');
  print('blue', '   node test-api.js https://your-api.com/api/health  # 测试远程 API');
}

main().catch(console.error);
