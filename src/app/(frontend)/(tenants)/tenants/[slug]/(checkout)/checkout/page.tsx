import CheckoutView from '@/modules/checkout/ui/views/checkout-view';

export default async function CheckoutPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CheckoutView slug={slug} />;
}
