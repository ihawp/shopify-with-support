import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { PUBLIC_TOKEN, URL } from '../key';

export const client = createStorefrontApiClient({
  storeDomain: URL,
  apiVersion: '2025-07',
  publicAccessToken: PUBLIC_TOKEN,
});