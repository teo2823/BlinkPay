# Verificar Backend

## 1. Instalar dependencias

```bash
cd backend
npm install
```

## 2. Iniciar servidor

```bash
npm run start:dev
```

Deberías ver:
```
🚀 Servidor corriendo en http://localhost:3000
💳 Endpoints Wompi disponibles en http://localhost:3000/payments
```

## 3. Probar endpoints

### Opción A: Usar el navegador

Abre en el navegador:
```
http://localhost:3000/payments/acceptance-token
```

Deberías ver un JSON con el acceptance token.

### Opción B: Usar curl

```bash
# 1. Obtener acceptance token
curl http://localhost:3000/payments/acceptance-token

# 2. Tokenizar tarjeta de prueba
curl -X POST http://localhost:3000/payments/tokenize-card \
  -H "Content-Type: application/json" \
  -d '{
    "number": "4242424242424242",
    "cvc": "123",
    "exp_month": "12",
    "exp_year": "25",
    "card_holder": "Test User"
  }'

# 3. Crear transacción (necesitas el acceptance_token y card_token de los pasos anteriores)
curl -X POST http://localhost:3000/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount_in_cents": 5000000,
    "currency": "COP",
    "customer_email": "test@test.com",
    "reference": "TEST-001",
    "payment_method": {
      "type": "CARD",
      "token": "tok_test_XXXXX"
    },
    "acceptance_token": "eyJhbGc..."
  }'
```

### Opción C: Usar Postman o Thunder Client (VSCode)

Importa estas requests:

**GET** `http://localhost:3000/payments/acceptance-token`

**POST** `http://localhost:3000/payments/tokenize-card`
```json
{
  "number": "4242424242424242",
  "cvc": "123",
  "exp_month": "12",
  "exp_year": "25",
  "card_holder": "Test User"
}
```

## 4. Verificar que funciona

✅ El servidor inicia sin errores
✅ GET `/payments/acceptance-token` retorna un token
✅ POST `/payments/tokenize-card` retorna un token de tarjeta
✅ No hay errores en la consola

## Errores comunes

❌ **"Cannot find module '@nestjs/common'"**
   → Ejecuta `npm install`

❌ **"Missing required Wompi configuration"**
   → Verifica que el archivo `.env` existe en `/backend`

❌ **"Port 3000 already in use"**
   → Cambia el puerto en `.env`: `PORT=3001`

