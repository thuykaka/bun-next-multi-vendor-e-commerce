import configPromise from '@payload-config';
import { getPayload } from 'payload';

export default async function Home() {
  const payload = await getPayload({ config: configPromise });

  const data = await payload.find({
    collection: 'categories'
  });

  return (
    <>
      <h1 className='text-4xl font-bold'>Welcome to Funroad</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
