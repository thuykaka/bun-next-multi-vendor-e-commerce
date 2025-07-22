import 'server-only';
import { cookies as getCookies } from 'next/headers';

export const setCookie = async (
  name: string,
  value: string,
  options: Record<string, unknown> = {}
) => {
  const cookies = await getCookies();

  cookies.set({
    name,
    value,
    httpOnly: true,
    ...(process.env.NEXT_PUBLIC_USING_REG_DOMAIN === 'true' && {
      sameSite: 'none',
      domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN
    }),
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 1, // 1 days
    path: '/',
    ...options
  });
};
