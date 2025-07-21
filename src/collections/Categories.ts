import type { CollectionConfig } from 'payload';
import { isSuperAdmin } from '@/lib/payloadcms';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    preview: ({ slug }) => `http://localhost:3000/${slug}`,
    hidden: ({ user }) => !isSuperAdmin(user)
  },
  access: {
    read: () => true,
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
