import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields';
import type { CollectionConfig } from 'payload';
import { isSuperAdmin } from '@/lib/payloadcms';

const defaultTenantsArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsCollectionSlug: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  arrayFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user)
  },
  tenantFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user)
  }
});

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
    update: ({ req, id }) => {
      const user = req.user;
      return isSuperAdmin(user) || user?.id === id;
    }
  },
  admin: {
    useAsTitle: 'email',
    hidden: ({ user }) => !isSuperAdmin(user)
  },
  auth: true,
  fields: [
    {
      name: 'username',
      required: true,
      unique: true,
      type: 'text'
    },
    {
      admin: {
        position: 'sidebar'
      },
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: ['user', 'super-admin'],
      access: {
        update: ({ req }) => isSuperAdmin(req.user)
      }
    },
    {
      ...defaultTenantsArrayField,
      admin: {
        ...defaultTenantsArrayField.admin,
        position: 'sidebar'
      }
    }
  ]
};
