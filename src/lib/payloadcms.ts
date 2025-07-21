import 'server-only';
import config from '@payload-config';
import { headers as getHeaders } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPayload as _getPayload, BasePayload } from 'payload';

let payloadInstance: BasePayload | null = null;

export const getPayload = async (): Promise<BasePayload> => {
  if (!payloadInstance) {
    payloadInstance = await _getPayload({ config });
  }
  return payloadInstance;
};

export const getSession = async () => {
  const headers = await getHeaders();
  const payload = await getPayload();
  const session = await payload.auth({ headers });
  return session;
};

export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getSession();
  return Boolean(session?.user);
};

export const checkAuth = async (
  redirectTo: string = '/sign-in'
): Promise<void> => {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    redirect(redirectTo);
  }
};

export const checkUnAuth = async (redirectTo: string = '/'): Promise<void> => {
  const isAuth = await isAuthenticated();
  if (isAuth) {
    redirect(redirectTo);
  }
};

export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user || null;
};
