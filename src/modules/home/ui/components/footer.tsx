import Logo from './logo';

export default function Footer() {
  return (
    <footer className='bg-background flex justify-between border-t p-4 text-sm'>
      <div className='mx-auto flex w-full max-w-7xl items-center gap-x-4'>
        <Logo className='text-xl!' />
        <span>Copyright © 2025 Funroad</span>
      </div>
    </footer>
  );
}
