# BlinkPay Backend - Wompi API

Backend API con TypeScript + NestJS para integración con Wompi Payment Gateway.

## Instalación

```bash
npm install
```

## Iniciar servidor

```bash
npm run start:dev
```

Servidor corre en: `http://localhost:3000`

## Tests

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:cov
```

### Cobertura de Tests

```
Statements   : 85%
Branches     : 80%
Functions    : 82%
Lines        : 86%
```

## Docker

```bash
# Build
docker build -t blinkpay-api .

# Run
docker run -p 3000:3000 blinkpay-api

# Docker Compose
docker-compose up
```

## Endpoints Disponibles

### Products API

```
GET /products              - Listar todos los productos
GET /products/:id          - Obtener producto por ID
```

### Transactions API (Flujo Principal)

#### 1. Crear Transacción en PENDING
```
POST /transactions
```
**Body:**
```json
{
  "productId": "1",
  "customerId": "customer-123",
  "customerEmail": "customer@example.com",
  "quantity": 1
}
```
**Response:**
```json
{
  "transactionId": "uuid-123",
  "amount": 50000,
  "currency": "COP",
  "status": "PENDING",
  "product": {
    "id": "1",
    "name": "Product 1",
    "price": 50000
  }
}
```

#### 2. Procesar Pago
```
POST /transactions/process-payment
```
**Body:**
```json
{
  "transactionId": "uuid-123",
  "cardToken": "tok_test_12345",
  "acceptanceToken": "eyJhbGc..."
}
```
**Response (Aprobado):**
```json
{
  "success": true,
  "transactionId": "uuid-123",
  "status": "APPROVED",
  "message": "Payment approved and product assigned",
  "wompiTransactionId": "wompi-txn-123"
}
```

#### 3. Consultar Transacción
```
GET /transactions/:id      - Obtener transacción por ID
GET /transactions          - Listar todas las transacciones
```

### Payments API (Utilidades)

```
GET  /payments/acceptance-token    - Obtener acceptance token
POST /payments/tokenize-card       - Tokenizar tarjeta
POST /payments/webhook             - Recibir eventos Wompi
```

## Flujo Completo de Pago

1. **POST** `/transactions` → Crear transacción PENDING y obtener ID
2. **GET** `/payments/acceptance-token` → Obtener token de aceptación
3. **POST** `/payments/tokenize-card` → Tokenizar tarjeta (opcional, se puede hacer desde frontend)
4. **POST** `/transactions/process-payment` → Procesar pago con Wompi
   - Si APPROVED: Stock se actualiza automáticamente y producto se asigna
   - Si DECLINED/ERROR: Transacción se marca como fallida
5. **GET** `/transactions/:id` → Verificar estado final

## Variables de Entorno

Ver archivo `.env`

## Verificar que funciona

Ver guía completa: **VERIFICAR.md**

O ejecuta el script de prueba:
```bash
./test-endpoints.sh
```
