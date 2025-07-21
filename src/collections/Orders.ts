import type { CollectionConfig } from 'payload';
import { isSuperAdmin } from '@/lib/payloadcms';

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    read: ({ req }) => isSuperAdmin(req.user),
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user)
  },
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
      required: true,
      admin: {
        description: 'Stripe checkout session associated with the order'
      }
    },
    {
      name: 'quantity',
      type: 'number',
      required: true
    }
  ]
};
