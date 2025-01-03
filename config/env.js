import { config } from 'dotenv';

// Load environment variables based on NODE_ENV
const environment = process.env.NODE_ENV || 'development';
config({ path: `.env.${environment}` });

// Required environment variables
const requiredEnvVars = [
  'COSMOS_ENDPOINT',
  'COSMOS_KEY',
  'COSMOS_DATABASE',
  'RIOT_API_KEY',
  'RIOT_TOURNAMENT_API_URL',
];

// Check for required environment variables
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

// Export environment variables
export const {
  NODE_ENV = 'development',
  COSMOS_ENDPOINT,
  COSMOS_KEY,
  COSMOS_DATABASE,
  RIOT_API_KEY,
  RIOT_TOURNAMENT_API_URL,
  API_KEY_HEADER_NAME,
  API_KEY,
  PORT = 3000,
  ALLOWED_ORIGINS,
  LOG_LEVEL = 'info',
  CACHE_TTL = 300, // 5 minutes in seconds
  RATE_LIMIT_WINDOW = 900000, // 15 minutes in milliseconds
  RATE_LIMIT_MAX = 100,
} = process.env;

// Derived environment variables
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';
export const IS_TEST = NODE_ENV === 'test';

// Parse string arrays
export const ALLOWED_ORIGINS_ARRAY = ALLOWED_ORIGINS.split(',').map((origin) =>
  origin.trim(),
);

// Parse numbers
export const CACHE_TTL_NUM = parseInt(CACHE_TTL, 10);
export const RATE_LIMIT_WINDOW_NUM = parseInt(RATE_LIMIT_WINDOW, 10);
export const RATE_LIMIT_MAX_NUM = parseInt(RATE_LIMIT_MAX, 10);

// Validate parsed numbers
if (isNaN(CACHE_TTL_NUM)) throw new Error('CACHE_TTL must be a number');
if (isNaN(RATE_LIMIT_WINDOW_NUM))
  throw new Error('RATE_LIMIT_WINDOW must be a number');
if (isNaN(RATE_LIMIT_MAX_NUM))
  throw new Error('RATE_LIMIT_MAX must be a number');
