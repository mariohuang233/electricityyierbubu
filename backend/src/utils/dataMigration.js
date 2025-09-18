const mongoose = require('mongoose');
const ElectricityReading = require('../models/ElectricityReading');
const logger = require('./logger');

class DataMigration {
  constructor() {
    this.sourceCollection = 'your_existing_collection'; // 请替换为你的现有集合名
  }

  // 连接数据库
  async connect() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      logger.info('数据库连接成功');
    } catch (error) {
      logger.error('数据库连接失败:', error);
      throw error;
    }
  }

  // 获取现有数据的原始结构
  async analyzeExistingData() {
    try {
      const db = mongoose.connection.db;
      const collection = db.collection(this.sourceCollection);
      
      // 获取样本数据来分析结构
      const samples = await collection.find({}).limit(5).toArray();
      
      logger.info('现有数据样本:', JSON.stringify(samples, null, 2));
      
      // 获取总数
      const count = await collection.countDocuments();
      logger.info(`现有数据总数: ${count}`);
      
      return { samples, count };
    } catch (error) {
      logger.error('分析现有数据失败:', error);
      throw error;
    }
  }

  // 数据清洗和转换
  transformData(rawData) {
    // 根据你的现有数据结构调整这个函数
    // 这里是一个示例转换逻辑
    
    const transformed = {
      meter_id: rawData.meter_id || rawData.meterId || '18100071580',
      meter_name: rawData.meter_name || rawData.meterName || '2759弄18号402阳台',
      remaining_kwh: parseFloat(rawData.remaining_kwh || rawData.remainingKwh || rawData.kwh || 0),
      collected_at: rawData.collected_at || rawData.timestamp || rawData.createdAt || new Date(rawData.date) || new Date()
    };

    // 数据验证
    if (transformed.remaining_kwh < 0) {
      transformed.remaining_kwh = 0;
    }

    if (!transformed.collected_at || isNaN(new Date(transformed.collected_at).getTime())) {
      transformed.collected_at = new Date();
    }

    return transformed;
  }

  // 批量迁移数据
  async migrateData(batchSize = 100) {
    try {
      const db = mongoose.connection.db;
      const sourceCollection = db.collection(this.sourceCollection);
      
      let skip = 0;
      let totalMigrated = 0;
      let hasMore = true;

      while (hasMore) {
        // 分批获取数据
        const batch = await sourceCollection
          .find({})
          .skip(skip)
          .limit(batchSize)
          .toArray();

        if (batch.length === 0) {
          hasMore = false;
          break;
        }

        // 转换数据
        const transformedBatch = batch.map(item => this.transformData(item));

        // 批量插入到新集合
        try {
          await ElectricityReading.insertMany(transformedBatch, { 
            ordered: false, // 允许部分失败
            rawResult: true 
          });
          
          totalMigrated += transformedBatch.length;
          logger.info(`已迁移 ${totalMigrated} 条数据`);
          
        } catch (insertError) {
          // 处理重复数据等错误
          if (insertError.code === 11000) {
            logger.warn('发现重复数据，跳过...');
          } else {
            logger.error('批量插入失败:', insertError);
          }
        }

        skip += batchSize;
        
        // 添加延迟避免过载
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      logger.info(`数据迁移完成，总共迁移 ${totalMigrated} 条数据`);
      return totalMigrated;
      
    } catch (error) {
      logger.error('数据迁移失败:', error);
      throw error;
    }
  }

  // 验证迁移结果
  async validateMigration() {
    try {
      const count = await ElectricityReading.countDocuments();
      const latest = await ElectricityReading.findOne().sort({ collected_at: -1 });
      const earliest = await ElectricityReading.findOne().sort({ collected_at: 1 });
      
      logger.info('迁移验证结果:');
      logger.info(`- 总记录数: ${count}`);
      logger.info(`- 最新记录: ${latest?.collected_at} - ${latest?.remaining_kwh}kWh`);
      logger.info(`- 最早记录: ${earliest?.collected_at} - ${earliest?.remaining_kwh}kWh`);
      
      return { count, latest, earliest };
    } catch (error) {
      logger.error('验证迁移结果失败:', error);
      throw error;
    }
  }

  // 清理重复数据
  async removeDuplicates() {
    try {
      const pipeline = [
        {
          $group: {
            _id: {
              meter_id: '$meter_id',
              collected_at: '$collected_at'
            },
            ids: { $push: '$_id' },
            count: { $sum: 1 }
          }
        },
        {
          $match: { count: { $gt: 1 } }
        }
      ];

      const duplicates = await ElectricityReading.aggregate(pipeline);
      let removedCount = 0;

      for (const duplicate of duplicates) {
        // 保留第一个，删除其余的
        const idsToRemove = duplicate.ids.slice(1);
        await ElectricityReading.deleteMany({ _id: { $in: idsToRemove } });
        removedCount += idsToRemove.length;
      }

      logger.info(`清理了 ${removedCount} 条重复数据`);
      return removedCount;
    } catch (error) {
      logger.error('清理重复数据失败:', error);
      throw error;
    }
  }

  // 执行完整的迁移流程
  async runMigration() {
    try {
      logger.info('开始数据迁移流程...');
      
      await this.connect();
      
      // 1. 分析现有数据
      const analysis = await this.analyzeExistingData();
      
      // 2. 执行迁移
      const migratedCount = await this.migrateData();
      
      // 3. 清理重复数据
      const removedDuplicates = await this.removeDuplicates();
      
      // 4. 验证结果
      const validation = await this.validateMigration();
      
      logger.info('数据迁移流程完成!');
      
      return {
        originalCount: analysis.count,
        migratedCount,
        removedDuplicates,
        finalCount: validation.count
      };
      
    } catch (error) {
      logger.error('数据迁移流程失败:', error);
      throw error;
    } finally {
      await mongoose.connection.close();
    }
  }
}

module.exports = DataMigration;

// 如果直接运行此脚本
if (require.main === module) {
  require('dotenv').config();
  
  const migration = new DataMigration();
  
  migration.runMigration()
    .then(result => {
      console.log('迁移结果:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('迁移失败:', error);
      process.exit(1);
    });
}