// Wompi Payment API - Sandbox (Frontend)
// IMPORTANTE: Solo usar clave pública en frontend

export const wompiConfig = {
  apiUrl: 'https://api-sandbox.co.uat.wompi.dev/v1',
  publicKey: 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7',
  backendUrl: 'http://localhost:3000',
};

export const WompiEndpoints = {
  merchants: '/merchants',
  paymentSources: '/payment_sources',
  transactions: '/transactions',
  tokenCards: '/tokens/cards',
  paymentLinks: '/payment_links',
};
