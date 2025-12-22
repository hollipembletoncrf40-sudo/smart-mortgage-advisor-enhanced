const fs = require('fs');

// Read the original data
console.log('📖 Reading community-data.json...');
const rawData = fs.readFileSync('./data/community-data.json', 'utf8');
const data = JSON.parse(rawData);

console.log(`📊 Total records: ${data.length}`);
console.log(`📦 Original size: ${(rawData.length / 1024 / 1024).toFixed(2)} MB`);

// Optimize: Remove null values but keep original field names
const optimizedData = data.map(item => {
  const optimized = {};
  
  // Only keep non-null, non-undefined values
  for (const [key, value] of Object.entries(item)) {
    if (value !== null && value !== undefined && value !== '') {
      optimized[key] = value;
    }
  }
  
  return optimized;
});

// Write minified JSON (no pretty printing, no whitespace)
const optimizedJson = JSON.stringify(optimizedData);
fs.writeFileSync('./data/community-data.json', optimizedJson);

console.log(`✅ Optimized size: ${(optimizedJson.length / 1024 / 1024).toFixed(2)} MB`);
console.log(`📉 Reduction: ${((1 - optimizedJson.length / rawData.length) * 100).toFixed(1)}%`);
console.log(`📝 Records kept: ${optimizedData.length}`);
console.log('💾 Saved to: data/community-data.json (overwritten)');
