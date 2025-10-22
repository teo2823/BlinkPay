// Wompi Payment API - Sandbox Configuration

import { ConfigService } from '@nestjs/config';

export const getWompiConfig = (configService: ConfigService) => ({
  apiUrl: configService.get<string>('WOMPI_SANDBOX_URL') || 'https://api-sandbox.co.uat.wompi.dev/v1',
  publicKey: configService.get<string>('WOMPI_PUBLIC_KEY'),
  privateKey: configService.get<string>('WOMPI_PRIVATE_KEY'),
  eventsKey: configService.get<string>('WOMPI_EVENTS_KEY'),
  integrityKey: configService.get<string>('WOMPI_INTEGRITY_KEY'),
});