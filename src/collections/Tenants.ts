import type { CollectionConfig } from 'payload';
import { isSuperAdmin } from '@/lib/payloadcms';

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'slug'
  },
  access: {
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user)
  },
  fields: [
    {
      name: 'name',
      required: true,
      type: 'text',
      label: 'Store Name',
      admin: {
        description: `The name of the store (e.g. "John Doe's Store")'`
      }
    },
    {
      name: 'slug',
      required: true,
      type: 'text',
      label: 'Store Slug',
      admin: {
        description: `The subdomain of the store (e.g. "john-doe.funroad.com")`
      },
      access: {
        update: ({ req }) => isSuperAdmin(req.user)
      }
    },
    {
      name: 'logo',
      type: 'upload',
      label: 'Store Logo',
      admin: {
        description: `The logo of the store`
      },
      relationTo: 'media',
      hasMany: false
    },
    {
      name: 'stripeAccountId',
      type: 'text',
      label: 'Stripe Account ID',
      required: true,
      access: {
        update: ({ req }) => isSuperAdmin(req.user)
      },
      admin: {
        description: `The Stripe account ID of the store`
      }
    },
    {
      name: 'stripeDetailsSubmitted',
      type: 'checkbox',
      label: 'Stripe Details Submitted',
      access: {
        update: ({ req }) => isSuperAdmin(req.user)
      },
      admin: {
        description: `You cannot create products until the Stripe details are submitted`
      }
    }
  ]
};
