const http = require('http');

function testEndpoint(url, description) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✓ ${description}: Status ${res.statusCode}`);
        if (res.statusCode === 200 && data.length > 0) {
          console.log(`  Response size: ${data.length} bytes`);
        }
        resolve({ status: res.statusCode, data });
      });
    });
    
    req.on('error', (err) => {
      console.log(`✗ ${description}: ${err.message}`);
      resolve({ status: 'error', error: err.message });
    });
    
    // Timeout after 5 seconds
    req.setTimeout(5000, () => {
      console.log(`⚠ ${description}: Timeout`);
      req.destroy();
      resolve({ status: 'timeout' });
    });
  });
}

async function runTests() {
  console.log('🧪 Testing SecureSight Dashboard Deployment\n');
  
  const tests = [
    { url: 'http://localhost:3000', desc: 'Main page load' },
    { url: 'http://localhost:3000/api/health', desc: 'Health check endpoint' },
    { url: 'http://localhost:3000/api/incidents', desc: 'Incidents API (should return empty or demo data)' },
  ];
  
  for (const test of tests) {
    await testEndpoint(test.url, test.desc);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
  
  console.log('\n🏁 Test complete!');
  console.log('If the main page loaded successfully, your UI should be working.');
  console.log('Visit http://localhost:3000 in your browser to verify the interface.');
}

runTests().catch(console.error);