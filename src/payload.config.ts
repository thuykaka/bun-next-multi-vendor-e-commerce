// storage-adapter-import-placeholder
import path from 'path';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { buildConfig, Config } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { Categories } from './collections/Categories';
import { Media } from './collections/Media';
import { Orders } from './collections/Orders';
import { Products } from './collections/Products';
import { Reviews } from './collections/Reviews';
import { Tags } from './collections/Tags';
import { Tenants } from './collections/Tenants';
import { Users } from './collections/Users';
import { isSuperAdmin } from './lib/payloadcms';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname)
    },
    components: {
      beforeNavLinks: ['@/components/stripe-verify#StripeVerify']
    }
  },
  collections: [
    Users,
    Media,
    Categories,
    Products,
    Tags,
    Tenants,
    Orders,
    Reviews
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts')
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || ''
  }),
  cookiePrefix: 'funroad-auth',
  sharp,
  plugins: [
    payloadCloudPlugin(),
    multiTenantPlugin<Config>({
      collections: {
        products: {},
        media: {}
      },
      tenantsArrayField: {
        includeDefaultField: false
      },
      userHasAccessToAllTenants(user) {
        return isSuperAdmin(user);
      }
    }),
    // storage-adapter-placeholder,
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true
      },
      clientUploads: true,
      token: process.env.BLOB_READ_WRITE_TOKEN
    })
  ]
});
