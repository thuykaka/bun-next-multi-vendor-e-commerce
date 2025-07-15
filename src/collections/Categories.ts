import type { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    read: () => true
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    }
  ]
};
