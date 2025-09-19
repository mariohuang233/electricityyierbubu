// 测试时间显示
const testTime = '2025-09-19T13:14:14.973Z';

console.log('=== 时间显示测试 ===');
console.log('存储时间 (UTC):', testTime);
console.log('');

const date = new Date(testTime);
console.log('转换为Date对象:', date.toISOString());
console.log('');

// 测试不同的时区显示
console.log('=== 不同时区显示 ===');
console.log('本地时间:', date.toLocaleString('zh-CN'));
console.log('北京时间 (Asia/Shanghai):', date.toLocaleString('zh-CN', {
  year: 'numeric',
  month: '2-digit', 
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'Asia/Shanghai'
}));
console.log('UTC时间:', date.toLocaleString('zh-CN', {
  timeZone: 'UTC'
}));
console.log('');

// 当前时间对比
const now = new Date();
console.log('=== 当前时间对比 ===');
console.log('当前本地时间:', now.toLocaleString('zh-CN'));
console.log('当前北京时间:', now.toLocaleString('zh-CN', {
  timeZone: 'Asia/Shanghai'
}));
console.log('当前UTC时间:', now.toISOString());
console.log('');

// 计算时差
const utcHours = date.getUTCHours();
const beijingHours = new Date(date.getTime() + 8 * 60 * 60 * 1000).getUTCHours();
console.log('=== 时差计算 ===');
console.log('UTC小时:', utcHours);
console.log('北京时间小时:', beijingHours);
console.log('时差:', beijingHours - utcHours, '小时');
