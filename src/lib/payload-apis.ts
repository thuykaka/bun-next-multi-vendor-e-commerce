import configPromise from '@payload-config';
import { getPayload } from 'payload';

const payload = await getPayload({ config: configPromise });

export const getCategories = async () => {
  const categories = await payload.find({
    collection: 'categories',
    depth: 1,
    where: {
      parent: {
        exists: false
      }
    },
    sort: 'name',
    pagination: false
  });

  return categories;
};
