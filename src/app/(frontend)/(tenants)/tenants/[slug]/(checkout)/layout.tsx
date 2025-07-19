import { CheckoutNavbar } from '@/modules/checkout/ui/components/navbar';
import Footer from '@/modules/home/ui/components/footer';

export default async function CheckoutLayout({
  params,
  children
}: {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}) {
  const { slug } = await params;

  return (
    <main className='flex min-h-screen w-full flex-col overflow-y-auto'>
      <CheckoutNavbar slug={slug} />

      <div className='flex h-16'></div>
      <div className='flex min-h-0 flex-1 flex-col gap-4 p-4 lg:px-10'>
        {children}
      </div>
      <Footer />
    </main>
  );
}
