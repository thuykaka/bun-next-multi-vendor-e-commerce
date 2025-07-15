import type { CollectionConfig } from 'payload';
import slugify from 'slugify';

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
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true
    },
    {
      name: 'color',
      type: 'text'
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false
    },
    {
      name: 'subCategories',
      type: 'join',
      collection: 'categories',
      on: 'parent',
      hasMany: true
    }
  ]
};
