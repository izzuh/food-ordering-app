export type PaymentProvider = 'paystack';
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';

export interface InitializePaymentResult {
  reference: string;
  authorization_url: string;
  access_code: string;
}
