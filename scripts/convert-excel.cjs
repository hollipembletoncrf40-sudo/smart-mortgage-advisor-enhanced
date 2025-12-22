const XLSX = require('xlsx');
const fs = require('fs');

const MAX_ROWS = 300000; // Increased to 300000 rows (full dataset)

console.log('=== Excel 转换工具 ===');
console.log(`处理前 ${MAX_ROWS} 条数据...`);
console.log('');

console.log('[1/4] 读取 Excel 文件 (仅前 ' + (MAX_ROWS + 2) + ' 行)...');
const startTime = Date.now();
const wb = XLSX.readFile('./全国小区数据excel表格.xlsx', { sheetRows: MAX_ROWS + 2 });
console.log(`    ✅ 完成 (${((Date.now() - startTime) / 1000).toFixed(1)}秒)`);

const ws = wb.Sheets[wb.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 });
console.log(`    总行数: ${rawData.length}`);

// Clean function
const cleanValue = (val) => {
  if (val === undefined || val === null || val === '' || val === '暂无数据') return null;
  return String(val).trim();
};

const parseManagementFee = (val) => {
  if (!val || val === '暂无数据') return null;
  const match = String(val).match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : null;
};

const parseBuildYear = (val) => {
  if (!val || val === '暂无数据') return null;
  const match = String(val).match(/(\d{4})/);
  return match ? parseInt(match[1]) : null;
};

const parseGreeningRate = (val) => {
  if (!val || val === '暂无数据') return null;
  const match = String(val).match(/([\d.]+)%?/);
  return match ? parseFloat(match[1]) : null;
};

const parsePlotRatio = (val) => {
  if (!val || val === '暂无数据') return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
};

console.log('');
console.log('[2/4] 清洗数据...');
const cleanedData = [];
const progressBar = (current, total) => {
  const percent = Math.round(current / total * 100);
  const filled = Math.round(percent / 5);
  const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);
  process.stdout.write(`\r    进度: [${bar}] ${percent}% (${current}/${total})`);
};

for (let i = 2; i < rawData.length; i++) {
  const row = rawData[i];
  if (!row || !row[0]) continue;
  
  const item = {
    name: cleanValue(row[0]),
    province: cleanValue(row[1]),
    city: cleanValue(row[2]),
    area: cleanValue(row[3]),
    address: cleanValue(row[4]),
    latitude: parseFloat(row[5]) || null,
    longitude: parseFloat(row[6]) || null,
    type: cleanValue(row[8]),
    management_fee: parseManagementFee(row[9]),
    build_year: parseBuildYear(row[12]),
    plot_ratio: parsePlotRatio(row[14]),
    greening_rate: parseGreeningRate(row[15]),
    developer: cleanValue(row[16]),
    property_company: cleanValue(row[17]),
    school: cleanValue(row[18])
  };
  
  if (item.name && item.city && item.latitude && item.longitude) {
    cleanedData.push(item);
  }
  
  if ((i - 2) % 500 === 0) {
    progressBar(i - 2, rawData.length - 2);
  }
}
progressBar(rawData.length - 2, rawData.length - 2);
console.log('');
console.log(`    ✅ 有效数据: ${cleanedData.length} 条`);

console.log('');
console.log('[3/4] 生成统计数据...');
const stats = {
  total: cleanedData.length,
  byProvince: {},
  byCity: {},
  byType: {},
  byBuildYear: {},
  avgManagementFee: 0
};

let feeSum = 0, feeCount = 0;
cleanedData.forEach(item => {
  stats.byProvince[item.province] = (stats.byProvince[item.province] || 0) + 1;
  stats.byCity[item.city] = (stats.byCity[item.city] || 0) + 1;
  if (item.type) stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
  if (item.build_year) {
    const decade = Math.floor(item.build_year / 10) * 10 + 's';
    stats.byBuildYear[decade] = (stats.byBuildYear[decade] || 0) + 1;
  }
  if (item.management_fee) { feeSum += item.management_fee; feeCount++; }
});

stats.avgManagementFee = feeCount > 0 ? (feeSum / feeCount).toFixed(2) : 0;
stats.topCities = Object.entries(stats.byCity).sort((a, b) => b[1] - a[1]).slice(0, 30).map(([city, count]) => ({ city, count }));
stats.topProvinces = Object.entries(stats.byProvince).sort((a, b) => b[1] - a[1]).map(([province, count]) => ({ province, count }));
console.log('    ✅ 完成');

console.log('');
console.log('[4/4] 保存文件...');
fs.writeFileSync('./data/community-data.json', JSON.stringify(cleanedData));
console.log('    ✅ data/community-data.json');
fs.writeFileSync('./data/community-stats.json', JSON.stringify(stats, null, 2));
console.log('    ✅ data/community-stats.json');

console.log('');
console.log('=== 转换完成! ===');
console.log(`总耗时: ${((Date.now() - startTime) / 1000).toFixed(1)} 秒`);
console.log('');
console.log('统计概览:');
console.log(`  • 有效小区数量: ${stats.total}`);
console.log(`  • 覆盖省份: ${Object.keys(stats.byProvince).length}`);
console.log(`  • 覆盖城市: ${Object.keys(stats.byCity).length}`);
console.log(`  • 平均物业费: ${stats.avgManagementFee} 元/平米/月`);
console.log('');
console.log('Top 10 城市:');
stats.topCities.slice(0, 10).forEach((c, i) => console.log(`  ${i+1}. ${c.city}: ${c.count} 个小区`));
