// storage-adapter-import-placeholder
import path from 'path';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig, Config } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { Categories } from './collections/Categories';
import { Media } from './collections/Media';
import { Products } from './collections/Products';
import { Tags } from './collections/Tags';
import { Tenants } from './collections/Tenants';
import { Users } from './collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname)
    }
  },
  collections: [Users, Media, Categories, Products, Tags, Tenants],
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
        products: {}
      },
      tenantsArrayField: {
        includeDefaultField: false
      },
      userHasAccessToAllTenants(user) {
        return !!user?.roles?.includes('super-admin');
      }
    })
    // storage-adapter-placeholder
  ]
});
