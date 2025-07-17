import type { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name'
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'description',
      type: 'textarea'
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
    }
  ]
};
