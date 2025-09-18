const axios = require('axios');
const cheerio = require('cheerio');
const ElectricityReading = require('../models/ElectricityReading');
const logger = require('../utils/logger');

class MeterCrawler {
  constructor() {
    this.meterUrl = process.env.METER_URL || 'http://www.wap.cnyiot.com/nat/pay.aspx?mid=18100071580';
    this.maxRetries = 3;
  }

  async crawlMeterData() {
    let retries = 0;
    
    while (retries < this.maxRetries) {
      try {
        logger.info(`开始爬取电表数据，尝试次数: ${retries + 1}`);
        
        const response = await axios.get(this.meterUrl, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        const data = this.parseHtml(response.data);
        
        if (data) {
          await this.saveReading(data);
          logger.info('电表数据爬取成功', data);
          return data;
        } else {
          throw new Error('解析HTML失败');
        }
        
      } catch (error) {
        retries++;
        logger.error(`爬取失败 (${retries}/${this.maxRetries}):`, error.message);
        
        if (retries >= this.maxRetries) {
          logger.error('达到最大重试次数，爬取失败');
          throw error;
        }
        
        // 等待2秒后重试
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  parseHtml(html) {
    try {
      const $ = cheerio.load(html);
      
      // 根据实际HTML结构调整选择器
      // 这里需要根据实际网页结构来解析
      let meterName = '';
      let meterId = '';
      let remainingKwh = 0;

      // 尝试多种可能的选择器
      const possibleSelectors = [
        'table tr td',
        '.meter-info',
        '#meter-data',
        'span',
        'div'
      ];

      // 查找包含电表信息的元素
      $('*').each((i, elem) => {
        const text = $(elem).text().trim();
        
        // 匹配表名称
        if (text.includes('弄') && text.includes('号')) {
          meterName = text;
        }
        
        // 匹配表号
        if (/^\d{11}$/.test(text)) {
          meterId = text;
        }
        
        // 匹配剩余电量 (数字.数字 格式)
        const kwh = text.match(/(\d+\.?\d*)\s*(?:kWh|度|千瓦时)/i);
        if (kwh) {
          remainingKwh = parseFloat(kwh[1]);
        }
      });

      // 如果没有找到表名称，使用默认值
      if (!meterName) {
        meterName = '2759弄18号402阳台';
      }
      
      // 如果没有找到表号，从URL中提取
      if (!meterId) {
        const urlMatch = this.meterUrl.match(/mid=(\d+)/);
        meterId = urlMatch ? urlMatch[1] : '18100071580';
      }

      if (remainingKwh > 0) {
        // 使用北京时间 (UTC+8)
        const beijingTime = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
        return {
          meter_id: meterId,
          meter_name: meterName,
          remaining_kwh: remainingKwh,
          collected_at: beijingTime
        };
      }
      
      return null;
    } catch (error) {
      logger.error('HTML解析错误:', error);
      return null;
    }
  }

  async saveReading(data) {
    try {
      const reading = new ElectricityReading(data);
      await reading.save();
      logger.info('数据保存成功');
    } catch (error) {
      logger.error('数据保存失败:', error);
      throw error;
    }
  }
}

module.exports = MeterCrawler;