# Event Builder API

## Project Overview

The **Event Builder API** is a backend service designed to streamline the creation and management of League of Legends tournaments. This project focuses on generating tournament codes and storing game statistics. It is part of the Apex Apps ecosystem.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express**: Web framework for building RESTful APIs.
- **Azure Cosmos DB**: NoSQL database for scalable data storage.
- **Azure B2C**: Used for route authentication to protect API endpoints.

## Key Features

- Tournament code generation for League of Legends.
- Storing game statistics from matches.
- Route authentication using Azure B2C.

---

## Development Tools

### 1. **ESLint**

- **Purpose**: Ensures code quality and consistency.
- **Configuration**: Uses a `.eslintrc.config.js` file with the recommended rules and custom rules for Node.js.
- **Run Linting**:
  ```bash
  npm run lint
  npm run lint:fix
  ```

### 2. **Prettier**

- **Purpose**: Enforces consistent code formatting.
- **Configuration**: The `.prettierrc` file includes:
  ```json
  {
    "semi": true,
    "singleQuote": true,
    "trailingComma": "all",
    "printWidth": 80,
    "tabWidth": 2
  }
  ```
- **Run Formatting**:
  ```bash
  npm run format
  ```

### 3. **Winston Logger**

- **Purpose**: Provides structured logging with different log levels (`info`, `warn`, `error`, etc.).
- **Benefits**:
  - Supports different log outputs (console, files, external services).
  - Makes it easier to debug and monitor the application.
- **Usage Example**:
  ```javascript
  import logger from './utils/logger.js';
  logger.info('Server started successfully');
  ```

### 4. **Swagger**

- **Purpose**: Automatically generates interactive API documentation.
- **Usage**:
  - Accessible at: `http://localhost:3000/api-docs`
  - Provides interactive testing for all endpoints.
- **Configuration**:
  Swagger is set up in the `app.js` file using the `swagger-jsdoc` and `swagger-ui-express` packages.

---

## Project Setup

### Prerequisites

- **Node.js** (v18.x or later)
- **npm** (v8.x or later)
- **Azure Account** (for Cosmos DB and B2C)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/event-builder.git
   cd event-builder
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   PORT=3000
   AZURE_COSMOS_DB_ENDPOINT=https://your-cosmos-db.documents.azure.com:443/
   AZURE_COSMOS_DB_KEY=your-secret-key
   AZURE_B2C_CLIENT_ID=your-b2c-client-id
   AZURE_B2C_TENANT_NAME=your-b2c-tenant
   ```

### Running the Project

Start the server in development mode:

```bash
npx nodemon
```

Access the API documentation:

```
http://localhost:3000/api-docs
```

---
