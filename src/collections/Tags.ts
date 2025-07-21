import type { CollectionConfig } from 'payload';
import { isSuperAdmin } from '@/lib/payloadcms';

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    hidden: ({ user }) => !isSuperAdmin(user)
  },
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user)
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      unique: true,
      required: true
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true
    }
  ]
};
