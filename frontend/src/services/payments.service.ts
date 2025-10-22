import { wompiConfig } from '../config/wompi.config';

const API_URL = wompiConfig.backendUrl;

// Obtener token de aceptación
export const getAcceptanceToken = async () => {
  const response = await fetch(`${API_URL}/payments/acceptance-token`);
  return response.json();
};

// Tokenizar tarjeta
export const tokenizeCard = async (cardData: {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}) => {
  const response = await fetch(`${API_URL}/payments/tokenize-card`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardData),
  });
  return response.json();
};

// Crear transacción
export const createTransaction = async (data: {
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  reference: string;
  payment_method: {
    type: string;
    token?: string;
  };
  acceptance_token: string;
}) => {
  const response = await fetch(`${API_URL}/payments/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

// Obtener transacción
export const getTransaction = async (transactionId: string) => {
  const response = await fetch(`${API_URL}/payments/transaction/${transactionId}`);
  return response.json();
};

// Flujo completo de pago
export const processPayment = async (
  cardData: {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  },
  paymentData: {
    amount_in_cents: number;
    currency: string;
    customer_email: string;
    reference: string;
  }
) => {
  try {
    // 1. Obtener acceptance token
    const { acceptance_token } = await getAcceptanceToken();

    // 2. Tokenizar tarjeta
    const cardToken = await tokenizeCard(cardData);

    // 3. Crear transacción
    const transaction = await createTransaction({
      ...paymentData,
      acceptance_token,
      payment_method: {
        type: 'CARD',
        token: cardToken.id,
      },
    });

    return transaction;
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
};

