# Scalable Event-Driven Logging Microservice

A production-ready microservice for processing user activity logs using event-driven architecture with Kafka and MongoDB.

## Architecture Flow

```
API (Express) → Kafka Producer → Kafka Topic → Kafka Consumer → MongoDB
```

**Components:**

- **API Layer**: Ingests activity logs via REST endpoints
- **Kafka Producer**: Publishes logs to Kafka topic asynchronously
- **Kafka Consumer**: Processes messages from topic in real-time
- **MongoDB**: Stores processed logs with indexing for efficient queries

## Why Domain-Driven Design?

I chose DDD for clear separation of business logic from infrastructure concerns. Coming from a C# background (Clean Architecture, CQRS, MediatR), I applied the same principles here: the Domain layer contains pure business entities, Application orchestrates use cases, and Infrastructure handles external dependencies (Kafka, MongoDB). This ensures maintainability, testability, and scalability as the system grows.

## Quick Start

```bash
docker-compose up --build
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check

```
GET /health
```

### Create Activity Log

```bash
curl -X POST http://localhost:3000/test-log \
  -H "Content-Type: application/json" \
  -d '{
    "level": "info",
    "message": "User logged in successfully",
    "source": "web"
  }'
```

### Get Logs (Paginated)

```bash
curl "http://localhost:3000/test-log?page=1&limit=10&level=error"
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)
- `level` (optional): Filter by log level (e.g., error, info, warn)

### Get Logs by Source

```bash
curl http://localhost:3000/test-log/source/web
```

## Environment Variables

Create a `.env` file in the project root:

```env
DB_CONNECTION_STRING=mongodb://mongodb:27017/eyego-activity-logs
PORT=3000
KAFKA_BROKERS=kafka:9092
NODE_ENV=production
```

**Required Variables:**

- `DB_CONNECTION_STRING`: MongoDB connection URI
- `PORT`: API server port
- `KAFKA_BROKERS`: Kafka broker addresses (comma-separated for multiple)
- `NODE_ENV`: Environment mode (development/production)

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Message Broker**: Apache Kafka (kafkajs)
- **Kafka UI**: Kafka UI (for monitoring topics and messages)
- **Database**: MongoDB (mongoose)
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes (k8s with minikube for local testing)
