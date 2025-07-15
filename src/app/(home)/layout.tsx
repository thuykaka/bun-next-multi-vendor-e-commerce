import Footer from '@/modules/home/ui/components/footer';
import Navbar from '@/modules/home/ui/components/navbar';

export default function HomeLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='flex min-h-screen w-full flex-col overflow-y-auto'>
      <Navbar />
      <div className='bg-background absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#dadde2_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)]' />
      <div className='mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-4 p-4 pt-24 lg:pr-0 lg:pl-0'>
        {children}
      </div>
      <Footer />
    </main>
  );
}
