import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

type SearchInputProps = {
  disabled?: boolean;
};

export default function SearchInput({ disabled = false }: SearchInputProps) {
  return (
    <div className='flex w-full items-center gap-2 pt-20'>
      <div className='relative w-full'>
        <SearchIcon className='absolute top-1/2 left-2 size-4 -translate-y-1/2' />
        <Input
          disabled={disabled}
          placeholder='Search for a product...'
          className='border-border bg-background pl-8'
        />
      </div>
    </div>
  );
}
