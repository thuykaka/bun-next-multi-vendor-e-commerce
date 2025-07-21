import { checkAuth } from '@/lib/payloadcms';
import { StripeVerifyView } from '@/modules/tenants/ui/views/stripe-verify-view';

export default async function StripeVerify() {
  await checkAuth();
  return <StripeVerifyView />;
}
