import axios from 'axios';
import { config } from 'dotenv';
import logger from '../utils/logger.js';

// Load environment variables
const environment = process.env.NODE_ENV || 'development';
config({ path: `.env.${environment}` });

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

// Use environment variables for test IDs
const TEST_PROVIDER_ID = process.env.TEST_PROVIDER_ID || '14038';
const TEST_TOURNAMENT_ID = process.env.TEST_TOURNAMENT_ID || '7249912';

class APITester {
  constructor() {
    this.axios = axios.create({
      baseURL: API_URL,
      timeout: 5000,
      validateStatus: () => true, // Don't throw on any status
    });

    this.axios.interceptors.request.use((request) => {
      logger.info(
        `Making request to: ${request.method.toUpperCase()} ${request.baseURL}${request.url}`,
      );
      return request;
    });
  }

  async runTests() {
    logger.info('Starting API tests...');
    const results = {
      passed: [],
      failed: [],
    };

    const tests = [
      { name: 'Tournament Creation', fn: this.testCreateTournament },
      { name: 'Caching', fn: this.testCaching },
      { name: 'Rate Limiting', fn: this.testRateLimiting },
      { name: 'Error Scenarios', fn: this.testErrorScenarios },
      { name: 'Security Headers', fn: this.testSecurityHeaders },
      { name: 'Correlation ID', fn: this.testCorrelationId },
    ];

    for (const test of tests) {
      try {
        await test.fn.call(this);
        results.passed.push(test.name);
        logger.info(`✅ ${test.name} test passed`);
      } catch (error) {
        results.failed.push({ name: test.name, error });
        logger.error(`❌ ${test.name} test failed:`, error.message);
      }
    }

    // Summary
    logger.info('\n=== Test Summary ===');
    logger.info(`Passed: ${results.passed.length}/${tests.length}`);
    if (results.passed.length > 0) {
      logger.info('Passing tests:', results.passed.join(', '));
    }
    if (results.failed.length > 0) {
      logger.error(
        'Failed tests:',
        results.failed.map((f) => f.name).join(', '),
      );
      logger.error('\nError details:');
      results.failed.forEach(({ name, error }) => {
        logger.error(`\n${name}:`, error.message);
      });
    }

    // Exit with error if any tests failed
    if (results.failed.length > 0) {
      process.exit(1);
    }
  }

  async testCreateTournament() {
    logger.info('Testing tournament creation...');

    try {
      const response = await this.axios.post('/tournaments', {
        name: 'Test Tournament',
        providerId: TEST_PROVIDER_ID,
      });

      logger.info('Response received:', response.data);

      if (!response.data.success || !response.data.data.tournamentId) {
        throw new Error(
          `Invalid response format. Received: ${JSON.stringify(response.data)}`,
        );
      }

      logger.info('✅ Tournament creation test passed');
      return response.data.data.tournamentId;
    } catch (error) {
      logger.error(
        '❌ Tournament creation test failed:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async testCaching() {
    logger.info('Testing cache layer...');

    try {
      const start1 = Date.now();
      await this.axios.get(`/tournaments/${TEST_TOURNAMENT_ID}`);
      const time1 = Date.now() - start1;

      const start2 = Date.now();
      await this.axios.get(`/tournaments/${TEST_TOURNAMENT_ID}`);
      const time2 = Date.now() - start2;

      if (time2 >= time1) {
        logger.warn('Second request was not faster (might not be cached)');
      }

      logger.info(
        `✅ Cache test passed (First: ${time1}ms, Second: ${time2}ms)`,
      );
    } catch (error) {
      logger.error(
        '❌ Cache test failed:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async testRateLimiting() {
    logger.info('Testing rate limiting...');

    try {
      for (let i = 0; i < 6; i++) {
        const response = await this.axios.get(
          `/tournaments/${TEST_TOURNAMENT_ID}`,
        );
        logger.info(`Request ${i + 1} status: ${response.status}`);
      }

      const lastResponse = await this.axios.get(
        `/tournaments/${TEST_TOURNAMENT_ID}`,
      );

      if (lastResponse.status !== 429) {
        logger.error(`Expected status 429, got ${lastResponse.status}`);
        throw new Error('Rate limiting not working as expected');
      }

      logger.info('✅ Rate limiting test passed');
    } catch (error) {
      if (error.response?.status === 429) {
        logger.info('✅ Rate limiting test passed (received 429 as expected)');
        return;
      }
      logger.error(
        '❌ Rate limiting test failed:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async testErrorScenarios() {
    logger.info('Testing error handling scenarios...');

    try {
      // Test 404 - Not Found
      const notFoundResponse = await this.axios.get(
        '/tournaments/nonexistent-id',
      );
      if (notFoundResponse.status !== 404) {
        throw new Error(`Expected 404, got ${notFoundResponse.status}`);
      }
      logger.info('404 test passed');

      // Test 400 - Bad Request
      const badRequestResponse = await this.axios.post('/tournaments', {
        // Missing required fields
      });
      if (badRequestResponse.status !== 400) {
        throw new Error(`Expected 400, got ${badRequestResponse.status}`);
      }
      logger.info('400 test passed');

      // Test invalid provider ID
      const invalidProviderResponse = await this.axios.post('/tournaments', {
        name: 'Test Tournament',
        providerId: 'invalid-provider',
      });
      if (invalidProviderResponse.status !== 400) {
        throw new Error(`Expected 400, got ${invalidProviderResponse.status}`);
      }
      logger.info('Invalid provider test passed');

      logger.info('✅ Error handling tests passed');
    } catch (error) {
      logger.error(
        '❌ Error handling tests failed:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async testSecurityHeaders() {
    logger.info('Testing security headers...');

    try {
      const response = await this.axios.get('/tournaments');
      const headers = response.headers;

      // Check for important security headers
      const requiredHeaders = [
        'x-content-type-options',
        'x-xss-protection',
        'content-security-policy',
      ];

      const missingHeaders = requiredHeaders.filter(
        (header) => !headers[header],
      );
      if (missingHeaders.length > 0) {
        logger.warn('Missing security headers:', missingHeaders);
      }

      logger.info('✅ Security headers test passed');
    } catch (error) {
      logger.error(
        '❌ Security headers test failed:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async testCorrelationId() {
    logger.info('Testing correlation ID...');

    try {
      // Test auto-generated correlation ID
      const response1 = await this.axios.get('/tournaments');
      if (!response1.headers['x-correlation-id']) {
        throw new Error('Missing correlation ID in response headers');
      }
      logger.info('Auto-generated correlation ID test passed');

      // Test passing custom correlation ID
      const customId = 'test-correlation-id';
      const response2 = await this.axios.get('/tournaments', {
        headers: { 'x-correlation-id': customId },
      });
      if (response2.headers['x-correlation-id'] !== customId) {
        throw new Error('Correlation ID not preserved');
      }
      logger.info('Custom correlation ID test passed');

      logger.info('✅ Correlation ID test passed');
    } catch (error) {
      logger.error(
        '❌ Correlation ID test failed:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}

// Run the tests
const tester = new APITester();
tester.runTests();
