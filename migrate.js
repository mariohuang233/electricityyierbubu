#!/usr/bin/env node

/**
 * 数据迁移执行脚本
 * 使用方法: node migrate.js [选项]
 * 
 * 选项:
 *   --analyze    仅分析现有数据结构
 *   --dry-run    模拟运行，不实际迁移数据
 *   --collection 指定源集合名称
 */

require('dotenv').config();
const DataMigration = require('./backend/src/utils/dataMigration');

async function main() {
  const args = process.argv.slice(2);
  const options = {
    analyzeOnly: args.includes('--analyze'),
    dryRun: args.includes('--dry-run'),
    collection: null
  };

  // 获取集合名称参数
  const collectionIndex = args.indexOf('--collection');
  if (collectionIndex !== -1 && args[collectionIndex + 1]) {
    options.collection = args[collectionIndex + 1];
  }

  console.log('🚀 电力监控系统数据迁移工具');
  console.log('================================');
  
  if (options.dryRun) {
    console.log('⚠️  模拟运行模式 - 不会实际修改数据');
  }

  try {
    const migration = new DataMigration();
    
    // 如果指定了集合名称，更新配置
    if (options.collection) {
      migration.sourceCollection = options.collection;
      console.log(`📂 使用源集合: ${options.collection}`);
    }

    await migration.connect();

    if (options.analyzeOnly) {
      console.log('🔍 分析现有数据结构...');
      const analysis = await migration.analyzeExistingData();
      
      console.log('\n📊 分析结果:');
      console.log(`- 数据总数: ${analysis.count}`);
      console.log('- 数据样本结构:');
      console.log(JSON.stringify(analysis.samples[0] || {}, null, 2));
      
      console.log('\n💡 请根据分析结果调整 dataMigration.js 中的 transformData 函数');
      console.log('💡 然后运行: node migrate.js --collection your_collection_name');
      
    } else if (options.dryRun) {
      console.log('🧪 模拟迁移流程...');
      const analysis = await migration.analyzeExistingData();
      
      console.log(`\n📋 将要迁移 ${analysis.count} 条数据`);
      console.log('✅ 模拟运行完成，实际数据未被修改');
      
    } else {
      console.log('🔄 开始完整迁移流程...');
      const result = await migration.runMigration();
      
      console.log('\n🎉 迁移完成!');
      console.log(`- 原始数据: ${result.originalCount} 条`);
      console.log(`- 迁移数据: ${result.migratedCount} 条`);
      console.log(`- 清理重复: ${result.removedDuplicates} 条`);
      console.log(`- 最终数据: ${result.finalCount} 条`);
    }

  } catch (error) {
    console.error('❌ 迁移失败:', error.message);
    
    if (error.message.includes('your_existing_collection')) {
      console.log('\n💡 提示:');
      console.log('1. 请先运行 --analyze 分析现有数据');
      console.log('2. 使用 --collection 参数指定正确的集合名称');
      console.log('3. 根据数据结构调整转换逻辑');
    }
    
    process.exit(1);
  }
}

// 显示帮助信息
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
电力监控系统数据迁移工具

使用方法:
  node migrate.js [选项]

选项:
  --analyze              仅分析现有数据结构，不执行迁移
  --dry-run             模拟运行，不实际修改数据
  --collection <name>   指定源集合名称
  --help, -h            显示此帮助信息

示例:
  node migrate.js --analyze                          # 分析数据结构
  node migrate.js --collection electricity_data     # 迁移指定集合
  node migrate.js --dry-run --collection my_data    # 模拟迁移

环境变量:
  MONGO_URI             MongoDB连接字符串 (必需)
`);
  process.exit(0);
}

main();