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
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 1, // 1 days
    path: '/',
    ...options
  });
};
