import type { CollectionConfig } from 'payload';

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'slug'
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
      admin: {
        readOnly: true,
        description: `The Stripe account ID of the store`
      },
      required: true
    },
    {
      name: 'stripeDetailsSubmitted',
      type: 'checkbox',
      label: 'Stripe Details Submitted',
      admin: {
        readOnly: true,
        description: `You cannot create products until the Stripe details are submitted`
      }
    }
  ]
};
