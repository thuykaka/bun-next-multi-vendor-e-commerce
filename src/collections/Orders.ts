import type { CollectionConfig } from 'payload';

export const Orders: CollectionConfig = {
  slug: 'orders',

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'user',
      relationTo: 'users',
      type: 'relationship',
      required: true,
      hasMany: false
    },
    {
      name: 'product',
      relationTo: 'products',
      type: 'relationship',
      required: true,
      hasMany: false
    },
    {
      name: 'stripeCheckoutSessionId',
      type: 'text',
      required: true
    },
    {
      name: 'quantity',
      type: 'number',
      required: true
    }
  ]
};
