const XLSX = require('xlsx');
const fs = require('fs');

console.log('Reading Excel file...');
const wb = XLSX.readFile('./全国小区数据excel表格.xlsx', { sheetRows: 100 }); // Only read first 100 rows
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws);

console.log('Sheet names:', wb.SheetNames);
console.log('Columns:', Object.keys(data[0] || {}));
console.log('Sample data (first 5 rows):');
console.log(JSON.stringify(data.slice(0, 5), null, 2));

// Analyze data quality
const columns = Object.keys(data[0] || {});
const stats = {};
columns.forEach(col => {
  const values = data.map(row => row[col]);
  const nonEmpty = values.filter(v => v !== undefined && v !== null && v !== '');
  stats[col] = {
    total: values.length,
    filled: nonEmpty.length,
    fillRate: (nonEmpty.length / values.length * 100).toFixed(1) + '%'
  };
});
console.log('\nColumn fill rates:');
console.log(JSON.stringify(stats, null, 2));
