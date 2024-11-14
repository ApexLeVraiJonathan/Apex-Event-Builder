import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

export const PORT = process.env.PORT;
export const RIOT_API_KEY = process.env.RIOT_API_KEY;
export const COSMOS_DB_URI = process.env.COSMOS_DB_URI;
export const COSMOS_DB_KEY = process.env.COSMOS_DB_KEY;
export const COSMOS_DB_DATABASE = process.env.COSMOS_DB_DATABASE;
