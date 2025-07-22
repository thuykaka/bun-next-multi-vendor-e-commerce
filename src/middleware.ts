import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || ''; // e.g. 'example.com' or 'thuy.example.com'

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;

  if (
    hostname.endsWith(`.${rootDomain}`) &&
    process.env.NEXT_PUBLIC_USING_REG_DOMAIN === 'true'
  ) {
    const tenantSlug = hostname.replace(`.${rootDomain}`, '');
    // Rewrite the URL to the tenant's URL, e.g. thuy.example.com/products/123 -> /tenants/thuy/products/123
    return NextResponse.rewrite(
      new URL(`/tenants/${tenantSlug}${url.pathname}`, req.url)
    );
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api/|_next/|_static/|_vercel|media/|[\w-]+\.\w+).*)']
};
