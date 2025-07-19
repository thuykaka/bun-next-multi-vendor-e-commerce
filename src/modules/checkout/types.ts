import type Stripe from 'stripe';

export type ProductMetadata = {
  stripeAccountId: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type CheckoutSessionMetadata = {
  userId: string;
};

export type ExpandedLineItem = Stripe.LineItem & {
  price: Stripe.Price & {
    product: Stripe.Product & {
      metadata: ProductMetadata;
    };
  };
};
