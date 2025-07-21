import { getPayload } from '@/lib/payloadcms';

export const GET = async (request: Request) => {
  const payload = await getPayload();

  const data = await payload.find({ collection: 'users' });

  return Response.json(data);
};
