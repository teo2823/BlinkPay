#!/bin/bash

# Script para probar los endpoints de Wompi

BASE_URL="http://localhost:3000/payments"

echo "🧪 Probando endpoints de Wompi..."
echo ""

# 1. Acceptance Token
echo "1️⃣  GET /payments/acceptance-token"
curl -s $BASE_URL/acceptance-token | json_pp 2>/dev/null || curl -s $BASE_URL/acceptance-token
echo ""
echo ""

# 2. Tokenizar tarjeta
echo "2️⃣  POST /payments/tokenize-card"
curl -s -X POST $BASE_URL/tokenize-card \
  -H "Content-Type: application/json" \
  -d '{
    "number": "4242424242424242",
    "cvc": "123",
    "exp_month": "12",
    "exp_year": "25",
    "card_holder": "Test User"
  }' | json_pp 2>/dev/null || curl -s -X POST $BASE_URL/tokenize-card \
  -H "Content-Type: application/json" \
  -d '{
    "number": "4242424242424242",
    "cvc": "123",
    "exp_month": "12",
    "exp_year": "25",
    "card_holder": "Test User"
  }'
echo ""
echo ""

echo "✅ Pruebas completadas"

