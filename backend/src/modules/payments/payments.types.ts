export type PaymentProvider = 'stripe';
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';

export interface InitializePaymentResult {
  id: string;
  client_secret: string;
  status: string;
}
