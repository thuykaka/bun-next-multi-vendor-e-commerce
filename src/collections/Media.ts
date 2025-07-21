import type { CollectionConfig } from 'payload';
import { isSuperAdmin } from '@/lib/payloadcms';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    delete: ({ req }) => isSuperAdmin(req.user)
  },
  admin: {
    hidden: ({ user }) => !isSuperAdmin(user)
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true
    }
  ],
  upload: true
};
