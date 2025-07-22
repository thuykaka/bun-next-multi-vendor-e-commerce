export const getTenantUrl = (slug: string) => {
  if (process.env.NODE_ENV === 'development') {
    return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tenants/${slug}`;
  }
  return `https://${slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
};
