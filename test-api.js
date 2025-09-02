#!/usr/bin/env node

/**
 * LexLink API Test Script
 * Tests all API endpoints to ensure proper deployment
 */

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`)
};

async function testEndpoint(name, url, options = {}) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (response.ok) {
      const data = await response.json();
      log.success(`${name}: ${response.status}`);
      return { success: true, data };
    } else {
      log.error(`${name}: ${response.status} - ${response.statusText}`);
      return { success: false, status: response.status };
    }
  } catch (error) {
    log.error(`${name}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testPostEndpoint(name, url, body) {
  return testEndpoint(name, url, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

async function runTests() {
  log.info(`Testing LexLink API at: ${BASE_URL}`);
  console.log();

  const tests = [
    // Health check
    () => testEndpoint('Health Check', `${BASE_URL}/health`),
    
    // Languages
    () => testEndpoint('Languages', `${BASE_URL}/languages`),
    
    // Text analysis
    () => testPostEndpoint('Analyze Text', `${BASE_URL}/analyze`, {
      text: 'This is a sample lease agreement for testing purposes.',
      analysisType: 'legal'
    }),
    
    // Q&A
    () => testPostEndpoint('Ask Question', `${BASE_URL}/ask`, {
      question: 'What are the key terms?',
      documentText: 'This is a sample document with key terms and conditions.'
    }),
    
    // Explain clause
    () => testPostEndpoint('Explain Clause', `${BASE_URL}/explain`, {
      text: 'The tenant shall pay rent on the first day of each month.'
    }),
    
    // Translation
    () => testPostEndpoint('Translate Text', `${BASE_URL}/translate`, {
      text: 'This is a legal document.',
      targetLanguage: 'hi'
    }),
    
    // Audio
    () => testPostEndpoint('Generate Audio', `${BASE_URL}/audio`, {
      text: 'This is a test of the text-to-speech functionality.',
      languageCode: 'en-US'
    }),
    
    // Compliance
    () => testPostEndpoint('Compliance Check', `${BASE_URL}/compliance`, {
      documentText: 'Sample legal document for compliance testing.',
      documentType: 'contract',
      jurisdiction: 'US'
    }),
    
    // Benchmark
    () => testPostEndpoint('Benchmark Document', `${BASE_URL}/benchmark`, {
      documentText: 'Sample document for benchmarking analysis.',
      documentType: 'contract',
      industry: 'general'
    })
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test();
    if (result.success) {
      passed++;
    } else {
      failed++;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log();
  log.info(`Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    log.success('All tests passed! 🎉');
  } else {
    log.warning(`${failed} tests failed. Check the errors above.`);
  }

  return failed === 0;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runTests, testEndpoint, testPostEndpoint };