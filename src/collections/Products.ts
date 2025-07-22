import { Tenant } from '@/payload-types';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import type { CollectionConfig } from 'payload';
import { isSuperAdmin } from '@/lib/payloadcms';

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: ({ req }) => {
      if (isSuperAdmin(req.user)) return true;
      const tenant = req.user?.tenants?.[0]?.tenant as Tenant | null;
      return Boolean(tenant?.stripeDetailsSubmitted);
    }
    // Other access control is handled by payload.config.ts > multiTenantPlugin
  },
  admin: {
    useAsTitle: 'name',
    description: 'You must verify your Stripe account before creating products.'
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'description',
      type: 'richText'
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Price in USD'
      }
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true
    },
    {
      name: 'refundPolicy',
      type: 'select',
      options: [
        {
          value: '1-day',
          label: '1 day'
        },
        {
          value: '3-days',
          label: '3 days'
        },
        {
          value: '7-days',
          label: '7 days'
        },
        {
          value: '14-days',
          label: '14 days'
        },
        {
          value: '30-days',
          label: '30 days'
        },
        {
          value: 'no-refund',
          label: 'No refund'
        }
      ],
      defaultValue: '30-days'
    },
    {
      name: 'shippingPolicy',
      type: 'text'
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      admin: {
        description:
          'Protected content only visible to customers after purchase. Add product documentation, downloadable files, getting started guides, and bonus materials. Supports markdown.'
      }
    },
    {
      name: 'isPrivate',
      label: 'Private',
      defaultValue: false,
      type: 'checkbox',
      admin: {
        description:
          'If checked, the product will not be shown on the public storefront.'
      }
    },
    {
      name: 'isArchive',
      label: 'Archive',
      defaultValue: false,
      type: 'checkbox',
      admin: {
        description: 'If checked, the product will not be visible to customers.'
      }
    }
  ]
};
